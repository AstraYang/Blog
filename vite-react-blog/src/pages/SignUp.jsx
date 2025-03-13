import { useState } from "react";
import {
    Box,
    Button,
    CssBaseline,
    FormControl,
    FormLabel,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { register } from "../api/User.js"; // 假设您有一个 register 方法
import AppTheme from "../shared-theme/AppTheme.jsx";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
}));

const SignUpContainer = styled(Stack)(({ theme }) => ({
    height: "100vh",
    padding: theme.spacing(2),
}));

export default function SignUp() {
    const [usernameError, setUsernameError] = useState(false);
    const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");

    const validateInputs = () => {
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const email = document.getElementById("email");

        let isValid = true;

        if (!username.value || username.value.trim() === "") {
            setUsernameError(true);
            setUsernameErrorMessage("Please enter a valid username.");
            isValid = false;
        } else {
            setUsernameError(false);
            setUsernameErrorMessage("");
        }

        if (!password.value || password.value.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage("Password must be at least 6 characters long.");
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage("");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value || !emailPattern.test(email.value)) {
            setEmailError(true);
            setEmailErrorMessage("Please enter a valid email address.");
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage("");
        }

        return isValid;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateInputs()) return;

        const data = new FormData(event.currentTarget);
        const username = data.get("username");
        const password = data.get("password");
        const email = data.get("email");

        try {
            const response = await register(username, password, email); // 调用注册 API
            console.log("注册成功:", response);
            alert("Registration successful!");
        } catch (error) {
            console.error("注册失败:", error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <AppTheme>
            <CssBaseline />
            <SignUpContainer spacing={2} justifyContent="center">
                <Card variant="outlined">
                    <Typography component="h1" variant="h4">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <FormControl>
                            <FormLabel htmlFor="username">Username</FormLabel>
                            <TextField
                                error={usernameError}
                                helperText={usernameErrorMessage}
                                id="username"
                                type="text"
                                name="username"
                                placeholder="Enter your username"
                                autoComplete="username"
                                required
                                fullWidth
                                variant="outlined"
                                color={usernameError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                error={emailError}
                                helperText={emailErrorMessage}
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                                color={emailError ? "error" : "primary"}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                error={passwordError}
                                helperText={passwordErrorMessage}
                                name="password"
                                placeholder="••••••"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                color={passwordError ? "error" : "primary"}
                            />
                        </FormControl>
                        <Button type="submit" fullWidth variant="contained">
                            Sign Up
                        </Button>
                    </Box>
                </Card>
            </SignUpContainer>
        </AppTheme>
    );
}
