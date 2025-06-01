"use client";
import React, { useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title = "Login - Buy Me a Coffee";
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const buttonBaseStyle = "flex items-center justify-center w-full max-w-xs sm:max-w-sm text-white font-semibold rounded-lg shadow-lg px-6 py-3.5 text-base transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4";
  const googleColors = "bg-[#4285F4] hover:bg-[#357ae8] focus:ring-[#4285F4]/50";
  const githubColors = "bg-[#24292e] hover:bg-[#1f2328] focus:ring-[#24292e]/50";
  const discordColors = "bg-[#5865F2] hover:bg-[#4752C4] focus:ring-[#5865F2]/50";


  return (
    <div className="text-white container mx-auto pt-16 pb-20 min-h-[calc(100vh-120px)] flex flex-col items-center justify-center">
      <h1 className="font-black text-center text-4xl md:text-5xl mb-12">
        Join & Support Creators
      </h1>

      <div className="flex flex-col items-center gap-6 w-full"> 
      
        <button 
          onClick={() => signIn("google")}
          className={`${buttonBaseStyle} ${googleColors}`}
        >
          <svg
            className="h-6 w-6 mr-3" 
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-0.5 0 48 48" 
          >

            <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" fill="#FBBC05"></path>
            <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" fill="#EB4335"></path>
            <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" fill="#34A853"></path>
            <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" fill="#4285F4"></path>
          </svg>
          <span>Continue with Google</span>
        </button>


        <button
          onClick={() => signIn("github")}
          className={`${buttonBaseStyle} ${githubColors}`}
        >
          <svg
            className="h-7 w-7 mr-3" // Slightly larger for this icon, adjusted margin
            fill="currentColor" // Changed fill to currentColor to use text-white
            viewBox="0 0 24 24" // Using a common simplified GitHub icon viewBox
            aria-hidden="true"
          >
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.379.201 2.398.098 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.943.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
          </svg>
          <span>Continue with Github</span>
        </button>

      
        <button
          onClick={() => signIn("discord")}
          className={`${buttonBaseStyle} ${discordColors}`}
        >
          <svg 
            className="h-6 w-6 mr-3"
            fill="currentColor"
            viewBox="0 0 24 24" 
            aria-hidden="true"
          >
            <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.21.375-.444.864-.608 1.249a18.583 18.583 0 00-5.484 0 12.142 12.142 0 00-.617-1.236.074.074 0 00-.078-.037A19.718 19.718 0 003.679 4.37a.07.07 0 00-.033.055c-.046.336-.077.736-.077 1.096a16.095 16.095 0 003.061 10.073c.02.017.043.033.065.05.022.017.032.026.043.035a1.746 1.746 0 00.572.436 9.953 9.953 0 001.278.589c.43.16.895.295 1.374.396.406.086.83.146 1.272.178.042.003.084.003.126.003s.084 0 .126-.003c.442-.032.866-.092 1.272-.178.479-.101.944-.236 1.374-.396a10.23 10.23 0 001.278-.589 1.623 1.623 0 00.615-.47c.022-.017.043-.033.065-.05.02-.017.032-.026.043-.035a16.095 16.095 0 003.061-10.073.074.074 0 00-.077-1.151.07.07 0 00-.033-.055zM8.03 15.012q-.727 0-1.243-.516T6.27 13.254q0-.736.516-1.252t1.243-.516q.718 0 1.234.516T9.78 13.254q0 .736-.516 1.252t-1.234.504zm7.928 0q-.727 0-1.243-.516t-.516-1.242q0-.736.516-1.252t1.243-.516q.718 0 1.234.516T17.73 13.254q0 .736-.516 1.252t-1.234.504z"/>
          </svg>
          <span>Continue with Discord</span>
        </button>

      </div>
    </div>
  );
};

export default Login;
