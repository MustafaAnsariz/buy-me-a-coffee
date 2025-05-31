import Image from "next/image"; 
import Link from "next/link";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

export default async function Home() {
  const session = await getServerSession();

  let Crusername = null;
  if (session) {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: session.user.email });
    Crusername = user?.username;
  }

  return (
    <>
      <div className="flex flex-col items-center justify-center md:h-[44vh] py-2 gap-4 text-white">
        <div className="font-bold text-5xl flex flex-col md:flex-row items-center justify-center text-center m-4"> Buy me a Coffee <span className="flex justify-center"> <img src="/coffee-drink.gif" width={44} alt="Coffee drink animation" /></span> </div>
        <p className="text-center opacity-50 font-bold m-4 md:m-1"> A crowdfunding platform for creators. Get funded by your followers. </p>
        <div>
          <Link href={session ? `/${Crusername}` : "/login"}>
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Now</button>
          </Link>

          <Link href="https://www.buymeacoffee.com/">
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
          </Link>
        </div>
        <div className="flex flex-col items-center md:block mt-4">
          <img className="rounded-full w-[74px] h-[74px]" src="/coffee-drink.gif" alt="Coffee drink animation" />
        </div>
      </div>

      <div className="bg-white h-1 opacity-5 mt-4"></div>

      <div className="text-white container mx-auto pt-12 pb-18">
        <h2 className="text-center font-bold text-2xl mb-10">
          Your Followers Can Buy You a Coffee
        </h2>
        <div className="flex flex-col md:flex-row justify-around items-stretch gap-6 md:gap-8">


          <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img className="rounded-full w-[80px] h-[80px] mb-4" src="/credit-card.gif" alt="Animated credit card" />
            <p className="font-bold text-lg mb-1">Take My Money</p>
            <p className="opacity-70 text-sm">Take the plunge and get started with your creative journey.</p>
          </div>


          <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img className="rounded-full w-[80px] h-[80px] mb-4" src="/pengu-inflation.gif" alt="Animated penguin with money" />
            <p className="font-bold text-lg mb-1">Fund Yourself</p>
            <p className="opacity-70 text-sm">Your fans are ready to support your passion and buy you a coffee.</p>
          </div>


          <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
            <img className="rounded-full w-[80px] h-[80px] mb-4" src="/rich.gif" alt="Animated character getting rich" />
            <p className="font-bold text-lg mb-1">Get Rich</p>
            <p className="opacity-70 text-sm">Unlock your earning potential and get funded by your dedicated fans.</p>

          </div>

        </div>
      </div>

      <div className="bg-white h-1 opacity-5 mt-12"></div>

      <div className="text-white container mx-auto pt-12 pb-18 flex flex-col items-center gap-5">
        <h2 className="text-center font-bold text-2xl mb-7">Learn More About Us</h2>
        <div className="w-full max-w-2xl aspect-video">
          <iframe
            className="rounded-2xl w-full h-full"
            src="https://www.youtube.com/embed/fjHO4fAfCf0?si=20nEy_BKvd4esZv7"
            title="YouTube video player: Learn About Us"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen>
          </iframe>
        </div>
      </div>
    </>
  );
}
