import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from "../context/PlayerContext.jsx";
import {
    ListMusic, Maximize2,
    Mic,
    Minimize2,
    Pause,
    Play,
    Repeat,
    Shuffle,
    SkipBack,
    SkipForward,
    Speaker,
    Volume2,
    Heart,
    Info,
    StarIcon,
    Music
} from "lucide-react";

export const Player = () => {
    const { track, seekBar, seekBg, playStatus, play, pause, time, previous, next, seekSong, likedSongs, toggleSongLike, audioRef } = useContext(PlayerContext);
    const navigate = useNavigate();
    const [hoverTime, setHoverTime] = useState(null);
    const [volume, setVolume] = useState(1); // Volume range: 0 to 1
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showPlaylist, setShowPlaylist] = useState(false);

    const handleSeekHover = (e) => {
        if (seekBg.current && track) {
            const rect = seekBg.current.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const percentage = offsetX / rect.width;
            const duration = (track.duration || "0:00").split(":").reduce((acc, val, i) => acc + (i === 0 ? parseInt(val) * 60 : parseInt(val)), 0);
            const seconds = Math.floor(percentage * duration);
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            setHoverTime(`${minutes}:${secs.toString().padStart(2, '0')}`);
        }
    };

    const handleSeekLeave = () => {
        setHoverTime(null);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    const toggleVolumeSlider = () => {
        setShowVolumeSlider(!showVolumeSlider);
    };

    const togglePlaylist = () => {
        setShowPlaylist(!showPlaylist);
        // Placeholder for playlist UI logic
        console.log(`Playlist ${showPlaylist ? 'hidden' : 'shown'}`);
    };

    const handleMicClick = () => {
        // Placeholder for future voice control feature
        console.log("Microphone clicked - voice control not implemented");
    };

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    return track ? (
        <div className={`bg-black flex justify-between items-center text-white px-4 ${isMinimized ? 'h-[4%]' : 'h-[10%]'}`}>
            {!isMinimized && (
                <div className="hidden lg:flex items-center gap-4">
                    {track.image ? (
                        <img src={track.image} alt={track.name} className="w-12 rounded" />
                    ) : (
                        <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                            <Music className="w-6 h-6 text-gray-500" />
                        </div>
                    )}
                    <div>
                        <p className="text-sm font-medium">{track.name}</p>
                        <p className="text-sm text-gray-400">{track.artist}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="relative group">
                                <Info
                                    className="text-purple-400 w-5 h-5 cursor-pointer hover:text-purple-300 transition-colors"
                                    onClick={() => navigate(`/song/${track._id}`)}
                                />
                                <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                                    Song Info
                                </span>
                            </div>
                            <div className="relative group">
                                <StarIcon className="text-yellow-500 w-5 h-5 cursor-pointer hover:text-yellow-400 transition-colors" />
                                <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                                    Add to Favorites
                                </span>
                            </div>
                            <div className="relative group">
                                <Heart
                                    className={`w-5 h-5 cursor-pointer transition-colors ${likedSongs[track._id] ? 'text-red-500 fill-red-500' : 'text-gray-400 hover:text-red-400'}`}
                                    onClick={() => toggleSongLike(track._id)}
                                />
                                <span className="absolute bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1">
                                    {likedSongs[track._id] ? 'Unlike' : 'Like'}
                                </span>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className={`flex flex-col items-center gap-1 m-auto ${isMinimized ? 'w-full justify-center' : ''}`}>
                {!isMinimized && (
                    <div className="flex gap-4">
                        <Shuffle
                            className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                        />
                        <SkipBack
                            onClick={previous}
                            className="w-4 h-5 cursor-pointer text-white hover:text-purple-500 transition-colors"
                        />
                        {playStatus ? (
                            <Pause
                                onClick={pause}
                                className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                            />
                        ) : (
                            <Play
                                onClick={play}
                                className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                            />
                        )}
                        <SkipForward
                            onClick={next}
                            className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                        />
                        <Repeat
                            className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                        />
                    </div>
                )}
                <div className="flex items-center gap-5 relative">
                    <p className="text-sm">
                        {time.currentTime.minute}:{time.currentTime.second.toString().padStart(2, '0')}
                    </p>
                    <div
                        ref={seekBg}
                        onClick={seekSong}
                        onMouseMove={handleSeekHover}
                        onMouseLeave={handleSeekLeave}
                        className="w-[60vw] max-w-[500px] h-1 bg-gray-600 rounded-full cursor-pointer relative group"
                    >
                        <div
                            ref={seekBar}
                            className="h-1 bg-gradient-to-r from-purple-500 to-purple-800 rounded-full transition-all duration-200"
                            style={{ width: '0%' }}
                        />
                        {hoverTime && (
                            <span className="absolute bottom-full mb-1 bg-gray-800 text-white text-xs rounded px-2 py-1 transform -translate-x-1/2 group-hover:block">
                                {hoverTime}
                            </span>
                        )}
                    </div>
                    <p className="text-sm">{track.duration}</p>
                </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 opacity-75 relative">
                <ListMusic
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={togglePlaylist}
                />
                <Mic
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={handleMicClick}
                />
                <Speaker
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={toggleVolumeSlider}
                />
                <Volume2
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={toggleVolumeSlider}
                />
                {showVolumeSlider && (
                    <div className="absolute bottom-full mb-2 bg-gray-800 p-2 rounded-lg">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleVolumeChange}
                            className="w-24 accent-purple-500"
                        />
                    </div>
                )}
                <Minimize2
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={toggleMinimize}
                />
                <Maximize2
                    className="w-4 h-4 cursor-pointer text-white hover:text-purple-500 transition-colors"
                    onClick={toggleMinimize}
                />
            </div>
        </div>
    ) : null;
}

export default Player;