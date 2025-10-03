import { User2, Music, Heart, Clock, ListMusic } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";

const Profile = () => {
    const { user } = useAuth();
    const { playedTracks } = useContext(PlayerContext);

    const formatDate = (dateString) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    return (
        <div className="text-white px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
            <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm border border-gray-700/50">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Profile Info */}
                    <div className="flex flex-col items-center md:items-start">
                        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
                            <User2 className="w-12 h-12 text-white" />
                        </div>
                        <h5 className="text-md font-semibold">Your Email</h5>
                        <p className="text-purple-400 text-sm mb-2">{user?.email}</p>
                        <h5 className="text-md font-semibold">Subscription Plan</h5>
                        <p className="text-purple-400 text-sm mb-2">{user?.subscriptionPlan || "FREE"}</p>
                        <h5 className="text-md font-semibold">Member Since</h5>
                        <p className="text-purple-400 text-sm mb-2">{formatDate(user?.createdAt)}</p>
                        <button className="mt-4 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all duration-300">
                            Edit Profile
                        </button>
                    </div>

                    {/* Profile Stats */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Heart className="w-5 h-5 text-purple-400" /> Favorite Playlists
                            </h3>
                            <p className="text-gray-400 mt-2">5 playlists • 180 songs</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all">
                                    <p className="font-semibold">Bollywood Chill</p>
                                    <p className="text-sm text-gray-400">25 songs</p>
                                </div>
                                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all">
                                    <p className="font-semibold">Punjabi Beats</p>
                                    <p className="text-sm text-gray-400">40 songs</p>
                                </div>
                                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all">
                                    <p className="font-semibold">Top Global Hits</p>
                                    <p className="text-sm text-gray-400">50 songs</p>
                                </div>
                                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all">
                                    <p className="font-semibold">Workout Energy</p>
                                    <p className="text-sm text-gray-400">35 songs</p>
                                </div>
                                <div className="bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-all">
                                    <p className="font-semibold">Romantic Classics</p>
                                    <p className="text-sm text-gray-400">30 songs</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-purple-400" /> Listening History
                            </h3>
                            <p className="text-gray-400 mt-2">Recently played {playedTracks.length > 0 ? playedTracks.length : 0} tracks</p>
                            <div className="space-y-2 mt-4">
                                {playedTracks.slice(0, 5).map((track, index) => (
                                    <div key={index} className="flex items-center gap-3 hover:bg-gray-700/30 p-2 rounded-lg transition-all">
                                        <img src={track.image || "https://res.cloudinary.com/dw0piz0ku/image/upload/v1759165548/hnhjfmguznbqkuwl69ca.jpg"} alt={track.name} className="w-10 h-10 rounded" />
                                        <div>
                                            <p className="text-sm font-semibold">{track.name}</p>
                                            <p className="text-xs text-gray-400">{track.singers?.join(', ') || "Artist Name"}</p>
                                        </div>
                                    </div>
                                ))}
                                {playedTracks.length === 0 && (
                                    <p className="text-gray-400 text-sm text-center">No recent tracks</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;