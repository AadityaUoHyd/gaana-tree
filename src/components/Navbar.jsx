import { ChevronLeft, ChevronRight, LogOut, User, Settings, HelpCircle, User2 } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown if click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="w-full flex justify-between items-center font-semibold">
            <div className="flex items-center gap-3">
                <div
                    onClick={() => navigate(-1)}
                    className="w-8 h-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                    <ChevronLeft className="w-4 h-4 text-white" />
                </div>
                <div
                    onClick={() => navigate(1)}
                    className="w-8 h-8 bg-black p-2 rounded-2xl cursor-pointer hover:bg-gray-800 transition-colors flex items-center justify-center"
                >
                    <ChevronRight className="w-4 h-4 text-white" />
                </div>

                {/* ✅ Beautified Brand Logo & Text */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <img
                        src="/gaanatree.png"
                        alt="GaanaTree Logo"
                        className="w-10 h-10 rounded-full shadow-lg shadow-purple-500/50"
                    />
                    <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 via-white to-purple-600 bg-clip-text text-transparent animate-pulse drop-shadow-[0_0_10px_rgba(168,85,247,0.8)] transition duration-300">
                        GaanaTree
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <p className="bg-white text-black text-[15px] px-4 py-1 rounded-2xl hidden md:block cursor-pointer"
                    onClick={() => navigate("/subscription")}
                >
                    Explore Subscription
                </p>

                {/* Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-2xl cursor-pointer hover:bg-gray-700 transition-colors"
                        onClick={toggleDropdown}
                    >
                        <User className="w-4 h-4 text-white" />
                        <span className="text-white text-sm hidden sm:inline">
                            {user?.email?.split("@")[0]}
                        </span>
                    </div>
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 z-10">
                            <div
                                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                                onClick={() => { navigate("/profile"); setIsDropdownOpen(false); }}
                            >
                                <User2 className="w-4 h-4" />
                                <span>Profile</span>
                            </div>
                            <div
                                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                                onClick={() => { navigate("/support"); setIsDropdownOpen(false); }}
                            >
                                <HelpCircle className="w-4 h-4" />
                                <span>Support</span>
                            </div>
                            <div
                                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 cursor-pointer"
                                onClick={() => { navigate("/settings"); setIsDropdownOpen(false); }}
                            >
                                <Settings className="w-4 h-4" />
                                <span>Settings</span>
                            </div>
                            <div
                                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-red-600 cursor-pointer"
                                onClick={handleLogout}
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
