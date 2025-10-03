import React, { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ListMusic, Music4 } from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

const dummyPlaylists = [
  {
    id: 1,
    name: "Bollywood Chill",
    desc: "Relaxing Bollywood acoustic hits",
    image:
      "https://images.unsplash.com/photo-1525286116112-b59af11adad1?auto=format&fit=crop&w=400&q=80",
    songs: 25,
    likes: 3400,
  },
  {
    id: 2,
    name: "Punjabi Beats",
    desc: "Upbeat Punjabi party anthems",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    songs: 40,
    likes: 2800,
  },
  {
    id: 3,
    name: "Top Global Hits",
    desc: "Chartbusters loved worldwide",
    image:
      "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=400&q=80",
    songs: 50,
    likes: 5600,
  },
  {
    id: 4,
    name: "Workout Energy",
    desc: "High energy tracks for gym",
    image:
      "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?auto=format&fit=crop&w=400&q=80",
    songs: 35,
    likes: 1900,
  },
  {
    id: 5,
    name: "Romantic Classics",
    desc: "Timeless romantic Hindi & English songs",
    image:
      "https://images.unsplash.com/photo-1575011732056-edc3c7a9a631?auto=format&fit=crop&w=400&q=80",
    songs: 30,
    likes: 4200,
  },
];

const PlaylistCard = ({ playlist }) => (
  <div className="min-w-[180px] bg-gray-800 rounded-xl p-4 flex flex-col items-center text-center hover:bg-gray-700 transition-all duration-300 shadow-lg">
    <img
      src={playlist.image}
      alt={playlist.name}
      className="w-36 h-36 object-cover rounded-lg mb-3"
    />
    <h3 className="text-white font-semibold text-base truncate w-full">
      {playlist.name}
    </h3>
    <p className="text-gray-400 text-sm">{playlist.desc}</p>
    <div className="flex items-center gap-2 mt-2 text-sm text-gray-300">
      <Music4 size={16} />
      <span>{playlist.songs} songs</span>
    </div>
    <div className="text-purple-300 text-xs mt-1">{playlist.likes} likes</div>
  </div>
);

const PlaylistHome = () => {
  const { user } = useAuth();
  const playlistRef = useRef(null);
  const [scrollState, setScrollState] = useState({
    canScrollLeft: false,
    canScrollRight: false,
  });

  const updateScrollState = () => {
    if (playlistRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = playlistRef.current;
      setScrollState({
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
      });
    }
  };

  const handleScroll = (direction) => {
    if (playlistRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      playlistRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    if (playlistRef.current) {
      playlistRef.current.addEventListener("scroll", updateScrollState);
    }
    return () => {
      window.removeEventListener("resize", updateScrollState);
      if (playlistRef.current) {
        playlistRef.current.removeEventListener("scroll", updateScrollState);
      }
    };
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-purple-400">
          <ListMusic className="w-6 h-6 text-purple-300" />
          My Favorite Playlists (dummy)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome <span className="font-semibold text-amber-300">{user?.email}</span> — build your curated playlists for every mood 🎶
        </p>
      </div>

      <div className="relative">
        <div
          ref={playlistRef}
          className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
        >
          {dummyPlaylists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
        {scrollState.canScrollLeft && (
          <button
            onClick={() => handleScroll("left")}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {scrollState.canScrollRight && (
          <button
            onClick={() => handleScroll("right")}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default PlaylistHome;
