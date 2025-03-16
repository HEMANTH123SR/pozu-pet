import Image from "next/image";
import Link from "next/link";

const profiles = [
  {
    username: "aryan8058",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocJGH2Gmj0N2XWeVhn0EnnQ2z3B6ZVLwrdkaZN7AmTelM6D4ARF5=s96-c",
  },
  {
    username: "naveensaini",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocIw2vL0jGWAKOl0XwdrjMi1gSQoexFKBpSYM2QBg9_MeML3Wg=s96-c",
  },
  {
    username: "akashlkunde",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocLdTEJG4mnkT5839r5uQDbPhT29OSccBN3p7c3oZB-SyHmF89O5=s96-c",
  },

  {
    username: "aadil1111",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocJ1pZicEWR1QeRNd6EluzG-cL444Sg4edf17m4tuKrgXn07p2vm=s96-c",
  },
  {
    username: "iprankur",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocL2Shx47Znw1O2qVs5vE3dPUiJ7M1IGZwJnNyztSecIScRgVw=s96-c",
  },
  {
    username: "partha0007",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocJbx8_dMMAs4IYBjN_vt8TSr5EbFOvTnfYdy-eOlzaVoZwDmvpXVw=s96-c",
  },
  {
    username: "k_h_a_n_1233",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocJGCbq6p8Em31puuJI4Ic9lNXaTvAPJYnX5NHEl1vfPdzZ3fQ=s96-c",
  },
  {
    username: "mukulhowale",

    imageUrl:
      "https://lh3.googleusercontent.com/a/ACg8ocKJFvmU2WEq7RBfUg7WIy5uqQbUHvUXr3VQ5pLBBzdnjtB3KA=s96-c",
  },
  {
    username: "alex",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F1a3318330cf1734feb84887e9453fb1b.png&w=280&q=75",
  },
  {
    username: "jina",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F944c5ba154e0489274504f38d01bcfaf.png&w=280&q=75",
  },
  {
    username: "lisa",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F5c9a412b4e80d08303731bca471d3b63.png&w=280&q=75",
  },
  {
    username: "kate",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F44f647f9e3c4767d3b83e89e67917f41.png&w=280&q=75",
  },
  {
    username: "neil",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fbaa928fef9b0f2e838263dd88eefc707.png&w=280&q=75",
  },
  {
    username: "jenny",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F644dfc35027924a6e5dfbcad653be697.png&w=280&q=75",
  },
  {
    username: "pavan",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F8940e8ea369def14e82f05a5fee994b9.png&w=280&q=75",
  },
  {
    username: "kessy",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fc29e12118b27e54e8883db0b98c610df.png&w=280&q=75",
  },
  {
    username: "tina",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F4184423b57c070204a1942282818dc0c.png&w=280&q=75",
  },
  {
    username: "sera",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Ff3382b5fa7e14fcab30d4279f203c83a.png&w=280&q=75",
  },
  {
    username: "rynder",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F1bab427466457e745328f6eb8fa227e1.png&w=280&q=75",
  },
  {
    username: "ben",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Ff0474688ec350e08543f55b3771dcada.png&w=280&q=75",
  },
  {
    username: "kimsun",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F897cda132d24997b106d57ccd0530927.png&w=280&q=75",
  },
  {
    username: "rika",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fbc8e6056aa877de4ae5ab1321f776ade.png&w=280&q=75",
  },
  {
    username: "jafa",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F622e4c7767d4eb0307179d6dfda9248b.png&w=280&q=75",
  },
  {
    username: "farahan",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Ff0fb14746f3fc6020a0e1afdd089a4fb.png&w=280&q=75",
  },
  {
    username: "pete",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F4b59f1b8af326b6381c39ab29c3612d6.png&w=280&q=75",
  },
  {
    username: "hina gowda",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F1a270860bac2c66b434968a3047822e3.png&w=280&q=75",
  },
  {
    username: "fate",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F2866b308b3c70e895e34b3130f10abf3.png&w=280&q=75",
  },
  {
    username: "carl",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F78c7bf3d348d505f15d332f9a58092f7.png&w=280&q=75",
  },
  {
    username: "jiso",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F33642b1fa839338a7d53d78336a45ff0.png&w=280&q=75",
  },
  {
    username: "devin",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F5cd1cd3d1851e162616256ebe2a4c30a.png&w=280&q=75",
  },
  {
    username: "sora",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fe2cb7b8c41eba64187df1fc6128a3f8e.png&w=280&q=75",
  },
  {
    username: "hinath",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fdae17037af459cca4ed1b8a474e7428e.png&w=280&q=75",
  },
  {
    username: "tate",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fd447a9fd5010652f6c0911fbe9c662c6.png&w=280&q=75",
  },
  {
    username: "pizoa",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F098d5b19a0870d95bee0cdbcef632be1.png&w=280&q=75",
  },
  {
    username: "dimory",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fecf088e6a05f2c8d5c041384e3568b46.png&w=280&q=75",
  },
  {
    username: "namory",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F7d24c27f40be0d43618f6d49e26a3288.png&w=280&q=75",
  },
  {
    username: "kachi",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F119d9abaee7a1e987571f0fe776bd1a5.png&w=280&q=75",
  },
  {
    username: "cesat",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F44198079c5211172a61405b5049f3bfb.png&w=280&q=75",
  },
  {
    username: "taras",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fbb8c76bcb73cf00e7d4ab920447a365c.png&w=280&q=75",
  },
  {
    username: "joseph",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2F321f5bcb6efc56013d67ae101f196eaf.png&w=280&q=75",
  },
  {
    username: "suprun",
    imageUrl:
      "https://tabler.io/_next/image?url=%2Favatars%2Fdefault%2Fd1499909450ba526d5297e3ebc7f6d07.png&w=280&q=75",
  },
];

// export const ProfileGrid = () => {
//   return (
//     <div className="flex justify-center items-center">
//       <div className="flex  flex-wrap h-10 w-[90%] items-center justify-center">
//         {profiles.slice(0, 33).map((profile) => (
//           <Link
//             key={profile.username}
//             href={`/${profile.username}`}
//             className="w-12  min-h-12 m-2 rounded-full relative person-profile"
//             target="_blank"
//             rel="nofollow noreferrer"
//             title={profile.username}
//           >
//             <Image
//               src={profile.imageUrl}
//               alt={`${profile.username}'s profile`}
//               fill
//               className="rounded-full"
//               style={{ objectFit: "contain" }}
//             />
//           </Link>
//         ))}
//       </div>
//     </div>
//   );
// };

export const ProfileGrid = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-wrap h-10 w-[90%] items-center justify-center">
        {profiles.slice(0, 33).map((profile) => (
          <Link
            key={profile.username}
            href={`/${profile.username}`}
            className="group w-12 min-h-12 m-2 rounded-full relative person-profile transition-all duration-300 ease-in-out hover:z-10"
            target="_blank"
            rel="nofollow noreferrer"
            title={profile.username}
          >
            <Image
              src={profile.imageUrl}
              alt={`${profile.username}'s profile`}
              fill
              className="rounded-full transition-all duration-300 ease-in-out 
                            group-hover:scale-200 
                            group-hover:brightness-110 
                            group-hover:shadow-lg
                            origin-center
                            
                            # Nearby images effect
                            group-hover:sibling:scale-110"
              style={{ objectFit: "contain" }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
