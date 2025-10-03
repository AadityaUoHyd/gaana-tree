import React, { useRef, useState, useEffect, useContext } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  BookOpen,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  Clock,
} from "lucide-react";

const dummyAudiobooks = [
  {
    id: "a1",
    title: "The White Tiger",
    author: "Aravind Adiga",
    desc: "A darkly humorous story of class struggle in modern India.",
    image: "https://picsum.photos/seed/whitetiger/500/500",
    likes: 9200,
    duration: "11h 30m",
  },
  {
    id: "a2",
    title: "Ikigai",
    author: "Héctor García & Francesc Miralles",
    desc: "The Japanese secret to a long and happy life.",
    image: "https://picsum.photos/seed/ikigai/500/500",
    likes: 15800,
    duration: "7h 12m",
  },
  {
    id: "a3",
    title: "The Guide",
    author: "R. K. Narayan",
    desc: "A classic Indian novel about transformation and self-discovery.",
    image: "https://picsum.photos/seed/guide/500/500",
    likes: 7400,
    duration: "9h 05m",
  },
  {
    id: "a4",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    desc: "A brief history of humankind.",
    image: "https://picsum.photos/seed/sapiens/500/500",
    likes: 21200,
    duration: "15h 44m",
  },
  {
    id: "a5",
    title: "The Alchemist",
    author: "Paulo Coelho",
    desc: "An allegorical novel about following your dreams.",
    image: "https://picsum.photos/seed/alchemist/500/500",
    likes: 18500,
    duration: "8h 27m",
  },
  {
    id: "a6",
    title: "India After Gandhi",
    author: "Ramachandra Guha",
    desc: "A monumental history of independent India.",
    image: "https://picsum.photos/seed/gandhi/500/500",
    likes: 8700,
    duration: "22h 11m",
  },
  {
    id: "a7",
    title: "Astrophysics for People in a Hurry",
    author: "Neil deGrasse Tyson",
    desc: "A quick tour of the universe and cosmic mysteries.",
    image: "https://picsum.photos/seed/astro/500/500",
    likes: 19600,
    duration: "5h 42m",
  },
  {
    id: "a8",
    title: "The Monk Who Sold His Ferrari",
    author: "Robin Sharma",
    desc: "A fable about fulfilling your dreams and reaching destiny.",
    image: "https://picsum.photos/seed/monk/500/500",
    likes: 13400,
    duration: "6h 55m",
  },
];

const dummyRecentAudiobooks = [
  { id: "r1", title: "Banaras: The City Eternal", book: "India After Gandhi", duration: "1h 25m" },
  { id: "r2", title: "Life’s Purpose", book: "Ikigai", duration: "52m" },
  { id: "r3", title: "Following the Signs", book: "The Alchemist", duration: "1h 14m" },
  { id: "r4", title: "Black Holes Explained", book: "Astrophysics for People in a Hurry", duration: "48m" },
  { id: "r5", title: "The Great Railway Strike", book: "The White Tiger", duration: "1h 05m" },
];

const AudioBookCard = ({ book }) => {
  return (
    <div className="min-w-[180px] max-w-[180px] bg-gray-800 rounded-2xl p-3 flex-shrink-0 shadow-md hover:scale-[1.02] transition-transform duration-200">
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
        <img
          src={book.image}
          alt={`${book.title} cover`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          aria-label={`Play ${book.title}`}
          className="absolute right-3 bottom-3 bg-purple-500 bg-opacity-95 p-2 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4 text-white" />
        </button>
      </div>

      <h3 className="text-white font-semibold text-sm truncate">{book.title}</h3>
      <p className="text-gray-400 text-xs truncate">{book.author}</p>
      <p className="text-purple-300 text-xs mt-1 line-clamp-2">{book.desc}</p>

      <div className="flex items-center justify-between mt-3 text-gray-300 text-xs">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          <span>{(book.likes / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{book.duration}</span>
        </div>
      </div>
    </div>
  );
};

const RecentAudioItem = ({ item }) => {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-pink-600 rounded-md flex items-center justify-center text-white font-semibold">
          {item.book.split(" ").slice(0, 2).map((s) => s[0]).join("")}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{item.title}</div>
          <div className="text-gray-400 text-xs">{item.book}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-300 text-xs">{item.duration}</div>
        <button className="p-2 rounded-full bg-purple-500 bg-opacity-90 hover:scale-105 transition-transform">
          <Play className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const AudioBookHome = () => {
  const { user } = useAuth();
  const featuredRef = useRef(null);
  const trendingRef = useRef(null);
  const [scrollStates, setScrollStates] = useState({
    featured: { canScrollLeft: false, canScrollRight: false },
    trending: { canScrollLeft: false, canScrollRight: false },
  });

  const updateScrollState = (ref, key) => {
    if (!ref.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = ref.current;
    setScrollStates((prev) => ({
      ...prev,
      [key]: {
        canScrollLeft: scrollLeft > 0,
        canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
      },
    }));
  };

  const handleScroll = (ref, dir) => {
    if (!ref.current) return;
    const amount = dir === "left" ? -280 : 280;
    ref.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  useEffect(() => {
    const onResize = () => {
      updateScrollState(featuredRef, "featured");
      updateScrollState(trendingRef, "trending");
    };

    const fRef = featuredRef.current;
    const tRef = trendingRef.current;
    const fHandler = () => updateScrollState(featuredRef, "featured");
    const tHandler = () => updateScrollState(trendingRef, "trending");

    if (fRef) fRef.addEventListener("scroll", fHandler);
    if (tRef) tRef.addEventListener("scroll", tHandler);
    window.addEventListener("resize", onResize);

    setTimeout(onResize, 50);

    return () => {
      if (fRef) fRef.removeEventListener("scroll", fHandler);
      if (tRef) tRef.removeEventListener("scroll", tHandler);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="p-4">
      <div className="mb-6">
        <h1 className="flex items-center gap-3 text-2xl font-bold text-purple-400">
          <BookOpen className="w-6 h-6 text-purple-300" />
          Audiobooks (Dummy)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome <span className="font-semibold text-amber-300">{user?.email}</span> — discover stories & knowledge in audio form!
        </p>
      </div>

      {/* Featured */}
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl text-purple-400 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-purple-300" /> Featured Audiobooks
        </h2>

        <div className="relative">
          <div
            ref={featuredRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {dummyAudiobooks.slice(0, 4).map((b) => (
              <AudioBookCard key={b.id} book={b} />
            ))}
          </div>

          {scrollStates.featured.canScrollLeft && (
            <button
              onClick={() => handleScroll(featuredRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {scrollStates.featured.canScrollRight && (
            <button
              onClick={() => handleScroll(featuredRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Trending */}
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl text-purple-400 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-purple-300" /> Trending Now
        </h2>

        <div className="relative">
          <div
            ref={trendingRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {dummyAudiobooks.map((b) => (
              <AudioBookCard key={b.id} book={b} />
            ))}
          </div>

          {scrollStates.trending.canScrollLeft && (
            <button
              onClick={() => handleScroll(trendingRef, "left")}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
          )}
          {scrollStates.trending.canScrollRight && (
            <button
              onClick={() => handleScroll(trendingRef, "right")}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-900 bg-opacity-70 p-2 rounded-full"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Listening */}
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl text-purple-400 flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-300" /> Recent Listening
        </h2>

        <div>
          {dummyRecentAudiobooks.map((item) => (
            <RecentAudioItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioBookHome;
