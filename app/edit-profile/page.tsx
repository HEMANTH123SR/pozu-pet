"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserInterface } from "@/app/[username]/lib/interface";
import { useRouter } from "next/navigation";
import { EditProfileForm } from "@/app/edit-profile/component/edit-profile-component";
import { SmallLoading } from "@/components/component/small-loading";
const EditProfile = () => {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [userData, setUserData] = useState<UserInterface | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded) return;

      if (!user) {
        router.push("/sign-in");
        return;
      }

      try {
        const response = await fetch(`/api/user/get-user/${user.username}`);
        const data = await response.json();

        if (data.success) {
          setUserData(data.data);
        } else {
          setError("User not found");
        }
      } catch (err) {
        console.log(err);
        setError("Error fetching user data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen border-r w-full">
        <SmallLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen border-r">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <EditProfileForm
      user={userData}
      userId={user.publicMetadata.mongoDbUserId}
    />
  );
};

export default EditProfile;
