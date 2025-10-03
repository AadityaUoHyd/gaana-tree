import {Toaster} from "react-hot-toast";
import Display from "./components/Display.jsx";
import AuthWrapper from "./components/AuthWrapper.jsx";
import Sidebar from "./components/Sidebar.jsx";
import Player from "./components/Player.jsx";
import {useContext} from "react";
import {PlayerContext} from "./context/PlayerContext.jsx";

const App = () => {
    const {audioRef, track} = useContext(PlayerContext);
    return (
        <>
            <Toaster />
            <AuthWrapper>
                <div className="h-screen bg-black">
                    <div className="h-[90%] flex">
                        <Sidebar />
                        <Display />
                    </div>
                    {/* Player component*/}
                    <Player />
                    <audio
                        ref={audioRef}
                        src={track?.file || undefined}
                        preload="auto"
                    ></audio>
                </div>
            </AuthWrapper>
        </>
    )
}

export default App;