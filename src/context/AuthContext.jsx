import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

export const AuthContext = createContext();
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("userToken"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");
        const storedUser = localStorage.getItem("userData");

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const register = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {email, password});
            if (response.status === 200) {
                return {
                    success: true,
                    message: 'Registration successful'
                }
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Registration failed'
                }
            }
        }catch (error) {
            return {
                success: false,
                message: error.response.data.message || 'Network error. Please try again later.'
            }
        }
    }

    const login = async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {email, password, portal: 'user'});
            if(response.status === 200) {
                setToken(response.data.token);
                setUser({email: response.data.email, 
                    role: response.data.role,
                    subscriptionPlan: response.data.subscriptionPlan,
                    createdAt: response.data.createdAt
                });
                localStorage.setItem("userToken", response.data.token);
                localStorage.setItem("userData", JSON.stringify({email: response.data.email, 
                    role: response.data.role,
                    subscriptionPlan: response.data.subscriptionPlan,
                    createdAt: response.data.createdAt
                }));
                return {success: true};
            } else {
                return {
                    success: false,
                    message: response.data.message || 'Login failed'
                };
            }
        }catch (error) {
            return {success: false, message: error.response.data || 'Network error. Please try again later.'};
        }
    }

    const isAuthenticated = () => {
        return !!token && !!user;
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
    }

    const getAuthHeaders = () => {
        return token ? {Authorization: `Bearer ${token}`} : {};
    }

    const contextValue = {
        register,
        login,
        isAuthenticated,
        loading,
        logout,
        user,
        token,
        getAuthHeaders
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    )
}