import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/Components/Login/AuthContext";
import Loader from "@/Components/Loader";

export const ProtectedRoute = ({ children }) => {
    const { isAuth, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!isAuth) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
