import { useContext, useRef, useState, useEffect } from "react";
import { PlayerContext } from "../context/PlayerContext.jsx";
import AlbumItem from "./AlbumItem.jsx";
import SongItem from "./SongItem.jsx";
import { ChevronLeft, ChevronRight, Headphones } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

const DisplayHome = () => {
    const { user } = useAuth();
    const { songsData, albumsData, playedTracks } = useContext(PlayerContext);

    // Refs for scroll containers
    const featuredAlbumsRef = useRef(null);
    const lastTracksRef = useRef(null);
    const biggestHitsRef = useRef(null);
    const allSongsRef = useRef(null);

    // State to manage arrow visibility
    const [scrollStates, setScrollStates] = useState({
        featuredAlbums: { canScrollLeft: false, canScrollRight: false },
        lastTracks: { canScrollLeft: false, canScrollRight: false },
        biggestHits: { canScrollLeft: false, canScrollRight: false },
        allSongs: { canScrollLeft: false, canScrollRight: false },
    });

    // Sort albums by createdAt in descending order (latest first)
    const sortedAlbums = [...albumsData].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
        return dateB - dateA;
    });

    // Calculate 30 days ago for filtering
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Function to update scroll state
    const updateScrollState = (ref, section) => {
        if (ref.current) {
            const { scrollLeft, scrollWidth, clientWidth } = ref.current;
            setScrollStates(prev => ({
                ...prev,
                [section]: {
                    canScrollLeft: scrollLeft > 0,
                    canScrollRight: scrollLeft < scrollWidth - clientWidth - 1,
                },
            }));
        }
    };

    // Scroll handler
    const handleScroll = (ref, direction) => {
        if (ref.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Initialize and update scroll state on mount, resize, and data change
    useEffect(() => {
        const handleResizeOrDataChange = () => {
            // Use setTimeout to ensure DOM is updated after data changes
            setTimeout(() => {
                updateScrollState(featuredAlbumsRef, 'featuredAlbums');
                updateScrollState(lastTracksRef, 'lastTracks');
                updateScrollState(biggestHitsRef, 'biggestHits');
                updateScrollState(allSongsRef, 'allSongs');
            }, 0);
        };

        handleResizeOrDataChange();
        window.addEventListener('resize', handleResizeOrDataChange);

        const refs = [featuredAlbumsRef, lastTracksRef, biggestHitsRef, allSongsRef];
        const sections = ['featuredAlbums', 'lastTracks', 'biggestHits', 'allSongs'];
        refs.forEach((ref, index) => {
            if (ref.current) {
                ref.current.addEventListener('scroll', () => updateScrollState(ref, sections[index]));
            }
        });

        return () => {
            window.removeEventListener('resize', handleResizeOrDataChange);
            refs.forEach((ref, index) => {
                if (ref.current) {
                    ref.current.removeEventListener('scroll', () => updateScrollState(ref, sections[index]));
                }
            });
        };
    }, [songsData, albumsData, playedTracks]);

    return (
        <div className="p-4">
            <div className="mb-6">
                <h1 className="flex items-center gap-3 text-2xl font-bold text-purple-400">
                    <Headphones className="w-6 h-6 text-purple-300" />
                    Music
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Welcome <span className="font-semibold text-amber-300">{user?.email}</span> — listen to World’s top songs!
                </p>
            </div>
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl text-purple-400">Featured Albums</h1>
                {sortedAlbums.length > 0 ? (
                    <div className="relative">
                        <div
                            ref={featuredAlbumsRef}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
                        >
                            {sortedAlbums.map((item, index) => (
                                <AlbumItem
                                    key={index}
                                    name={item.name}
                                    desc={item.desc}
                                    id={item._id}
                                    image={item.imageUrl}
                                    albumLikes={item.albumLikes}
                                    subscriptionPlan={item.subscriptionPlan}
                                />
                            ))}
                        </div>
                        {scrollStates.featuredAlbums.canScrollLeft && (
                            <button
                                onClick={() => handleScroll(featuredAlbumsRef, 'left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {scrollStates.featuredAlbums.canScrollRight && (
                            <button
                                onClick={() => handleScroll(featuredAlbumsRef, 'right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No albums available</p>
                )}
            </div>
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl text-purple-400">My Last Five Tracks</h1>
                {playedTracks.length > 0 ? (
                    <div className="relative">
                        <div
                            ref={lastTracksRef}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
                        >
                            {playedTracks.map((item, index) => (
                                <SongItem
                                    key={index}
                                    name={item.name}
                                    desc={item.desc}
                                    id={item._id}
                                    image={item.image}
                                    songLikes={item.songLikes}
                                />
                            ))}
                        </div>
                        {scrollStates.lastTracks.canScrollLeft && (
                            <button
                                onClick={() => handleScroll(lastTracksRef, 'left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {scrollStates.lastTracks.canScrollRight && (
                            <button
                                onClick={() => handleScroll(lastTracksRef, 'right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No tracks played yet</p>
                )}
            </div>
            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl text-purple-400">This Month's Biggest Hits</h1>
                {songsData.length > 0 ? (
                    <div className="relative">
                        <div
                            ref={biggestHitsRef}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
                        >
                            {songsData
                                .filter((item) => {
                                    const releaseDate = new Date(item.releasedDate || new Date());
                                    return releaseDate >= thirtyDaysAgo;
                                })
                                .sort((a, b) => (b.songLikes || 0) - (a.songLikes || 0))
                                .map((item, index) => (
                                    <SongItem
                                        key={index}
                                        name={item.name}
                                        desc={item.desc}
                                        id={item._id}
                                        image={item.image}
                                        songLikes={item.songLikes}
                                    />
                                ))}
                        </div>
                        {scrollStates.biggestHits.canScrollLeft && (
                            <button
                                onClick={() => handleScroll(biggestHitsRef, 'left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {scrollStates.biggestHits.canScrollRight && (
                            <button
                                onClick={() => handleScroll(biggestHitsRef, 'right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No hits available</p>
                )}
            </div>

            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl text-purple-400">Explore All Songs</h1>
                {songsData.length > 0 ? (
                    <div className="relative">
                        <div
                            ref={allSongsRef}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
                        >
                            {songsData
                                .sort((a, b) => {
                                    const dateA = a.releasedDate ? new Date(a.releasedDate) : new Date(0);
                                    const dateB = b.releasedDate ? new Date(b.releasedDate) : new Date(0);
                                    return dateB - dateA; // Sort by releasedDate, newest first
                                })
                                .map((item, index) => (
                                    <SongItem
                                        key={index}
                                        name={item.name}
                                        desc={item.desc}
                                        id={item._id}
                                        image={item.image}
                                        songLikes={item.songLikes}
                                    />
                                ))}
                        </div>
                        {scrollStates.allSongs.canScrollLeft && (
                            <button
                                onClick={() => handleScroll(allSongsRef, 'left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {scrollStates.allSongs.canScrollRight && (
                            <button
                                onClick={() => handleScroll(allSongsRef, 'right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No hits available</p>
                )}
            </div>

            <div className="mb-4">
                <h1 className="my-5 font-bold text-2xl text-purple-400">Songs by Singer</h1>
                {sortedAlbums.length > 0 ? (
                    <div className="relative">
                        <div
                            ref={featuredAlbumsRef}
                            className="flex overflow-x-auto no-scrollbar scroll-smooth gap-4"
                        >
                            {sortedAlbums.map((item, index) => (
                                <AlbumItem
                                    key={index}
                                    name={item.name}
                                    desc={item.desc}
                                    id={item._id}
                                    image={item.imageUrl}
                                    albumLikes={item.albumLikes}
                                    subscriptionPlan={item.subscriptionPlan}
                                />
                            ))}
                        </div>
                        {scrollStates.featuredAlbums.canScrollLeft && (
                            <button
                                onClick={() => handleScroll(featuredAlbumsRef, 'left')}
                                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                        )}
                        {scrollStates.featuredAlbums.canScrollRight && (
                            <button
                                onClick={() => handleScroll(featuredAlbumsRef, 'right')}
                                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 p-2 rounded-full text-white hover:bg-opacity-90 transition-all duration-300"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                ) : (
                    <p className="text-gray-400 text-sm">No albums available</p>
                )}
            </div>
        </div>
    );
};

export default DisplayHome;