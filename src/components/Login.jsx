import {assets} from "../assets/assets.js";
import {useState} from "react";
import toast from "react-hot-toast";
import {useAuth} from "../context/AuthContext.jsx";

const Login = ({onSwitchToRegister}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const {login} = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            toast.error('Please fill in all fields');
            return;
        }
        setLoading(true);
        try {
            const result = await login(email, password);
            if (!result.success) {
                toast.error(result.message);
                setError(result.message);
            }
        }catch (error) {
            setError(error.message);
            toast.error('An unexpected error occurred. Please try again later.');
        }finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-start p-6 sm:p-8 md:p-12 relative overflow-hidden">
            {/* Background image */}
            <img 
                src={assets.bg_image} 
                alt="background" 
                className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-black/40"></div> {/* Overlay for better contrast */}
            
            <div className="max-w-lg w-full space-y-10 relative z-10 ml-4 sm:ml-8 md:ml-16">
                {/* Header */}
                <div className="text-center">
                    <div className="flex justify-center mb-8">
                        <img 
                            src={assets.logo} 
                            alt="logo" 
                            className="w-15 h-15 transform hover:scale-110 transition-transform duration-500 ease-out" 
                        />
                        <h1 className="ml-4 text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 tracking-tight">
                            GaanaTree
                        </h1>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-wider">Welcome Back, Music Lover</h2>
                    <p className="text-gray-200 text-base font-medium italic opacity-80">
                        Access your account to resume playback
                    </p>
                </div>

                {/* Login form */}
                <div className="bg-white/15 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-white/10 transform hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500">
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-600/20 border border-red-500 rounded-xl p-4 text-red-200 text-sm font-medium animate-pulse">
                                {error}
                            </div>
                        )}
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-100 mb-3">
                                Email Address
                            </label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border border-gray-500 rounded-xl bg-gray-900/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-gray-900/50 text-lg"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-100 mb-3">
                                Password
                            </label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    autoComplete="new-password"
                                    required
                                    className="block w-full pl-12 pr-4 py-4 border border-gray-500 rounded-xl bg-gray-900/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300 group-hover:bg-gray-900/50 text-lg"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Submit button */}
                        <button
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-6 border border-transparent rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 active:scale-98"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-3"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Switch to register */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-300 font-medium">
                            Don't have an account?
                            <button
                                onClick={onSwitchToRegister}
                                className="text-purple-300 hover:text-purple-200 font-semibold transition-colors duration-300 ml-2"
                            >
                                Sign up here
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;