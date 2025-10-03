import { HelpCircle, Mail, MessageSquare, BookOpen, CodeXml, Linkedin, Twitter, Instagram, Facebook } from "lucide-react";

const Support = () => {
    return (
        <div className="text-white px-6 py-12 bg-gradient-to-b from-gray-900 via-gray-950 to-gray-900 min-h-screen">
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-center text-purple-400">Support</h1>

            <div className="max-w-6xl mx-auto bg-gray-800/50 rounded-3xl p-8 backdrop-blur-sm border border-gray-700/50 space-y-12 shadow-lg">
                
                {/* Get Help */}
                <div className="text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-semibold flex items-center justify-center md:justify-start gap-3 mb-4">
                        <HelpCircle className="w-6 h-6 text-purple-400" /> Get Help
                    </h2>
                    <p className="text-gray-400 text-lg md:text-base">
                        Find answers to common questions or contact our support team.
                    </p>
                </div>

                {/* Support Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    
                    {/* Email Support */}
                    <div className="bg-gray-700/30 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 shadow-md flex flex-col items-center text-center">
                        <Mail className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Reach out to us at support@gaanatree.com for personalized assistance.
                        </p>
                        <a
                            href="mailto:support@gaanatree.com"
                            className="mt-auto inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-2xl font-medium transition-all duration-300"
                        >
                            Contact Us
                        </a>
                    </div>

                    {/* Live Chat */}
                    <div className="bg-gray-700/30 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 shadow-md flex flex-col items-center text-center">
                        <MessageSquare className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Chat with our support team for real-time help (available 9 AM - 9 PM).
                        </p>
                        <button className="mt-auto bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-2xl font-medium transition-all duration-300">
                            Start Chat
                        </button>
                    </div>

                    {/* Help Center */}
                    <div className="bg-gray-700/30 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 shadow-md flex flex-col items-center text-center">
                        <BookOpen className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Help Center</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Browse our FAQs and troubleshooting guides for quick solutions.
                        </p>
                        <a
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-2xl font-medium transition-all duration-300"
                        >
                            Visit Help Center
                        </a>
                    </div>

                    {/* Developer */}
                    <div className="bg-gray-700/30 p-6 rounded-xl hover:bg-gray-700/50 transition-all duration-300 shadow-md flex flex-col items-center text-center">
                        <CodeXml className="w-8 h-8 text-purple-400 mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Know GannaTree Developer</h3>
                        <p className="text-gray-400 text-sm mb-4">Aaditya B Chatterjee</p>

                        {/* LinkedIn link on profile image */}
                        <a
                            href="https://www.linkedin.com/in/aaditya-bachchu-chatterjee-0485933b/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-28 h-28 rounded-full overflow-hidden transition-transform duration-300 hover:scale-110"
                        >
                            <img
                                src="https://raw.githubusercontent.com/AadityaUoHyd/the-platenet/refs/heads/main/aadi.jpg"
                                alt="Aaditya B Chatterjee"
                                className="w-full h-full object-cover object-center"
                            />
                        </a>
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

                {/* Common Questions */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold text-purple-400">Common Questions</h3>
                    <div className="space-y-4">
                        <div className="bg-gray-700/30 p-4 rounded-xl shadow-sm hover:bg-gray-700/50 transition-all duration-300">
                            <p className="text-sm font-semibold">How do I reset my password?</p>
                            <p className="text-gray-400 text-sm">Go to the login page and click "Forgot Password" to receive a reset link.</p>
                        </div>
                        <div className="bg-gray-700/30 p-4 rounded-xl shadow-sm hover:bg-gray-700/50 transition-all duration-300">
                            <p className="text-sm font-semibold">How can I upgrade to Premium?</p>
                            <p className="text-gray-400 text-sm">Click "Explore Premium" in the navbar to view subscription options.</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Support;
