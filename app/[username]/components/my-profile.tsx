import { hackerMedium } from "@/fonts/font";
import { UserInterface } from "@/app/[username]/lib/interface";
import { Tab } from "@/app/[username]/components/tabs";
import { ProfileCard } from "@/app/[username]/components/profile-card";
import { DynamicSvgIcon } from "@/components/component/dynamic-svg-icon";
import { useRouter } from "next/navigation";

export const MyProfile = ({ profile }: { profile: UserInterface }) => {
  const router = useRouter();
  const kudentsNumber = Number(profile.citizen) > 9 ? profile.citizen : `0${profile.citizen}`
  const kudentTagline = profile.citizen === 2 ? "404: Sleep Not Found" : "Figuring It Out, One All-Nighter at a Time"
  return (
    <div className="w-full flex flex-col   h-screen overflow-y-scroll scroll-hidden border-r">
      {/* user top small screen */}
      <div className="flex lg:hidden min-h-14 max-h-14 h-14 px-5 border-b border-darkBorder justify-start items-center space-x-5 cursor-pointer"
        onClick={() => router.back()}

      >
        <DynamicSvgIcon
          src='/arrow-left.svg'
          isActive={false}
          size={25}
        />
        <div className="h-full flex flex-col justify-center items-center">
          <span className="" style={hackerMedium.style}>{profile.fullName}</span>

        </div>

      </div>

      {/* user top */}
      <div
        className="w-full hidden lg:flex justify-center items-center px-6 border-b min-h-14"
        style={hackerMedium.style}
      >

        <button

          className="border flex justify-center items-center space-x-2 px-2.5 py-1.5 rounded-xl shadow-sm"
        >

          <img
            className="h-5 w-auto"
            src="/kampus.svg"
            alt="kampus logo white"
          />
          <span className="text-sm">
            {` Kudents ID #${kudentsNumber} – ${kudentTagline}
`}
          </span>
        </button>
      </div>

      {/* profile card */}
      <ProfileCard profile={profile} myProfile={true} />

      <Tab profile={profile} owner={true} />
    </div>
  );
};
