"use client";
import { FourZeroFour } from "@/components/component/404"
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserInterface } from "@/app/[username]/lib/interface";
import { MyProfile } from "@/app/[username]/components/my-profile";
import { UserProfile } from "@/app/[username]/components/user-profile";
import { useRouter } from "next/navigation";
import { SmallLoading } from "@/components/component/small-loading";

const UserProfilePage = ({ params }: { params: { username: string } }) => {
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
        const response = await fetch(`/api/user/get-user/${params.username}`);
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
  }, [isLoaded, user, params.username, router]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen border-r w-full">
        <SmallLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center w-full h-screen border-r overflow-y-scroll scroll-hidden ">
        {/* <div className="text-red-500">{error}</div> */}
        <FourZeroFour />
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  if (user?.username === params.username) {
    return <MyProfile profile={userData} />;
  }

  return <UserProfile profile={userData} />;
};

export default UserProfilePage;
