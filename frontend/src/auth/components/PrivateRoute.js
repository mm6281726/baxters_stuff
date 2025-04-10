import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";
import { Spinner } from "reactstrap";

const PrivateRoute = () => {
    const auth = useAuth();

    // Show loading spinner while checking authentication or waiting for user data
    if (auth.loading || (auth.accessToken && !auth.user)) {
        // If we have a token but no user data, try to fetch it
        if (auth.accessToken && !auth.user && !auth.loading) {
            auth.fetchUserData();
        }

        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: "80vh" }}>
                <Spinner color="primary" />
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!auth.accessToken) {
        return <Navigate to="/login" />;
    }

    // Render the protected route
    return <Outlet />;
};

export default PrivateRoute;