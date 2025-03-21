import React from "react";
import {  Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
//import { getCurrentUser } from '../api/User.js'; // 导入获取用户信息的函数

// 检查用户是否已登录
const isAuthenticated = () => {
    // const userInfo = getCurrentUser(); // 从 Token 中获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    console.log('获取用户信息成功:', userInfo);
    return !!userInfo; // 如果用户信息存在，则返回 true
};

const PrivateRoute = ({ children }) => {
    const [isAuth, setIsAuth] = React.useState(null);

    React.useEffect(() => {
        const checkAuth = () => {
            const authState = isAuthenticated();
            setIsAuth(authState);
        };
        checkAuth();
    }, []);

    // 如果未完成登录状态检查，显示加载状态
    if (isAuth === null) return <p>加载中...</p>;

    // 如果已登录，渲染子组件；否则重定向到登录页面
    return isAuth ? children : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PrivateRoute;
