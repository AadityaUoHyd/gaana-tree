import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext.jsx";
import { Heart, Music } from "lucide-react";
import { albumsAPI } from "../services/apiService.js";
import toast from "react-hot-toast";

const AlbumItem = ({ name, image, desc, id, albumLikes = 0, subscriptionPlan }) => {
    const { getAlbumsData } = useContext(PlayerContext);
    const [likes, setLikes] = useState(albumLikes || 0);
    const [liked, setLiked] = useState(false);
    const navigate = useNavigate();

    // Initialize liked state from localStorage
    useEffect(() => {
        setLikes(albumLikes || 0);
        const likedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
        setLiked(!!likedAlbums[id]);
    }, [albumLikes, id]);

    const handleLikeToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Check if user is logged in
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error('Please log in to like albums');
            return;
        }

        // Optimistic update
        const newLikes = liked ? likes - 1 : likes + 1;
        setLikes(newLikes);
        setLiked(!liked);

        // Update localStorage
        const likedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
        if (liked) {
            delete likedAlbums[id];
        } else {
            likedAlbums[id] = true;
        }
        localStorage.setItem('likedAlbums', JSON.stringify(likedAlbums));

        try {
            const response = liked ? await albumsAPI.unlike(id) : await albumsAPI.like(id);
            await getAlbumsData(); // Refresh data from server
        } catch (error) {
            // Revert on error
            setLikes(likes);
            setLiked(liked);
            const likedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
            if (liked) {
                likedAlbums[id] = true;
            } else {
                delete likedAlbums[id];
            }
            localStorage.setItem('likedAlbums', JSON.stringify(likedAlbums));
            console.error("Like/unlike error:", error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('userToken');
                window.location.reload();
            } else {
                toast.error(error.response?.data?.message || `Failed to ${liked ? 'unlike' : 'like'} album`);
            }
        }
    };

    return (
        <div
            onClick={(e) => {
                e.preventDefault();
                navigate(`/album/${id}`);
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
            <p className="text-slate-300 text-sm">{subscriptionPlan || "FREE"}</p>
            <div className="flex items-center gap-2 mt-2" onClick={e => e.stopPropagation()}>
                <button
                    className="p-1 -ml-1 focus:outline-none"
                    onClick={handleLikeToggle}
                    aria-label={liked ? "Unlike album" : "Like album"}
                >
                    <Heart
                        className={`w-4 h-4 transition-colors ${liked ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-500'}`}
                    />
                </button>
                <span className="text-xs text-gray-400">{likes.toLocaleString()}</span>
            </div>
        </div>
    );
};

export default AlbumItem;