// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Container, Typography, Box } from '@mui/material'
import { login } from '../api/auth';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const result = await login(username, password);
            console.log('登录成功:', result);

            // 登录成功后跳转到首页
            navigate('/dashboard');
            // eslint-disable-next-line no-unused-vars
        } catch (error) {
            setError('登录失败，请检查用户名和密码是否正确。');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Typography variant="h4" align="center" gutterBottom>
                    登录
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="用户名"
                        fullWidth
                        margin="normal"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <TextField
                        label="密码"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && (
                        <Typography color="error" align="left" gutterBottom variant="body2">
                            {error}
                        </Typography>
                    )}
                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            登录
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
};

export default Login;