// File: app/creators/page.js
import Link from "next/link";
import { fetchActiveCreators } from "@/actions/fetchActiveCreators";
import Image from "next/image"; // If using Next/Image for profile pictures

export const metadata = {
  title: 'Discover Creators - Buy Me a Coffee',
  description: 'Find and support talented creators on our platform.',
}

export default async function CreatorsPage() {
  // Fetch all active creators, or implement pagination in fetchActiveCreators
  const creators = await fetchActiveCreators(null); // Pass null or no arg for no limit, or implement pagination

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-white mb-10">
        Discover Creators
      </h1>
      {creators && creators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {creators.map((creator) => (
            <Link key={creator.username} href={`/${creator.username}`}>
              <div className="bg-slate-800 rounded-lg shadow-lg p-6 hover:bg-slate-700 transition-colors duration-300 flex flex-col items-center text-center h-full">
                <img
                  src={creator.profilePicture || "/default-avatar.png"}
                  alt={creator.name || creator.username}
                  className="w-28 h-28 rounded-full object-cover mb-4 border-2 border-purple-500"
                />
                <h3 className="text-xl font-semibold text-white mb-1">
                  {creator.name || creator.username}
                </h3>
                <p className="text-sm text-slate-400 mb-auto pb-4">
                  @{creator.username}
                </p>
                <span className="mt-auto inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-5 rounded-lg">
                  View Profile
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-400 text-xl">
          No active creators found at the moment. Check back soon!
        </p>
      )}
    </div>
  );
}
