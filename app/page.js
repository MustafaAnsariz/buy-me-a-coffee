import Image from "next/image";
import Link from "next/link";
import User from "@/models/User"; // Your User model
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { fetchActiveCreators } from "@/actions/fetchActiveCreators"; // Your server action

// Import your new animated client components here (examples below)
import AnimatedHeroText from "@/components/AnimatedHeroTextClient"; // Example
import AnimatedSection from "@/components/AnimatedSectionClient"; // Example for other sections

export default async function Home() {
  const session = await getServerSession();

  let Crusername = null;
  if (session && session.user && session.user.email) { // Ensure session.user and session.user.email exist
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ email: session.user.email });
    Crusername = user?.username;
  }

  const activeCreators = await fetchActiveCreators(3);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 md:py-20 gap-6 text-white text-center">
        <AnimatedHeroText>
          <div className="font-bold text-5xl sm:text-6xl md:text-7xl flex flex-col md:flex-row items-center justify-center gap-x-4 m-4">
            Buy me a Coffee
            <span className="flex justify-center mt-2 md:mt-0">
              <img src="/coffee-drink.gif" width={80} alt="Coffee drink animation" />
            </span>
          </div>
          <p className="text-lg md:text-xl opacity-70 font-medium m-4 md:m-1 max-w-2xl">
            A crowdfunding platform for creators. Get funded by your followers.
          </p>
       
          {/* Apply mx-auto to this paragraph */}
          <p className="text-md md:text-lg opacity-60 font-normal mt-2 max-w-xl px-4 mx-auto">
            Easily create your page, share it with your audience, and start receiving support for your creative work in minutes!
          </p>
        </AnimatedHeroText> 

        <div className="mt-6"> 
          <Link href={session ? (Crusername ? `/${Crusername}` : "/dashboard") : "/login"}>
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base px-8 py-3 text-center me-2 mb-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              {session ? (Crusername ? "Go to Your Page" : "Complete Your Profile") : "Start Now"}
            </button>
          </Link>
          <Link href="https://www.buymeacoffee.com/" target="_blank" rel="noopener noreferrer">
            <button type="button" className="text-white bg-gradient-to-r from-slate-700 to-slate-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-slate-500 dark:focus:ring-slate-800 font-medium rounded-lg text-base px-8 py-3 text-center me-2 mb-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Read More
            </button>
          </Link>
        </div>
      </div>


      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12 md:my-16"></div>

      {/* Discover Creators Section - Wrapped in AnimatedSection */}
      <AnimatedSection>
        <div className="container mx-auto px-4 py-12 md:py-16 text-white">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="font-bold text-4xl md:text-5xl mb-3">Discover Creators</h2>
            <p className="text-xl opacity-70 font-medium max-w-xl">
              Support your favorite creators and get early access to their content.
            </p>
          </div>

          {activeCreators && activeCreators.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center text-white mb-10">
                Support a Creator
              </h2>
              <div className="flex flex-wrap justify-center items-stretch gap-8">
                {activeCreators.map((creator, index) => (
                  <div key={creator.username} className="w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.333rem)] lg:w-[calc(25%-1.5rem)] flex">
                    {/* Individual card animation can be done inside this Link or its child if needed */}
                    <Link href={`/${creator.username}`} className="w-full h-full">
                      <div className="bg-slate-800 rounded-xl shadow-xl p-6 hover:bg-slate-700/80 transition-all duration-300 flex flex-col items-center text-center h-full transform hover:-translate-y-2 hover:shadow-purple-500/30">
                        <img
                          src={creator.profilePicture || "/default-avatar.png"}
                          alt={creator.name || creator.username}
                          className="w-28 h-28 rounded-full object-cover mb-5 border-4 border-purple-500 shadow-md"
                        />
                        <h3 className="text-2xl font-semibold text-white mb-2">
                          {creator.name || creator.username}
                        </h3>
                        <p className="text-md text-slate-400 mb-6">
                          @{creator.username}
                        </p>
                        <span className="mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white text-base font-medium py-2.5 px-6 rounded-lg transition-colors duration-300">
                          Support {creator.name ? creator.name.split(' ')[0] : creator.username}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center">
            <p className="opacity-70 font-medium m-4 md:m-1 capitalize text-lg mb-6">
              You can support more creators on the creators page.
            </p>
            <Link href={"/creators"}>
              <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-base px-8 py-3 text-center me-2 mb-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                All Creators
              </button>
            </Link>
          </div>
        </div>
      </AnimatedSection> {/* End of AnimatedSection for Discover Creators */}


      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12 md:my-16"></div>

      {/* Your Followers Section - Wrapped in AnimatedSection */}
      <AnimatedSection>
        <div className="text-white container mx-auto py-12 md:py-16 px-4">
          <h2 className="text-center font-bold text-4xl md:text-5xl mb-12">
            Your Followers Can Buy You a Coffee
          </h2>
          <div className="flex flex-col md:flex-row justify-around items-stretch gap-6 md:gap-8">
            {/* Card 1 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-700/80 hover:shadow-blue-500/30 transform hover:-translate-y-1">
              <img className="rounded-full w-24 h-24 mb-5" src="/credit-card.gif" alt="Animated credit card" />
              <p className="font-bold text-2xl mb-2">Take My Money</p>
              <p className="opacity-70 text-md">Take the plunge and get started with your creative journey.</p>
            </div>
            {/* Card 2 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-700/80 hover:shadow-purple-500/30 transform hover:-translate-y-1">
              <img className="rounded-full w-24 h-24 mb-5" src="/pengu-inflation.gif" alt="Animated penguin with money" />
              <p className="font-bold text-2xl mb-2">Fund Yourself</p>
              <p className="opacity-70 text-md">Your fans are ready to support your passion and buy you a coffee.</p>
            </div>
            {/* Card 3 */}
            <div className="flex flex-col items-center text-center w-full md:w-1/3 bg-slate-800 p-8 rounded-xl shadow-xl transition-all duration-300 hover:scale-105 hover:bg-slate-700/80 hover:shadow-green-500/30 transform hover:-translate-y-1">
              <img className="rounded-full w-24 h-24 mb-5" src="/rich.gif" alt="Animated character getting rich" />
              <p className="font-bold text-2xl mb-2">Get Rich</p>
              <p className="opacity-70 text-md">Unlock your earning potential and get funded by your dedicated fans.</p>
            </div>
          </div>
        </div>
      </AnimatedSection> {/* End of AnimatedSection for Your Followers */}

      {/* Separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent my-12 md:my-16"></div>

      {/* Learn More About Us Section - Wrapped in AnimatedSection */}
      <AnimatedSection>
        <div className="text-white container mx-auto py-12 md:py-16 px-4 flex flex-col items-center gap-6">
          <h2 className="text-center font-bold text-4xl md:text-5xl mb-8">Learn More About Us</h2>
          <div className="w-full max-w-3xl aspect-video rounded-2xl shadow-2xl overflow-hidden border-2 border-slate-700 hover:shadow-purple-500/40 transition-shadow duration-300">
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
      </AnimatedSection> {/* End of AnimatedSection for Learn More */}
      
      <div className="py-8"></div>
    </>
  );
}
