import {Route, Routes, useLocation} from "react-router-dom";
import DisplayHome from "./DisplayHome.jsx";
import Search from "./Search.jsx";
import DisplayAlbum from "./DisplayAlbum.jsx";
import SongInfo from "./SongInfo.jsx";
import Navbar from "./Navbar.jsx";
import Profile from "./Profile.jsx";
import Support from "./Support.jsx";
import Setting from "./Setting.jsx";
import {useContext, useEffect, useRef} from "react";
import {PlayerContext} from "../context/PlayerContext.jsx";
import ExploreSubscription from "./ExploreSubscription.jsx";
import PodcastHome from "./podcasts/PodcastHome.jsx";
import AudioBookHome from "./audiobooks/AudioBookHome.jsx";
import PlaylistHome from "./favPlaylist/PlaylistHome.jsx";
import { Play } from "lucide-react";

const Display = () => {
    const {albumsData} = useContext(PlayerContext);
    const displayRef = useRef();
    const location = useLocation();
    const isAlbum = location.pathname.includes("album");
    const albumId = isAlbum ? location.pathname.split("/").pop() : "";
    const album = isAlbum ? albumsData.find(x => x._id == albumId) : null;
    const bgColor = album?.bgColour || '#121212';

    useEffect(() => {
        if(isAlbum) {
            displayRef.current.style.background = `linear-gradient(${bgColor}, #121212)`;
        } else {
            displayRef.current.style.background = '#121212';
        }
    }, [isAlbum, bgColor]);

    return (
        <div ref={displayRef} className="w-[100%] m-2 bg-[#121212] text-white lg:w-[75%] lg:ml-0 flex flex-col">
            {/* Sticky navbar */}
            <div  className="sticky top-0 z-10 bg-[#121212]/95 backdrop-blur-sm border-b border-gray-800/50 px-6 pt-4 pb-2">
                <Navbar />
            </div>
            {/* Scrollable content */}
            <div className="flex-1 px-6 pb-4 overflow-auto">
                <Routes>
                    <Route path="/" element={<DisplayHome />} />
                    <Route path="/album/:id" element={<DisplayAlbum album={albumsData.find(x => x._id == albumId)}/>} />
                    <Route path="/song/:id" element={<SongInfo />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/support" element={<Support />} />
                    <Route path="/settings" element={<Setting />} />
                    <Route path="/subscription" element={<ExploreSubscription />} />
                    <Route path="/podcasts" element={<PodcastHome />} />
                    <Route path="/audiobooks" element={<AudioBookHome />} />
                    <Route path="/playlist" element={<PlaylistHome />} />
                </Routes>
            </div>
        </div>
    )
}

export default Display;