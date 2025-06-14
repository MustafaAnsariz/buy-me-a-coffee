import Link from "next/link";
import { fetchActiveCreators } from "@/actions/fetchActiveCreators";
import CreatorImage from '@/components/CreatorImage';

export const metadata = {
  title: 'Discover Creators - Buy Me a Coffee',
  description: 'Find and support talented creators on our platform.',
}

export default async function CreatorsPage() {
  try {
    const creators = await fetchActiveCreators(null);

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-white mb-10">
          Discover Creators
        </h1>
        {creators && creators.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {creators.map((creator) => (
              <Link key={creator.username} href={`/${creator.username}`}>
                <div className="bg-slate-800 rounded-lg shadow-lg p-6 hover:bg-slate-700 transition-colors duration-300">
                  <CreatorImage
                    src={creator.profilePicture}
                    alt={creator.name || creator.username}
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-2 border-purple-500"
                  />
                  <h3 className="text-xl font-semibold text-white text-center mb-1">
                    {creator.name || creator.username}
                  </h3>
                  <p className="text-sm text-slate-400 text-center mb-4">
                    @{creator.username}
                  </p>
                  <span className="block w-full text-center bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-5 rounded-lg">
                    View Profile
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.318l-1.318 2.637L8.046 7.37l1.318 2.637L8.046 12.63l2.636.415L12 15.682l1.318-2.637 2.636-.415-1.318-2.637 1.318-2.637-2.636-.415L12 4.318z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">
              No Active Creators Yet
            </h3>
            <p className="text-gray-500">
              Be the first to set up your creator profile!
            </p>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in CreatorsPage:", error);
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Discover Creators</h1>
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">
            Unable to load creators. Please try again later.
          </p>
        </div>
      </div>
    );
  }
}
