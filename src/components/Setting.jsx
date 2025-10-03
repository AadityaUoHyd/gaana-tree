import { Settings, Bell, Lock, Palette, Music } from "lucide-react";

const Setting = () => {
    return (
        <div className="text-white px-6 py-8">
            <h1 className="text-3xl font-bold mb-6">Settings</h1>
            <div className="bg-gray-800/50 rounded-3xl p-6 backdrop-blur-sm border border-gray-700/50 space-y-8">
                <div>
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                        <Settings className="w-5 h-5 text-purple-400" /> Account Settings
                    </h2>
                    <p className="text-gray-400">Manage your GaanaTree account preferences.</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Bell className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold">Notifications</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600 rounded" defaultChecked />
                                <span className="text-sm text-gray-300">New releases from followed artists</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600 rounded" />
                                <span className="text-sm text-gray-300">Playlist updates</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Lock className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold">Privacy</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600 rounded" defaultChecked />
                                <span className="text-sm text-gray-300">Share listening activity</span>
                            </label>
                            <button className="text-purple-300 hover:text-purple-200 text-sm font-semibold">Manage Data</button>
                        </div>
                    </div>

                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Palette className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold">Appearance</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="radio" name="theme" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600" defaultChecked />
                                <span className="text-sm text-gray-300">Dark Theme</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="radio" name="theme" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600" />
                                <span className="text-sm text-gray-300">Light Theme</span>
                            </label>
                        </div>
                    </div>

                    <div className="bg-gray-700/30 p-4 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <Music className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold">Playback</h3>
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600 rounded" defaultChecked />
                                <span className="text-sm text-gray-300">Crossfade songs</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="w-4 h-4 text-purple-500 bg-gray-900 border-gray-600 rounded" />
                                <span className="text-sm text-gray-300">Autoplay similar songs</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Setting;