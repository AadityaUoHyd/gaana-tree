import {useAuth} from "../context/AuthContext.jsx";
import {useState} from "react";
import Register from "./Register.jsx";
import Login from "./Login.jsx";

const AuthWrapper = ({children}) => {
    const {isAuthenticated, loading} = useAuth();
    const [showRegister, setShowRegister] = useState(false);

    if(loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-white text-lg">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated()) {
        return showRegister ? (
            <Register onSwitchToLogin = {() => setShowRegister(false)} />
        ): (
            <Login onSwitchToRegister = {() => setShowRegister(true)} />
        );
    }

    return children;
}

export default AuthWrapper;