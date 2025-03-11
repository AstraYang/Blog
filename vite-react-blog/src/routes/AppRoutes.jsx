import React from "react";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Blog from "../pages/Blog.jsx";
import SignIn from "../pages/SignIn.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import TagList from "../components/dashboard/components/TagList.jsx";
import MindMap from "../components/dashboard/components/MinMap.jsx";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/tags" element={<TagList />} />
            <Route path="/article/:articleId" element={<Blog />} />
            <Route path="/map" element={<MindMap/>} />
            <Route path="/mindMap/:id" element={<Blog />} />
            <Route path="/admin" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }>
                {/* 定义子路由 */}
                <Route path="controlPanel" element={<Dashboard />} />
                <Route path="markdown" element={<Dashboard />} />
                <Route path="article/:articleId" element={<Dashboard />}/>
                <Route path="page" element={<Dashboard />} />
                <Route path="map" element={<Dashboard />} />
                <Route path="articles" element={<Dashboard />} />
                <Route path="mindMap/:id" element={<Dashboard />} />
                <Route path="categories" element={<Dashboard />} />
                <Route path="tags" element={<Dashboard />} />
                <Route path="userList" element={<Dashboard />} />
                <Route path="Settings" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
