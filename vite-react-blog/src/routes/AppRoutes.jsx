import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Blog from "../pages/Blog.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import MarkdownEditor from "../pages/MarkdownEditor.jsx";
import SignIn from "../pages/SignIn.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/login" element={<SignIn />} />
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
