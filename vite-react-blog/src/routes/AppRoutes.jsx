import { Routes, Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute";
import Blog from "../pages/Blog.jsx";
import SignIn from "../pages/SignIn.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import FlowEditor from "../components/Flow/FlowEditor.jsx";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Blog />} />
            <Route path="/article/:articleId" element={<Blog />} />
            <Route path="/map" element={<Blog/>} />
            <Route path="/mindMap/:id" element={<Blog />} />
            <Route path="/books" element={<Blog />} />

            <Route path="/login" element={<SignIn />} />

            <Route path="/flowEditor" element={<FlowEditor />} />

            <Route path="/admin" element={
                <PrivateRoute>
                    <Dashboard />
                </PrivateRoute>
            }>
                {/* 定义子路由 */}
                <Route path="controlPanel" element={<Dashboard />} />
                <Route path="markdown" element={<Dashboard />} />
                <Route path="books" element={<Dashboard />} />
                <Route path="article/:articleId" element={<Dashboard />}/>
                <Route path="page" element={<Dashboard />} />
                <Route path="map" element={<Dashboard />} />
                <Route path="articles" element={<Dashboard />} />
                <Route path="mindMap/:id" element={<Dashboard />} />
                <Route path="categories" element={<Dashboard />} />
                <Route path="tags" element={<Dashboard />} />
                <Route path="comments" element={<Dashboard />} />
                <Route path="userList" element={<Dashboard />} />
                <Route path="Settings" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

export default AppRoutes;
