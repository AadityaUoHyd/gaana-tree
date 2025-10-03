import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext.jsx";
import { Heart, Music, Info, StarIcon } from "lucide-react";
import toast from "react-hot-toast";

const SongItem = ({ name, image, desc, id, songLikes = 0 }) => {
    const { playWithId, likedSongs, toggleSongLike } = useContext(PlayerContext);
    const [likes, setLikes] = useState(songLikes || 0);
    const navigate = useNavigate();

    // Update likes when songLikes prop changes
    useEffect(() => {
        setLikes(songLikes || 0);
    }, [songLikes]);

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is logged in
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error('Please log in to like songs');
            return;
        }

        await toggleSongLike(id);
    };

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                playWithId(id);
            }}
            className="min-w-[180px] max-w-[200px] p-3 rounded-lg cursor-pointer hover:bg-[#ffffff26] transition-all duration-300 transform hover:scale-105"
        >
            <div className="relative w-full h-40 overflow-hidden rounded-lg shadow-md">
                {image && image.trim() !== '' ? (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center rounded-lg">
                    <Music className="w-12 h-12 text-gray-400" />
                </div>
            </div>
            <p className="font-bold mt-3 mb-1 text-white text-base truncate">{name}</p>
            <p className="text-slate-300 text-sm line-clamp-2">{desc}</p>
            <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                <div className="relative group">
                    <Info
                        className="w-4 h-4 cursor-pointer text-purple-400 hover:text-purple-300 transition-colors"
                        onClick={() => navigate(`/song/${id}`)}
                    />
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        Song Info
                    </span>
                </div>
                <div className="relative group">
                    <StarIcon
                        className="w-4 h-4 cursor-pointer text-yellow-500 hover:text-yellow-400 transition-colors"
                    />
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        Add to Favorites
                    </span>
                </div>
                <div className="relative group">
                    <Heart
                        className={`w-4 h-4 cursor-pointer transition-colors ${likedSongs[id] ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
                        onClick={handleLikeToggle}
                    />
                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                        {likedSongs[id] ? 'Unlike' : 'Like'}
                    </span>
                </div>
                <span className="text-xs text-gray-400">{likes.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default SongItem;