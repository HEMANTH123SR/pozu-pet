// "use client"
// import { Card, CardContent } from "@/components/ui/card"
// import { hackerMedium } from "@/fonts/font"
// import { useSignIn, useSignUp } from "@clerk/nextjs"
// import { usePathname } from "next/navigation"

// export function SignUpCard() {
//     const { signIn, isLoaded: signInLoaded } = useSignIn()
//     const { signUp, isLoaded: signUpLoaded } = useSignUp()  // Fixed: Use useSignUp hook properly
//     // const router = useRouter()
//     const pathname = usePathname()

//     const handleGoogleAuth = async (isSignUp = false) => {
//         // Check if either signIn or signUp is not loaded based on the action
//         if ((!signInLoaded && !isSignUp) || (!signUpLoaded && isSignUp)) return

//         try {
//             // Store the current path if it's a protected route
//             if (pathname) {
//                 localStorage.setItem('returnTo', pathname)
//             }

//             // Choose the appropriate auth method based on isSignUp
//             const authMethod = isSignUp ? signUp : signIn

//             await authMethod?.authenticateWithRedirect({
//                 strategy: "oauth_google",
//                 redirectUrl: "/sso-callback",
//                 redirectUrlComplete: isSignUp ? "/" : "/dashboard"
//             })
//         } catch (error) {
//             console.error("OAuth error:", error)
//         }
//     }

//     return (
//         <div className="flex flex-col h-screen border-r">
//             <Card className="border-0 shadow-none bg-darkBackground">
//                 <CardContent className="p-8">
//                     <div className="max-w-sm mx-auto space-y-6">
//                         {/* Heading */}
//                         <div className="space-y-2">
//                             <h2 className="text-2xl font-semibold tracking-tight text-foreground capitalize"
//                                 style={hackerMedium.style}
//                             >
//                                 Not your typical campus network!
//                             </h2>
//                             <p className="text-muted-foreground text-sm leading-relaxed">
//                                 Are you building projects, joining clubs, organizing events, or looking for campus opportunities?
//                             </p>
//                         </div>

//                         {/* Sign Up CTA Button */}
//                         <CTA onClick={() => handleGoogleAuth(true)} label="Sign up with Google" />

//                         {/* Sign In Option */}
//                         <div className="text-center">
//                             <p className="text-sm text-muted-foreground">
//                                 Already have an account?{" "}
//                                 <button
//                                     onClick={() => handleGoogleAuth(false)}
//                                     className="text-primary hover:underline"
//                                 >
//                                     Sign in
//                                 </button>
//                             </p>
//                         </div>

//                         {/* Footer Text */}
//                         <p className="text-xs text-center text-muted-foreground">
//                             Claim your username before it&apos;s too late!
//                         </p>

//                         {/* Decorative Elements */}
//                         <div className="pt-6 border-t border-border/40">
//                             <div className="flex items-center justify-between text-sm text-muted-foreground">
//                                 <div className="flex items-center gap-2">
//                                     <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
//                                     <span>Verified Community</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <div className="h-1.5 w-1.5 rounded-full bg-primary" />
//                                     <span>Student Only</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     )
// }

// const CTA = ({ onClick, label }) => {
//     return (
//         <div className="relative group"
//             style={hackerMedium.style}
//         >
//             <button
//                 onClick={onClick}
//                 className="relative w-full text-sm xl:text-base justify-center flex rounded-2xl items-center 
//                    bg-primary text-white 
//                    border-[3px] border-purple-950 py-1.5 
//                    shadow-lg hover:shadow-purple-600/50
//                    transition-all duration-300 ease-out 
//                    hover:scale-105 space-x-2"
//             >
//                 <span className="group-hover:tracking-wider transition-all">
//                     {label}
//                 </span>
//             </button>
//         </div>
//     )
// }



"use client"
import { Card, CardContent } from "@/components/ui/card"
import { hackerMedium } from "@/fonts/font";
import Link from 'next/link'

export function SignUpCard() {
    return (
        <div className="flex flex-col h-screen border-r">
            <Card className="border-0 shadow-none bg-darkBackground">
                <CardContent className="p-8">
                    <div className="max-w-sm mx-auto space-y-6">
                        {/* Heading */}
                        <div className="space-y-2">
                            <h2 className="text-2xl font-semibold tracking-tight text-foreground capitalize"
                                style={hackerMedium.style}
                            >
                                Not your typical campus network!
                            </h2>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Are you building projects, joining clubs, organizing events, or looking for campus opportunities?
                            </p>
                        </div>

                        {/* CTA Button */}
                        <CTA />

                        {/* Footer Text */}
                        <p className="text-xs text-center text-muted-foreground">
                            Claim your username before it&apos;s too late!
                        </p>

                        {/* Decorative Elements */}
                        <div className="pt-6 border-t border-border/40">
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                    <span>Verified Community</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                    <span>Student Only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

const CTA = () => {
    return (
        <div className="relative group"
            style={hackerMedium.style}
        >
            <Link
                href="/sign-up"
                className="relative w-full text-sm xl:text-base justify-center flex rounded-2xl items-center 
                   bg-primary  text-white 
                   border-[3px] border-purple-950 py-1.5 
                   shadow-lg hover:shadow-purple-600/50
                   transition-all duration-300 ease-out 
                   hover:scale-105 space-x-2"
            >

                <span className="group-hover:tracking-wider transition-all">
                    Create Your Profile
                </span>
            </Link>
        </div>
    );
};