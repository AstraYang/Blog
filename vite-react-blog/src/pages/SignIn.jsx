import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Link as MuiLink,
  TextField,
  Typography,
  Stack,
  Card as MuiCard,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ForgotPassword from "../components/sigin-in/ForgotPassword.jsx";
import AppTheme from "../shared-theme/AppTheme.jsx";
import ColorModeSelect from "../shared-theme/ColorModeSelect.jsx";
import { login, register } from "../api/User.js";
import { useNavigate } from 'react-router-dom';
import {sendEmail} from "../api/email.js";
import {getSiteSettings} from "../api/menuStorage.js";
import {message} from "antd";

// 翻转容器样式
const FlipContainer = styled(Box)({
  perspective: '1000px',
  width: '100%',
  maxWidth: '450px',
  margin: 'auto',
  position: 'relative',
  height: '600px' // 根据实际内容高度调整
});

// 翻转动画容器

const Flipper = styled(Box)(({ isflipped }) => ({
  transition: 'transform 0.6s ease-out',
  transformStyle: 'preserve-3d',
  position: 'relative',
  width: '100%',
  height: '100%',
  transform: isflipped ? 'rotateY(180deg)' : 'rotateY(0)',
}));

// 基础卡片样式
const BaseCard = styled(MuiCard)(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
        "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

// 正面卡片（登录）
const FrontCard = styled(BaseCard)({
  zIndex: 2,
  transform: 'rotateY(0deg)',
});

// 背面卡片（注册）
const BackCard = styled(BaseCard)({
  transform: 'rotateY(180deg)',
  backgroundColor: theme => theme.palette.background.paper,
});

// 页面容器
const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc((1 - var(--template-frame-height, 0)) * 100dvh)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
        "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
          "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

export default function SignIn(props) {
  const [verificationCode, setVerificationCode] = useState("");
  const [isRegistration, setIsRegistration] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [formErrors, setFormErrors] = useState({
    username: { error: false, message: "" },
    password: { error: false, message: "" },
    email: { error: false, message: "" },
    confirmPassword: { error: false, message: "" }
  });
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const { allowRegistration } = getSiteSettings();
    setIsRegistration(allowRegistration);
  }, []);

  // 字段验证函数
  const validateField = (name, value) => {
    const newErrors = { ...formErrors };
    switch (name) {
      case 'username':
        newErrors.username.error = !value || value.trim() === "";
        newErrors.username.message = newErrors.username.error
            ? "请输入一个有效的用户名."
            : "";
        break;
      case 'password':
        newErrors.password.error = !value || value.length < 6;
        newErrors.password.message = newErrors.password.error
            ? "密码必须至少为6个字符."
            : "";
        break;
      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        newErrors.email.error = !value || !emailRegex.test(value);
        newErrors.email.message = newErrors.email.error
            ? "请输入一个有效的电子邮件地址."
            : "";
        break;
      }
      case 'confirmPassword': {
        const password = document.getElementById('reg-password')?.value;
        newErrors.confirmPassword.error = value !== password;
        newErrors.confirmPassword.message = newErrors.confirmPassword.error
            ? "密码不一致."
            : "";
        break;
      }
      default:
        break;
    }
    setFormErrors(newErrors);
    return !newErrors[name].error;
  };

  // 处理弹窗开关
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // 表单提交处理
  const handleSubmit = async (event, isLogin) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let isValid = true;

    // 验证逻辑
    if (isLogin) {
      isValid = ['username', 'password'].every(field => {
        const value = formData.get(field);
        return validateField(field, value);
      });
    } else {
      isValid = ['username', 'password', 'email', 'confirmPassword'].every(field => {
        const value = formData.get(field);
        return validateField(field, value);
      });
    }

    if (!isValid) return;

    try {
      if (isLogin) {
        // 登录逻辑
        const response = await login(formData.get('username'), formData.get('password'));
        console.log("code:",response);
       if (response.code === 200) {
          message.success("登录成功");
          navigate("/admin");
       }else{
         message.error(response.data);
       }
      } else {

       const response = await register({
          username: formData.get('username'),
          email: formData.get('email'),
          password: formData.get('password'),
          code: verificationCode

        });
       if (response.code === 200) {
         setIsFlipped(false);
         message.success("注册成功! 前往登陆");

       }else {
         message.error('注册失败! 注册信息已存在');
       }      }
    } catch (error) {
      message.error(`Error: 账号/密码错误!`,error);
    }
  };

  // 发送验证码的函数
  const handleSendCode = async () => {
    const email = document.getElementById('reg-email').value;
    console.log('Email:', email)

    if (!email) {
      message.error("请输入您的电子邮件地址.");
      return;
    }

    try {
      await sendEmail(email); // 这里调用你的发送验证码的API
      setIsCodeSent(true);
      message.error("验证码已发送到您的电子邮件中");
    } catch (error) {
      message.error(`Error: ${error.message}`);
    }
  };


  return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <SignInContainer direction="column" justifyContent="space-between">
          <ColorModeSelect sx={{ position: "fixed", top: "1rem", right: "1rem" }} />
          <FlipContainer>
            <Flipper isflipped={isFlipped}>
              {/* 登录表单 - 正面 */}
              <FrontCard>
                {/*<SitemarkIcon />*/}
                <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 1vw, 1.15rem)' }}>
                  Sign in
                </Typography>

                <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e, true)}
                    sx={{ gap: 2, mt: 2 }}
                >
                  <FormControl fullWidth>
                    <FormLabel htmlFor="login-username">Username</FormLabel>
                    <TextField
                        id="login-username"
                        name="username"
                        error={formErrors.username.error}
                        helperText={formErrors.username.message}
                        onBlur={(e) => validateField('username', e.target.value)}
                        placeholder="Enter your username"
                        autoComplete="username"
                        autoFocus
                    />
                  </FormControl>

                  <FormControl fullWidth>
                    <FormLabel htmlFor="login-password">Password</FormLabel>
                    <TextField
                        id="login-password"
                        name="password"
                        type="password"
                        error={formErrors.password.error}
                        helperText={formErrors.password.message}
                        onBlur={(e) => validateField('password', e.target.value)}
                        placeholder="••••••"
                        autoComplete="current-password"
                    />
                  </FormControl>

                  <FormControlLabel
                      control={<Checkbox value="remember" color="primary" />}
                      label="记住我"
                      sx={{ mt: 1 }}
                  />

                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ mt: 2 }}
                  >
                    登录
                  </Button>

                  <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <MuiLink
                        component="button"
                        type="button"
                        onClick={handleClickOpen}
                        variant="body2"
                    >
                      忘记密码?
                    </MuiLink>
                    <ForgotPassword open={open} handleClose={handleClose} />
                  </Box>

                  {isRegistration ? (
                      <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                        您还没有账号?{' '}
                        <MuiLink
                            component="button"
                            type="button"
                            onClick={() => setIsFlipped(true)}
                            sx={{ fontWeight: 600 }}
                        >
                          注册账号
                        </MuiLink>
                      </Typography>
                  ) : (
                      <></>
                  )}

                </Box>
              </FrontCard>

              {/* 注册表单 - 背面 */}
              <BackCard>
                {/*<SitemarkIcon />*/}
                <Typography component="h1" variant="h4" sx={{ fontSize: 'clamp(2rem, 1vw, 1.15rem)' }}>
                  Sign up
                </Typography>


                <Box
                    component="form"
                    onSubmit={(e) => handleSubmit(e, false)}
                    sx={{ gap: 2, mt: -2.5 }}
                >
                  {/* 用户名输入框 */}
                  <FormControl fullWidth>
                    <FormLabel htmlFor="reg-username">Username</FormLabel>
                    <TextField
                        id="reg-username"
                        name="username"
                        error={formErrors.username.error}
                        helperText={formErrors.username.message}
                        onBlur={(e) => validateField('username', e.target.value)}
                        placeholder="Choose a username"
                        autoComplete="username"
                        autoFocus
                    />
                  </FormControl>

                  {/* 邮箱输入框 */}
                  <FormControl fullWidth>
                    <FormLabel htmlFor="reg-email">Email</FormLabel>
                    <TextField
                        id="reg-email"
                        name="email"
                        type="email"
                        error={formErrors.email.error}
                        helperText={formErrors.email.message}
                        onBlur={(e) => validateField('email', e.target.value)}
                        placeholder="your@email.com"
                        autoComplete="email"
                    />
                  </FormControl>

                  {/* 验证码输入框和发送按钮 */}
                  <FormControl fullWidth>
                    <FormLabel htmlFor="reg-verification-code">Verification Code</FormLabel>
                    <Stack direction="row" spacing={1}>
                      <TextField
                          id="reg-verification-code"
                          name="verificationCode"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          placeholder="Enter verification code"
                          autoComplete="off"
                      />
                      <Button
                          variant="outlined"
                          onClick={handleSendCode}
                          disabled={isCodeSent} // 发送验证码后禁用按钮
                      >
                        {isCodeSent ? "已发送验证码" : "发送验证码"}
                      </Button>
                    </Stack>
                  </FormControl>

                  {/* 密码输入框 */}
                  <FormControl fullWidth>
                    <FormLabel htmlFor="reg-password">Password</FormLabel>
                    <TextField
                        id="reg-password"
                        name="password"
                        type="password"
                        error={formErrors.password.error}
                        helperText={formErrors.password.message}
                        onBlur={(e) => validateField('password', e.target.value)}
                        placeholder="••••••"
                        autoComplete="new-password"
                    />
                  </FormControl>

                  {/* 确认密码输入框 */}
                  <FormControl fullWidth>
                    <FormLabel htmlFor="reg-confirm-password">Confirm Password</FormLabel>
                    <TextField
                        id="reg-confirm-password"
                        name="confirmPassword"
                        type="password"
                        error={formErrors.confirmPassword.error}
                        helperText={formErrors.confirmPassword.message}
                        onBlur={(e) => validateField('confirmPassword', e.target.value)}
                        placeholder="••••••"
                        autoComplete="new-password"
                    />
                  </FormControl>

                  <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      size="large"
                      sx={{ mt: 2 }}
                  >
                    注册
                  </Button>

                  <Typography variant="body2" sx={{ textAlign: 'center', mt: 3 }}>
                    已有账号?{' '}
                    <MuiLink
                        component="button"
                        type="button"
                        onClick={() => setIsFlipped(false)}
                        sx={{ fontWeight: 600 }}
                    >
                      登录账号
                    </MuiLink>
                  </Typography>
                </Box>
              </BackCard>

            </Flipper>
          </FlipContainer>
        </SignInContainer>
      </AppTheme>
  );
}