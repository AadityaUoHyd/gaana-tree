import { Link } from "react-router-dom";
import { Music, Headphones, Download, Sparkle, Linkedin, Twitter, Instagram, Facebook, ListMusic, Mic2 } from "lucide-react";
import { useState, useEffect } from "react";
import { subscriptionAPI } from "../services/apiService.js";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const ExploreSubscription = () => {
    const { isAuthenticated } = useAuth();
    const [currentPlan, setCurrentPlan] = useState("FREE");
    const [loadingPlans, setLoadingPlans] = useState({}); // Track loading per plan

    useEffect(() => {
        const fetchStatus = async () => {
            if (!isAuthenticated()) return;
            try {
                const response = await subscriptionAPI.getStatus();
                setCurrentPlan(response.data.currentPlan || "FREE");
            } catch (error) {
                console.error("Failed to fetch subscription status:", error);
            }
        };
        fetchStatus();
    }, [isAuthenticated]);

    const handleSubscribe = async (plan, e) => {
        e.stopPropagation();
        if (!isAuthenticated()) {
            toast.error("Please log in to subscribe");
            return;
        }

        // Set loading for only this plan
        setLoadingPlans(prev => ({ ...prev, [plan]: true }));
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            await subscriptionAPI.subscribe(plan);
            const response = await subscriptionAPI.getStatus();
            setCurrentPlan(response.data.currentPlan);
            toast.success(`Successfully subscribed to ${plan} plan! 🎉`);
        } catch (error) {
            toast.error("Subscription failed. Please try again.");
        } finally {
            setLoadingPlans(prev => ({ ...prev, [plan]: false }));
        }
    };

    const plans = [
        {
            key: "FREE",
            title: "Free",
            price: "₹0",
            features: [
                { icon: <Music className="w-4 h-4 text-green-400" />, label: "Basic streaming" },
                { icon: <Headphones className="w-4 h-4 text-green-400" />, label: "Ads included" },
                { icon: <ListMusic className="w-4 h-4 text-green-400" />, label: "Limited Songs" },
            ],
            disabledText: "Default Plan"
        },
        {
            key: "SILVER",
            title: "Silver",
            price: "₹99",
            features: [
                { icon: <Music className="w-4 h-4 text-green-400" />, label: "Ad-free music" },
                { icon: <Headphones className="w-4 h-4 text-green-400" />, label: "Higher quality audio" },
                { icon: <Mic2 className="w-4 h-4 text-green-400" />, label: "Get Podcasts" },
            ],
        },
        {
            key: "GOLD",
            title: "Gold",
            price: "₹299",
            features: [
                { icon: <Music className="w-4 h-4 text-green-400" />, label: "Offline downloads" },
                { icon: <Download className="w-4 h-4 text-green-400" />, label: "AudioBooks content" },
                { icon: <Sparkle className="w-4 h-4 text-green-400" />, label: "Priority support" },
            ],
        },
        {
            key: "PLATINUM",
            title: "Platinum",
            price: "₹499",
            features: [
                { icon: <Music className="w-4 h-4 text-green-400" />, label: "Get All Songs" },
                { icon: <Headphones className="w-4 h-4 text-green-400" />, label: "Ultra HD audio" },
                { icon: <Sparkle className="w-4 h-4 text-green-400" />, label: "Podcasts & AudioBooks" },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-900 text-white px-4 sm:px-6 md:px-8 lg:px-10 py-6">
            {/* Hero Section */}
            <div className="text-center pt-12 pb-16 md:pt-16 md:pb-20">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
                    Unlock <span className="text-purple-400">GaanaTree Subscription Plan</span>
                </h1>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
                    Experience music like never before with ad-free streaming, offline playback, and unlimited access to your favorite songs.
                </p>
                <img src="/gaanatree.png" alt="gaanatree" className="h-64 w-64 mx-auto align-center"/>
            </div>

            {/* Benefits Section */}
            <div className="max-w-5xl mx-auto pb-16">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10">
                    By Default You're Using <span className="text-amber-300">Free Plan.</span> 
                    <p className="text-purple-400">Why Need Subscription?</p>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {plans.map(plan => (
                        <div key={plan.key} className="bg-gray-800 rounded-xl p-6 shadow-lg">
                            <h3 className="text-xl font-bold mb-4 text-amber-300">{plan.title}</h3>
                            <div className="text-4xl font-bold">
                                {plan.price} <span className="text-sm font-normal">/month</span>
                            </div>
                            <ul className="mt-4 space-y-2 text-gray-300">
                                {plan.features.map((f, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        {f.icon} {f.label}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={(e) => handleSubscribe(plan.key, e)}
                                disabled={plan.key === "FREE" || currentPlan === plan.key || loadingPlans[plan.key]}
                                className={`w-full mt-6 py-2 rounded-lg transition-all ${
                                    plan.key === "FREE"
                                        ? 'bg-gray-600 text-white cursor-not-allowed'
                                        : currentPlan === plan.key
                                            ? 'bg-green-600 text-white cursor-not-allowed'
                                            : 'bg-purple-500 hover:bg-purple-600 text-white'
                                } ${loadingPlans[plan.key] ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {loadingPlans[plan.key]
                                    ? 'Processing...'
                                    : plan.key === "FREE"
                                        ? plan.disabledText
                                        : currentPlan === plan.key
                                            ? 'Current Plan'
                                            : 'Subscribe'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Social Media Links */}
            <div className="text-center space-y-3">
                <h3 className="text-2xl font-semibold text-purple-400">Follow GaanaTree on Social Media</h3>
                <div className="flex justify-center items-center gap-6 mt-2">
                    <a href="https://www.linkedin.com/company/gaanatree" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
                        <Linkedin className="w-6 h-6" />
                    </a>
                    <a href="https://twitter.com/gaanatree" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                        <Twitter className="w-6 h-6" />
                    </a>
                    <a href="https://www.instagram.com/gaanatree" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors">
                        <Instagram className="w-6 h-6" />
                    </a>
                    <a href="https://www.facebook.com/gaanatree" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                        <Facebook className="w-6 h-6" />
                    </a>
                </div>
            </div>

            {/* Footer */}
            <div className="text-center py-8 text-gray-400 text-sm">
                <p>Need help? <Link to="/support" className="text-purple-400 hover:underline">Contact Support</Link></p>
            </div>
        </div>
    );
};

export default ExploreSubscription;
