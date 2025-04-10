import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || "");
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || "");
    const [loading, setLoading] = useState(true);

    // Function to fetch user data - can be called from anywhere
    const fetchUserData = async () => {
        if (accessToken) {
            try {
                setLoading(true);

                // Get the user ID from the user object or localStorage
                const userId = user?.id || localStorage.getItem("userId");
                console.log('User ID:', userId, 'User:', user, 'LocalStorage userId:', localStorage.getItem("userId"));

                if (userId) {
                    // Fetch the user data using the ID
                    const response = await axios.get(`/api/accounts/${userId}/`);
                    if (response.data) {
                        setUser(response.data);
                        return response.data;
                    }
                } else {
                    console.error('No user ID available');
                    // If we can't get the user ID, clear the tokens and redirect to login
                    setTokens();
                }

                return null;
            } catch (error) {
                console.error('Error fetching user data:', error);
                // If there's an error (like an expired token), clear the tokens
                if (error.response && error.response.status === 401) {
                    setTokens();
                }
                throw error;
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
            return null;
        }
    };

    // Load user data when the component mounts if there's a valid token
    useEffect(() => {
        fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken]);

    const loginAction = async (data) => {
        let error;
        await axios.post("/api/accounts/login/", JSON.stringify(data))
        .then((res) => {
            setTokens(res.data);
            if(!localStorage.access){
                throw new Error()
            }else{
                window.location.href = '/';
            }
        }).catch(() => {
            error = "Failed to login.";
            alert(error);
        });
    };

    const logOut = () => {
        setTokens()
        window.location.href = '/';
    };

    const setTokens = (json) => {
        if(json){
            let user = json.user
            let access = json.access
            let refresh = json.refresh

            setUser(user);
            setAccessToken(access);
            setRefreshToken(refresh);
            localStorage.setItem("access", access);
            localStorage.setItem("refresh", refresh);
            // Store the user ID in localStorage for later use
            if (user && user.id) {
                localStorage.setItem("userId", user.id);
                console.log('Stored user ID in localStorage:', user.id);
            } else {
                console.error('User object or user ID is missing:', user);
            }
        }else{
            setUser(null);
            setAccessToken("");
            setRefreshToken("");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            localStorage.removeItem("userId");
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, loginAction, logOut, setTokens, loading, fetchUserData }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};