import React from "react";
import { Route, Navigate } from "react-router-dom";
import PropTypes from 'prop-types';

// 检查用户是否已登录
const isAuthenticated = async () => {
    const response = await fetch("http://localhost:8080/admin/user/current", {
        method: "GET",
        credentials: "include", // 携带 Session Cookie
    });
    const data = await response.json();
    return data.code === 200; // 如果登录成功，返回 true，否则返回 false
};

const PrivateRoute = ({ children }) => {
    const [isAuth, setIsAuth] = React.useState(null);

    React.useEffect(() => {
        const checkAuth = async () => {
            const authState = await isAuthenticated();
            setIsAuth(authState);
        };
        checkAuth();
    }, []);

    // 如果未完成登录状态检查，显示加载状态
    if (isAuth === null) return <p>加载中...</p>;

    // 如果已登录，渲染子组件；否则重定向到登录页面
    return isAuth ? children : <Navigate to="/" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
