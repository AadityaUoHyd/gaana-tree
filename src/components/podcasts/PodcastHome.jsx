import React, { useRef, useState, useEffect, useContext } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import {
  Mic2,
  Headphones,
  ChevronLeft,
  ChevronRight,
  Play,
  Heart,
  Clock,
} from "lucide-react";

const dummyPodcasts = [
  // Indian Culture & Lifestyle
  
  {
    id: "p0",
    title: "Lex Fridman Podcast",
    desc: "Conversations about AI, science, technology, history & philosophy.",
    host: "Lex Fridman",
    image: "https://picsum.photos/seed/lexfridman/500/500",
    likes: 92000,
    episodes: 350,
  },
  {
    id: "p1",
    title: "The Musafir Stories",
    desc: "Travel podcast sharing stories from every corner of India.",
    host: "Saif & Faiza",
    image: "https://picsum.photos/seed/india-travel/500/500",
    likes: 8700,
    episodes: 105,
  },
  {
    id: "p2",
    title: "The Seen and The Unseen",
    desc: "Deep conversations on politics, economics and society.",
    host: "Amit Varma",
    image: "https://picsum.photos/seed/amitvarma/500/500",
    likes: 15200,
    episodes: 320,
  },
  {
    id: "p3",
    title: "Maed in India",
    desc: "India’s first indie music podcast – interviews & live sessions.",
    host: "Mae Thomas",
    image: "https://picsum.photos/seed/maedinindia/500/500",
    likes: 11300,
    episodes: 210,
  },
  {
    id: "p4",
    title: "IVM Likes",
    desc: "Pop culture, Bollywood, cricket and more from IVM Podcasts.",
    host: "IVM Team",
    image: "https://picsum.photos/seed/ivm/500/500",
    likes: 9800,
    episodes: 160,
  },
  {
    id: "p5",
    title: "Bhaskar Bose",
    desc: "Audio detective thriller podcast in Hindi.",
    host: "Red FM India",
    image: "https://picsum.photos/seed/bhaskarbose/500/500",
    likes: 7400,
    episodes: 75,
  },
  {
    id: "p6",
    title: "The Habit Coach",
    desc: "Small daily habits for health, productivity and happiness.",
    host: "Ashdin Doctor",
    image: "https://picsum.photos/seed/habitcoach/500/500",
    likes: 13200,
    episodes: 450,
  },
  {
    id: "p7",
    title: "Cricket Nagaram",
    desc: "Cricket banter, IPL gossip and India’s biggest rivalries.",
    host: "Rohit Menon & Guests",
    image: "https://picsum.photos/seed/cricket/500/500",
    likes: 10100,
    episodes: 95,
  },
  {
    id: "p8",
    title: "Shunya One",
    desc: "Conversations with India’s top tech entrepreneurs.",
    host: "Amit Doshi & Shiladitya",
    image: "https://picsum.photos/seed/shunya/500/500",
    likes: 8900,
    episodes: 180,
  },

  // Tech & Science
  {
    id: "p9",
    title: "Darknet Diaries",
    desc: "True stories from the dark side of the internet. Cybersecurity & hacking.",
    host: "Jack Rhysider",
    image: "https://picsum.photos/seed/darknet/500/500",
    likes: 54000,
    episodes: 150,
  },
  
  {
    id: "p10",
    title: "Aadi Podcast",
    desc: "Conversations about Geopolitics.",
    host: "Aaditya B Chatterjee",
    image: "https://picsum.photos/seed/maedinindia/500/500",
    likes: 92000,
    episodes: 350,
  },

  {
    id: "p11",
    title: "Indian Genes",
    desc: "Podcast exploring science, astronomy, genetics, and human evolution.",
    host: "Navneeth",
    image: "https://picsum.photos/seed/indian-genes/500/500",
    likes: 8200,
    episodes: 60,
  },
  {
    id: "p12",
    title: "SynTalk",
    desc: "Interdisciplinary podcast on philosophy, science, and culture from India.",
    host: "SynTalk Collective",
    image: "https://picsum.photos/seed/syntalk/500/500",
    likes: 7200,
    episodes: 140,
  },
  {
    id: "p13",
    title: "StarTalk Radio",
    desc: "Science, pop culture, and comedy with Neil deGrasse Tyson.",
    host: "Neil deGrasse Tyson",
    image: "https://picsum.photos/seed/startalk/500/500",
    likes: 67000,
    episodes: 500,
  },
];

const dummyEpisodes = [
  {
    id: "e1",
    title: "Inside Startup India",
    podcast: "Shunya One",
    duration: "42:18",
  },
  {
    id: "e2",
    title: "The Rise of OTT in India",
    podcast: "IVM Likes",
    duration: "28:54",
  },
  {
    id: "e3",
    title: "Banaras: The Timeless City",
    podcast: "The Musafir Stories",
    duration: "50:33",
  },
  {
    id: "e4",
    title: "Habits That Stick",
    podcast: "The Habit Coach",
    duration: "16:40",
  },
  {
    id: "e5",
    title: "India vs Pakistan – Beyond Cricket",
    podcast: "Cricket Nagaram",
    duration: "47:12",
  },
  {
    id: "e6",
    title: "AI and the Future of Humanity",
    podcast: "Lex Fridman Podcast",
    duration: "1:52:10",
  },
  {
    id: "e7",
    title: "Decoding Black Holes",
    podcast: "StarTalk Radio",
    duration: "58:21",
  },
  {
    id: "e8",
    title: "The Indian Science Renaissance",
    podcast: "Indian Genes",
    duration: "44:09",
  },
];

const PodcastCard = ({ pod }) => {
  return (
    <div className="min-w-[180px] max-w-[180px] bg-gray-800 rounded-2xl p-3 flex-shrink-0 shadow-md hover:scale-[1.02] transition-transform duration-200">
      <div className="relative w-full h-40 rounded-lg overflow-hidden mb-3">
        <img
          src={pod.image}
          alt={`${pod.title} cover`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <button
          aria-label={`Play ${pod.title}`}
          className="absolute right-3 bottom-3 bg-purple-500 bg-opacity-95 p-2 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
        >
          <Play className="w-4 h-4 text-white" />
        </button>
      </div>

      <h3 className="text-white font-semibold text-sm truncate">{pod.title}</h3>
      <p className="text-gray-400 text-xs truncate">{pod.host}</p>
      <p className="text-purple-300 text-xs mt-1 line-clamp-2">{pod.desc}</p>

      <div className="flex items-center justify-between mt-3 text-gray-300 text-xs">
        <div className="flex items-center gap-2">
          <Heart className="w-4 h-4" />
          <span>{(pod.likes / 1000).toFixed(1)}k</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{pod.episodes}</span>
        </div>
      </div>
    </div>
  );
};

const EpisodeItem = ({ ep }) => {
  return (
    <div className="flex items-center justify-between bg-gray-800 rounded-lg p-3 mb-2">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-700 to-pink-600 rounded-md flex items-center justify-center text-white font-semibold">
          {ep.podcast.split(" ").slice(0, 2).map((s) => s[0]).join("")}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{ep.title}</div>
          <div className="text-gray-400 text-xs">{ep.podcast}</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-gray-300 text-xs">{ep.duration}</div>
        <button className="p-2 rounded-full bg-purple-500 bg-opacity-90 hover:scale-105 transition-transform">
          <Play className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};

const PodcastHome = () => {
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
          <Mic2 className="w-6 h-6 text-purple-300" />
          Podcasts (Dummy)
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Welcome <span className="font-semibold text-amber-300">{user?.email}</span> — listen to World’s top creators!
        </p>
      </div>

      {/* Featured */}
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl text-purple-400 flex items-center gap-2">
          <Headphones className="w-5 h-5 text-purple-300" /> Featured Shows
        </h2>

        <div className="relative">
          <div
            ref={featuredRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
          >
            {dummyPodcasts.slice(0, 6).map((p) => (
              <PodcastCard key={p.id} pod={p} />
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
            {dummyPodcasts.map((p) => (
              <PodcastCard key={p.id} pod={p} />
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

      {/* Recent Episodes */}
      <div className="mb-8">
        <h2 className="mb-4 font-bold text-xl text-purple-400 flex items-center gap-2">
          <Play className="w-5 h-5 text-purple-300" /> Recent Episodes
        </h2>

        <div>
          {dummyEpisodes.map((ep) => (
            <EpisodeItem key={ep.id} ep={ep} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PodcastHome;
