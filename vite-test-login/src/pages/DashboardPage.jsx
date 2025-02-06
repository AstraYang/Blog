// src/components/DashboardPage.jsx

import React from "react";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth.js";

const DashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            // 调用后端的退出接口
            await logout();
            // 成功退出后，导航到登录页面
            navigate("/");
        } catch (error) {
            console.error("退出登录失败:", error);
            alert("退出登录失败，请稍后重试！");
        }
    };

    const handleEditArticle = () => {
        // 导航到编辑文章页面
        navigate("/markdown");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
            }}
        >
            <Typography variant="h3" gutterBottom>
                欢迎来到仪表盘页面！
            </Typography>
            <Typography variant="body1" gutterBottom>
                您已经成功登录。
            </Typography>
            <Button variant="contained" color="primary" onClick={handleLogout} style={{ marginBottom: '16px' }}>
                退出登录
            </Button>
            <Button variant="contained" color="secondary" onClick={handleEditArticle}>
                编辑文章
            </Button>
        </Box>
    );
};

export default DashboardPage;
