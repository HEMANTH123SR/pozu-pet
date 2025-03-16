import { Moon, Bell } from "lucide-react";

export const TopRightMenu = () => {
  return (
    <div className="flex w-full h-12 px-6 max-h-12 min-h-12 border-b items-center justify-between space-x-5">
      <Bell size={24} strokeWidth={1.8} />
      <Moon size={24} strokeWidth={1.8} />
      {/* <img
        className="h-8 w-8 rounded-full"
        src="/profile.jpg"
        alt="profile picture"
      /> */}
      <div className=" space-x-3 items-center justify-center">
        Add Prefernce
      </div>
    </div>
  );
};

//size={24} strokeWidth={1.8
