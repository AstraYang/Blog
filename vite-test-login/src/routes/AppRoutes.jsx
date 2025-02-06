import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import LoginPage from "../pages/Login";
import DashboardPage from "../pages/DashboardPage";
import MarkdownEditor from "../pages/MarkdownEditor.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={
            <PrivateRoute>
                <DashboardPage />
            </PrivateRoute>
            } />
            <Route path="/markdown" element={
                <PrivateRoute>
                    <MarkdownEditor />
                </PrivateRoute>
            } />
        </Routes>
    );
};

export default AppRoutes;
