import { createContext, useContext, useEffect, useRef, useState } from "react";
import { API_BASE_URL, useAuth } from "./AuthContext.jsx";
import axios from "axios";
import { userAPI, songsAPI, subscriptionAPI } from "../services/apiService.js";
import toast from "react-hot-toast";

// Simple debounce utility
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

export const PlayerContext = createContext();

export const PlayerContextProvider = ({ children }) => {
    const [songsData, setSongsData] = useState([]);
    const [albumsData, setAlbumsData] = useState([]);
    const [track, setTrack] = useState(null);
    const [playedTracks, setPlayedTracks] = useState([]);
    const [playStatus, setPlayStatus] = useState(false);
    const [time, setTime] = useState({
        currentTime: { second: 0, minute: 0 },
        totalTime: { second: 0, minute: 0 },
    });
    const [likedSongs, setLikedSongs] = useState(() => {
        // Load from localStorage on mount
        return JSON.parse(localStorage.getItem('likedSongs')) || {};
    });
    const [userPlan, setUserPlan] = useState("FREE"); // Default to FREE
    const { user, token, getAuthHeaders } = useAuth();
    const audioRef = useRef();
    const seekBg = useRef();
    const seekBar = useRef();

    // Persist likedSongs to localStorage on change
    useEffect(() => {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
    }, [likedSongs]);

    // Fetch user's subscription plan
    useEffect(() => {
        const fetchUserPlan = async () => {
            if (user && token) {
                try {
                    const response = await subscriptionAPI.getStatus();
                    setUserPlan(response.data.currentPlan || "FREE");
                } catch (error) {
                    console.error("Failed to fetch subscription plan:", error);
                    setUserPlan("FREE"); // Default to FREE on error
                }
            }
        };
        fetchUserPlan();
    }, [user, token]);

    // Subscription plan hierarchy
    const planHierarchy = {
        FREE: 0,
        SILVER: 1,
        GOLD: 2,
        PLATINUM: 3,
    };

    // Check if user can play a song based on subscription plan
    const canPlaySong = (song) => {
        if (!song.album) {
            console.warn(`Song ${song._id} has no associated album`);
            return false; // Prevent playback if no album
        }
        const album = albumsData.find(album => album.name === song.album);
        if (!album || !album.subscriptionPlan) {
            console.warn(`Album ${song.album} not found or has no subscription plan`);
            return false; // Prevent playback if album or plan is missing
        }
        const userPlanLevel = planHierarchy[userPlan] || 0;
        const albumPlanLevel = planHierarchy[album.subscriptionPlan] || 0;
        return userPlanLevel >= albumPlanLevel;
    };

    const play = () => {
        if (audioRef.current) {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setPlayStatus(true);
                    })
                    .catch((error) => {
                        console.error("Playback error:", error);
                        setPlayStatus(false);
                        toast.error("Failed to play song: " + error.message);
                    });
            }
        }
    };

    const pause = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setPlayStatus(false);
        }
    };

    const playWithId = debounce(async (id) => {
        const selectedSong = songsData.find((item) => item._id === id);
        if (!selectedSong) {
            console.warn(`Song with ID ${id} not found`);
            toast.error("Song not found");
            return;
        }

        // Check subscription plan
        if (!canPlaySong(selectedSong)) {
            const album = albumsData.find(album => album.name === selectedSong.album);
            const requiredPlan = album?.subscriptionPlan || "unknown";

            const message =
                requiredPlan === "PLATINUM"
                    ? `Upgrade to ${requiredPlan} plan to play this song`
                    : `Upgrade to ${requiredPlan} plan or higher to play this song`;

            toast(message, { icon: 'ℹ️' });
            return;
        }


        // Update played tracks
        setPlayedTracks(prev => {
            const filtered = prev.filter(track => track._id !== id);
            return [selectedSong, ...filtered].slice(0, 5);
        });

        // Persist to backend
        try {
            await userAPI.addRecentTrack(id);
        } catch (error) {
            console.error("Failed to add recent track:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            }
        }

        if (audioRef.current) {
            // Stop and reset current audio
            audioRef.current.pause();
            audioRef.current.src = '';
            audioRef.current.currentTime = 0;
            setPlayStatus(false);

            // Set new track
            setTrack(selectedSong);
            audioRef.current.src = selectedSong.file;

            try {
                // Wait for the audio to load
                await new Promise((resolve, reject) => {
                    audioRef.current.onloadeddata = resolve;
                    audioRef.current.onerror = () => reject(new Error("Failed to load audio"));
                    audioRef.current.load();
                });

                // Attempt to play
                await audioRef.current.play();
                setPlayStatus(true);
            } catch (error) {
                console.error("Playback error:", error);
                setPlayStatus(false);
                if (error.name === "AbortError") {
                    toast.error("Playback interrupted, please try again");
                } else {
                    toast.error(`Failed to play song: ${error.message}`);
                }
            }
        }
    }, 300); // Debounce for 300ms to prevent rapid clicks

    const fetchRecentTracks = async () => {
        try {
            if (songsData.length === 0) {
                // Retry after a short delay if songsData is not ready
                setTimeout(fetchRecentTracks, 500);
                return;
            }
            const res = await userAPI.getRecentTracks();
            // Map IDs to full song objects from songsData
            const tracks = res.data
                .map(id => songsData.find(s => s._id === id))
                .filter(Boolean); // Filter out undefined if song not found
            setPlayedTracks(tracks);
        } catch (error) {
            console.error("Failed to fetch recent tracks:", error);
            if (error.response?.status === 401) {
                toast.error("Session expired. Please log in again.");
            } else {
                toast.error("Failed to load recent tracks.");
            }
            setPlayedTracks([]);
        }
    };

    const previous = async () => {
        if (track && songsData.length > 0) {
            const currentIndex = songsData.findIndex((item) => item._id === track._id);
            if (currentIndex > 0) {
                await playWithId(songsData[currentIndex - 1]._id);
            }
        }
    };

    const next = async () => {
        if (track && songsData.length > 0) {
            const currentIndex = songsData.findIndex((item) => item._id === track._id);
            if (currentIndex < songsData.length - 1) {
                await playWithId(songsData[currentIndex + 1]._id);
            }
        }
    };

    const seekSong = (e) => {
        if (audioRef.current && audioRef.current.duration) {
            audioRef.current.currentTime =
                (e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration;
        }
    };

    const toggleSongLike = async (id) => {
        const isLiked = !!likedSongs[id];
        const token = localStorage.getItem('userToken');
        if (!token) {
            toast.error('Please log in to like songs');
            return;
        }

        // Optimistic update
        const newLikes = isLiked ? (songsData.find(s => s._id === id)?.songLikes || 0) - 1 : (songsData.find(s => s._id === id)?.songLikes || 0) + 1;
        setSongsData(prev =>
            prev.map(song =>
                song._id === id ? { ...song, songLikes: newLikes } : song
            )
        );
        setLikedSongs(prev => {
            const newLikedSongs = { ...prev };
            if (isLiked) {
                delete newLikedSongs[id];
            } else {
                newLikedSongs[id] = true;
            }
            return newLikedSongs;
        });

        try {
            const response = isLiked ? await songsAPI.unlike(id) : await songsAPI.like(id);
            await getSongsData(); // Refresh data from server
        } catch (error) {
            // Revert on error
            setSongsData(prev =>
                prev.map(song =>
                    song._id === id ? { ...song, songLikes: isLiked ? song.songLikes + 1 : song.songLikes - 1 } : song
                )
            );
            setLikedSongs(prev => {
                const newLikedSongs = { ...prev };
                if (isLiked) {
                    newLikedSongs[id] = true;
                } else {
                    delete newLikedSongs[id];
                }
                return newLikedSongs;
            });
            console.error("Like/unlike error:", error);
            if (error.response?.status === 401) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('userToken');
                window.location.reload();
            } else {
                toast.error(error.response?.data?.message || `Failed to ${isLiked ? 'unlike' : 'like'} song`);
            }
        }
    };

    const getSongsData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/songs`, { headers: getAuthHeaders() });
            const songs = response.data.success ? response.data.songs || [] : [];
            setSongsData(songs);
            // Preserve likedSongs state for songs still in the updated songsData
            setLikedSongs(prev => {
                const newLikedSongs = {};
                Object.keys(prev).forEach(id => {
                    if (songs.some(song => song._id === id)) {
                        newLikedSongs[id] = true;
                    }
                });
                return newLikedSongs;
            });
        } catch (error) {
            console.error('Error fetching songs:', error);
            setSongsData([]);
        }
    };

    const getAlbumsData = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/albums`, { headers: getAuthHeaders() });
            setAlbumsData(response.data.success ? response.data.albums || [] : []);
        } catch (error) {
            console.error('Error fetching albums:', error);
            setAlbumsData([]);
        }
    };

    const contextValue = {
        getSongsData,
        getAlbumsData,
        songsData,
        albumsData,
        playedTracks,
        audioRef,
        seekBar,
        seekBg,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
        likedSongs,
        toggleSongLike,
        userPlan, // Expose userPlan for potential UI use
    };

    useEffect(() => {
        if (user && token) {
            getAlbumsData();
            getSongsData();
        }
    }, [user, token]);

    // Fetch recent tracks after songsData is loaded
    useEffect(() => {
        if (user && token && songsData.length > 0) {
            fetchRecentTracks();
        }
    }, [user, token, songsData]);

    // Setup audio event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateSeekBar = () => {
            if (seekBar.current && audio.duration) {
                const progress = (audio.currentTime / audio.duration) * 100;
                seekBar.current.style.width = Math.floor(progress) + "%";
                setTime({
                    currentTime: {
                        second: Math.floor(audio.currentTime % 60),
                        minute: Math.floor(audio.currentTime / 60),
                    },
                    totalTime: {
                        second: Math.floor(audio.duration % 60),
                        minute: Math.floor(audio.duration / 60),
                    },
                });
            }
        };

        const handleLoadedMetadata = () => {
            if (seekBar.current) {
                seekBar.current.style.width = "0%";
            }
            if (playStatus && audio.paused) {
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        console.error("Playback error:", error);
                        setPlayStatus(false);
                        toast.error(`Failed to play song: ${error.message}`);
                    });
                }
            }
        };

        const handleSongEnded = () => {
            next(); // Play next song when current song ends
        };

        audio.addEventListener("timeupdate", updateSeekBar);
        audio.addEventListener("loadedmetadata", handleLoadedMetadata);
        audio.addEventListener("ended", handleSongEnded);

        return () => {
            audio.removeEventListener("timeupdate", updateSeekBar);
            audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
            audio.removeEventListener("ended", handleSongEnded);
        };
    }, [track, playStatus, next]);

    return <PlayerContext.Provider value={contextValue}>{children}</PlayerContext.Provider>;
};

export default PlayerContextProvider;