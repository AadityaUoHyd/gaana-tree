import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";
import { assets } from "../assets/assets.js";
import { Clock, Heart, Music } from "lucide-react";
import { albumsAPI, songsAPI } from "../services/apiService.js";
import toast from "react-hot-toast";

const DisplayAlbum = ({ album }) => {
    const { id } = useParams();
    const { albumsData, songsData, playWithId, track, getAlbumsData, getSongsData } = useContext(PlayerContext);
    const [albumLikes, setAlbumLikes] = useState(album?.albumLikes || 0);
    const [isAlbumLiked, setIsAlbumLiked] = useState(false);
    const [songLikeStates, setSongLikeStates] = useState({});

    // Filter songs for current album
    const albumSongs = songsData.filter(song => song.album === album?.name);
    const songCount = albumSongs.length;

    // Initialize liked state from localStorage
    useEffect(() => {
        const likedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
        setIsAlbumLiked(!!likedAlbums[id]);
        setAlbumLikes(album?.albumLikes || 0);
    }, [id, album?.albumLikes]);

    const handleAlbumLike = async (e) => {
        e.stopPropagation();
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error('Please log in to like albums');
            return;
        }

        // Optimistic UI update
        const newLikes = isAlbumLiked ? albumLikes - 1 : albumLikes + 1;
        setAlbumLikes(newLikes);
        setIsAlbumLiked(!isAlbumLiked);

        // Update localStorage
        const likedAlbums = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
        if (isAlbumLiked) {
            delete likedAlbums[id];
        } else {
            likedAlbums[id] = true;
        }
        localStorage.setItem('likedAlbums', JSON.stringify(likedAlbums));

        try {
            const response = isAlbumLiked
                ? await albumsAPI.unlike(album._id)
                : await albumsAPI.like(album._id);
            setAlbumLikes(response.data.albumLikes || newLikes);
            toast.success(isAlbumLiked ? "Album unliked!" : "Album liked!");
            await getAlbumsData();
        } catch (error) {
            // Revert on error
            setAlbumLikes(albumLikes);
            setIsAlbumLiked(isAlbumLiked);
            const likedAlbumsRevert = JSON.parse(localStorage.getItem('likedAlbums') || '{}');
            if (isAlbumLiked) {
                likedAlbumsRevert[id] = true;
            } else {
                delete likedAlbumsRevert[id];
            }
            localStorage.setItem('likedAlbums', JSON.stringify(likedAlbumsRevert));
            toast.error(error.response?.data?.message || "Failed to update album like");
        }
    };

    const handleSongLike = async (songId, e) => {
        e.stopPropagation();
        try {
            const isLiked = songLikeStates[songId]?.isLiked || false;
            if (isLiked) {
                const response = await songsAPI.unlike(songId);
                setSongLikeStates(prev => ({
                    ...prev,
                    [songId]: {
                        isLiked: false,
                        likes: response.data.songLikes || Math.max(0, (prev[songId]?.likes || 0) - 1)
                    }
                }));
                toast.success("Song unliked!");
            } else {
                const response = await songsAPI.like(songId);
                setSongLikeStates(prev => ({
                    ...prev,
                    [songId]: {
                        isLiked: true,
                        likes: response.data.songLikes || (prev[songId]?.likes || 0) + 1
                    }
                }));
                toast.success("Song liked!");
            }
            await getSongsData();
        } catch (error) {
            toast.error("Failed to update song like");
        }
    };

    // Total duration
    const totalSeconds = albumSongs.reduce((total, song) => {
        const [minutes, seconds] = song.duration.split(":").map(Number);
        return total + (minutes * 60) + seconds;
    }, 0);

    // Format total duration
    const formatDuration = (seconds) => {
        if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            return `about ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        } else {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return `${hours} hour${hours !== 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
    };

    return albumsData ? (
        <div className="mt-6 px-4 sm:px-6 md:px-8 lg:px-10">
            {/* Album Header */}
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-end mb-10">
                <img
                    src={album?.imageUrl}
                    alt={album?.name}
                    className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl shadow-xl object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="flex flex-col text-center md:text-left max-w-2xl">
                    <p className="text-xs sm:text-sm text-gray-300 uppercase tracking-widest">ACCESS TYPE - {album?.subscriptionPlan}</p>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-3 tracking-tight">
                        {album?.name}
                    </h2>
                    <h4 className="text-gray-300 text-base sm:text-lg md:text-xl mb-3">{album?.desc}</h4>
                    <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap relative">
                        <img src={assets.logo} alt="logo" className="w-5 h-5 inline-block" />
                        <b>GaanaTree</b>
                        <span className="text-yellow-400">•</span>
                        {songCount} Song{songCount !== 1 ? "s" : ""}
                        <span className="text-yellow-400">•</span>
                        {formatDuration(totalSeconds)}
                        <span className="text-yellow-400">•</span>
                        {albumLikes.toLocaleString()} album likes
                        <div className="relative group ml-2">
                            <Heart
                                className={`w-5 h-5 cursor-pointer transition-colors duration-200 ${isAlbumLiked ? 'fill-red-500 text-red-500' : 'text-red-500 hover:text-red-600'}`}
                                onClick={handleAlbumLike}
                            />
                            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
                                {isAlbumLiked ? 'Unlike' : 'Like'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Song List Header */}
            <div className="grid grid-cols-[40px_minmax(0,1fr)_80px] sm:grid-cols-[40px_1fr_160px_80px] lg:grid-cols-[40px_1fr_160px_80px_120px] gap-2 px-3 py-3 bg-white rounded-lg text-xs sm:text-sm font-semibold text-black uppercase tracking-wide">
                <p className="text-left px-2">#</p>
                <p className="text-left">Title</p>
                <p className="hidden sm:block text-left">Singers</p>
                <p className="text-center flex items-center justify-center"><Clock className="w-4 h-4" /></p>
                <p className="hidden lg:block text-center">Likes</p>
            </div>
            <div className="divide-y divide-gray-700">
                {albumSongs.map((item, index) => {
                    const isPlaying = track?._id === item._id;
                    const songLikeState = songLikeStates[item._id] || { isLiked: false, likes: item.songLikes || 0 };
                    return (
                        <div
                            key={index}
                            onClick={() => playWithId(item._id)}
                            className={`grid grid-cols-[40px_minmax(0,1fr)_80px] sm:grid-cols-[40px_1fr_160px_80px] lg:grid-cols-[40px_1fr_160px_80px_120px] gap-2 px-3 py-3 items-center text-sm rounded-lg cursor-pointer transition-all duration-200
                            ${isPlaying ? "bg-gray-800 text-white" : "text-gray-300 hover:bg-gray-700/40"}`}
                        >
                            <div className="flex items-center gap-2">
                                <span className={`w-5 text-right ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                                    {index + 1}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 min-w-[150px]">
                                {item.image ? (
                                    <img
                                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0 shadow"
                                        src={item.image}
                                        alt={item.name}
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                                        <Music className="w-4 h-4 text-gray-500" />
                                    </div>
                                )}
                                <span className={`font-medium ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                                    {item.name}
                                </span>
                            </div>
                            <p className={`hidden sm:block truncate ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                                {item.singers?.join(', ') || "Unknown Artist"}
                            </p>
                            <p className={`text-center ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                                {item.duration}
                            </p>
                            <div className={`hidden lg:flex items-center justify-center gap-2 ${isPlaying ? "text-yellow-400" : "text-white"}`}>
                                <Heart 
                                    className={`w-4 h-4 cursor-pointer transition-colors ${songLikeState.isLiked ? 'fill-red-500 text-red-500' : 'hover:text-red-500'}`}
                                    onClick={(e) => handleSongLike(item._id, e)}
                                />
                                <span>{songLikeState.likes.toLocaleString()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    ) : null;
};

export default DisplayAlbum;