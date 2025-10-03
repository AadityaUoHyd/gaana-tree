import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";
import { ChevronLeft, Music, Play, Share2, Facebook, Twitter, MessageCircle, Linkedin, Heart } from "lucide-react";
import toast from "react-hot-toast";
import Comment from "./Comment.jsx"; // Import the new Comment component

const SongInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { songsData, albumsData, playWithId, likedSongs, toggleSongLike } = useContext(PlayerContext);
    // Find the song by ID
    const song = songsData.find((item) => item._id === id);

    // Find the album by matching song.album with albumsData
    const album = song ? albumsData.find((album) => album.name === song.album) : null;

    const handlePlaySong = () => {
        if (song) {
            playWithId(song._id);
        }
    };

    // Generate share URL and text
    const songUrl = `${window.location.origin}/song/${id}`;
    const shareText = `Listen to "${song?.name}" by ${song?.singers?.join(', ') || 'Unknown Artist'} on GaanaTree!`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(songUrl);
            toast.success("Song link copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy link:", error);
            toast.error("Failed to copy link. Please try again.");
        }
    };

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(songUrl)}`,
        x: `https://x.com/intent/tweet?url=${encodeURIComponent(songUrl)}&text=${encodeURIComponent(shareText)}`,
        whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + songUrl)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(songUrl)}`,
    };

    return song ? (
        <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-purple-400 transition-colors"
                >
                    <ChevronLeft className="w-6 h-6" />
                    <span className="text-sm font-semibold">Back</span>
                </button>
            </div>

            {/* Song Info Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start mb-12">
                {song.image ? (
                    <img
                        src={song.image}
                        alt={song.name}
                        className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-lg shadow-lg object-cover"
                    />
                ) : (
                    <div className="w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-lg shadow-lg bg-gray-700 flex items-center justify-center">
                        <Music className="w-20 h-20 text-gray-500" />
                    </div>
                )}
                <div className="flex flex-col text-center  md:text-left">
                    <div className="flex items-center gap-4 ">
                        <h1 className="text-3xl sm:text-2xl md:text-5xl font-extrabold tracking-tight mb-2">
                            {song.name}
                        </h1>
                        <button
                            onClick={handlePlaySong}
                            className="p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-colors"
                            title="Play Song"
                        >
                            <Play className="w-6 h-6" />
                        </button>
                        <div className="relative group">
                            <Heart
                                className={`w-6 h-6 cursor-pointer transition-colors ${likedSongs[song._id] ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                onClick={() => toggleSongLike(song._id)}
                            />
                            <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                                {likedSongs[song._id] ? 'Unlike' : 'Like'}
                            </span>
                        </div>
                    </div>
                    <h1 className="text-sm tracking-tight text-gray-400 mb-2">
                        {song.desc}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-400 mt-4">
                        From the album{" "}
                        {album ? (
                            <Link
                                to={`/album/${album._id}`}
                                className="text-purple-400 hover:text-purple-300 transition-colors"
                            >
                                {song.album}
                            </Link>
                        ) : (
                            <span className="text-gray-500">{song.album}</span>
                        )}
                    </p>
                    {/* Social Media Share Buttons */}
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">
                        <button
                            onClick={handleCopyLink}
                            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors"
                            title="Copy Song Link"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-300 text-white rounded-full hover:bg-blue-500 transition-colors"
                            title="Share on Facebook"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href={shareLinks.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-gray-100 text-blue-500 rounded-full hover:bg-gray-300 transition-colors"
                            title="Share on X"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-700 transition-colors"
                            title="Share on WhatsApp"
                        >
                            <MessageCircle className="w-5 h-5" />
                        </a>
                        <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-blue-700 text-white rounded-full hover:bg-blue-900 transition-colors"
                            title="Share on LinkedIn"
                        >
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Song Details */}
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl font-bold mb-6">Song Details</h2>
                <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base">
                        <div>
                            <p className="text-gray-400">Title</p>
                            <p className="text-white font-medium">{song.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Singers</p>
                            <p className="text-white font-medium">{song.singers?.join(', ') || "Unknown Artist"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Album</p>
                            <p className="text-white font-medium">{song.album}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="text-white font-medium">{song.duration}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Released Date</p>
                            <p className="text-white font-medium">
                                {song.releasedDate ? new Date(song.releasedDate).toLocaleDateString() : "Unknown Date"}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-400">Genre</p>
                            <p className="text-white font-medium">{song.genre || "Unknown Genre"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Mood</p>
                            <p className="text-white font-medium">{song.mood || "Unknown Mood"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Language</p>
                            <p className="text-white font-medium">{song.language || "Unknown Language"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Lyrics Writer</p>
                            <p className="text-white font-medium">{song.lyricsWriter || "Unknown"}</p>
                        </div>
                        <div>
                            <p className="text-gray-400">Likes</p>
                            <p className="text-white font-medium">{(song.songLikes || 0).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
                    <Comment songId={id} /> {/* Render the Comment component and pass the songId prop */}
        </div>
    ) : (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <p className="text-lg">Song not found</p>
        </div>
    );

};

export default SongInfo;