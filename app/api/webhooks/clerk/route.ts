import { Webhook } from "svix";
import { headers } from "next/headers";
import { clerkClient, WebhookEvent } from "@clerk/nextjs/server";
import { createUser } from "@/actions/user.actions";
import { logger } from "@/lib/logger";

interface UserPayload {
  username: string;
  clerkId: string;
  fullName: string;
  email: string;
  profileImage: string;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    logger.error("Missing WEBHOOK_SECRET in environment");
    return new Response("Configuration Error", { status: 500 });
  }

  try {
    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
      "svix-signature": headerPayload.get("svix-signature"),
    };

    if (Object.values(svixHeaders).some((header) => !header)) {
      logger.warn("Missing Svix headers", { headers: svixHeaders });
      return new Response("Invalid Headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;
    try {
      evt = wh.verify(body, svixHeaders) as WebhookEvent;
    } catch (verifyError) {
      logger.error("Webhook verification failed", { error: verifyError });
      return new Response("Verification Failed", { status: 403 });
    }

    if (evt.type === "user.created") {
      const {
        id,
        image_url,
        username,
        email_addresses,
        first_name,
        last_name,
      } = evt.data;

      const userPayload: UserPayload = {
        username: username || `user_${id.slice(-8)}`,
        clerkId: id,
        fullName: `${first_name || ""} ${last_name || ""}`.trim(),
        email: email_addresses[0]?.email_address || "",
        profileImage: image_url || "/default-avatar.png",
      };

      if (!userPayload.email) {
        logger.warn("No email provided for user", { clerkId: id });
        const client = await clerkClient();
        await client.users.deleteUser(id);
        return new Response("Email required", { status: 400 });
      }

      const createUserWithTimeout = async () => {
        const createPromise = createUser(userPayload);
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("User creation timeout")), 5000)
        );

        return Promise.race([createPromise, timeoutPromise]);
      };

      try {
        const newUser = await createUserWithTimeout();

        if (!newUser) {
          throw new Error("Failed to create user in MongoDB");
        }

        const client = await clerkClient();
        await client.users.updateUser(id, {
          publicMetadata: {
            mongoDbUserId: newUser._id,
          },
        });

        logger.info("User created successfully", {
          clerkId: id,
          mongoUserId: newUser._id,
        });
      } catch (userCreateError) {
        const client = await clerkClient();
        await client.users.deleteUser(id);

        logger.error("User creation failed", {
          error: userCreateError,
          clerkId: id,
        });

        return new Response("User creation failed", { status: 400 });
      }
    }

    return new Response("", { status: 200 });
  } catch (error) {
    logger.error("Unexpected webhook processing error", { error });
    return new Response("Internal Server Error", { status: 500 });
  }
}
