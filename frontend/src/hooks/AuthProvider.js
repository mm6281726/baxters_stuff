import { useContext, createContext, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem("access") || "");
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refresh") || "");
    
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
        }).catch((err) => {
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
        }else{
            setUser(null);
            setAccessToken("");
            setRefreshToken("");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
        }
    }

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, user, loginAction, logOut }}>
            {children}
        </AuthContext.Provider>
    );

};

export default AuthProvider;

export const useAuth = () => {
    return useContext(AuthContext);
};