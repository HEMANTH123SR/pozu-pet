import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from "@/db/index";
import { User } from "@/db/models/user.model";
import { UserCard } from '@/components/component/user-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { redirect } from 'next/navigation';
import { hackerMedium } from '@/fonts/font';
import Link from 'next/link';
import { DynamicSvgIcon } from '@/components/component/dynamic-svg-icon';


async function getNetworkData(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId })
      .populate('followers', 'username fullName profileImage bio university clerkId')
      .populate('following', 'username fullName profileImage bio university clerkId');

    if (!user) {
      throw new Error('User not found');
    }

    return {
      followers: user.followers,
      following: user.following
    };
  } catch (error) {
    console.error('Error fetching network data:', error);
    throw error;
  }
}

export default async function NetworkPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  let networkData;
  try {
    networkData = await getNetworkData(userId);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        Error loading network data
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0B0B0A] text-[#FDFCFD] w-full border-r border-darkBorder">
      <div className="h-full">
        <div className="w-full  h-full flex flex-col">

          {/* top bar */}
          <div className="w-full flex items-center justify-between p-3 border-b border-darkBorder  lg:px-6   z-10 min-h-14 h-14 ">
            <div className="flex items-center justify-start space-x-3.5">
              <Link
                href={"/"}
                className="p-1.5  rounded-full transition-transform duration-200  active:scale-95 hover:shadow-md hover:text-primary hover:scale-110"
              >

                <DynamicSvgIcon
                  isActive={false}
                  src='/arrow-left.svg'
                  size={25}
                />
              </Link>
              <span style={hackerMedium.style} >Go Back</span>
            </div>


            <span style={hackerMedium.style} >My Network</span>


          </div>







          <Tabs defaultValue="followers" className="w-full flex-1 flex flex-col">
            <TabsList className="flex-none w-full grid grid-cols-2 border-b border-darkBorder">
              <TabsTrigger
                value="followers"
                className="flex items-center space-x-2 text-base"
                style={hackerMedium.style}
              >
                <span>Followers</span>
                <span>({networkData.followers?.length || 0})</span>
              </TabsTrigger>
              <TabsTrigger
                value="following"
                className="flex items-center space-x-2 text-base"
                style={hackerMedium.style}
              >
                <span>Following</span>
                <span>({networkData.following?.length || 0})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="followers" className="flex-1 overflow-hidden mt-0 py-0">
              <div className="h-full overflow-y-auto scroll-hidden">
                <div className="divide-y divide-[#303130]">
                  {networkData.followers?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">No followers yet</p>
                  ) : (
                    networkData.followers?.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="following" className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto scroll-hidden">
                <div className="divide-y divide-[#303130]">
                  {networkData.following?.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Not following anyone yet</p>
                  ) : (
                    networkData.following?.map((user) => (
                      <UserCard key={user._id} user={user} />
                    ))
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}