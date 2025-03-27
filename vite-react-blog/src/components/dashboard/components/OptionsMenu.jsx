import * as React from 'react';
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MuiMenuItem from '@mui/material/MenuItem';
import { paperClasses } from '@mui/material/Paper';
import { listClasses } from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import MenuButton from './MenuButton.jsx';
import {logout, updateEmail, updatePassword, updateUser, uploadUserImage} from "../../../api/User.js";
import { useNavigate } from 'react-router-dom';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Avatar,
    Tabs,
    Tab,
} from '@mui/material';
import { useEffect, useState } from 'react';
import {message} from "antd";
import Typography from "@mui/material/Typography";
import {sendResetEmail} from "../../../api/email.js";
import {Email} from "@mui/icons-material";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "-1px",
                    fontSize: "14px",
                },
                shrink: {
                    top: "-5px",
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    width: '90%',
                    height: '50px',
                },
            },
        },
    },
});
const MenuItem = styled(MuiMenuItem)({
    margin: '2px 0',
});


export default function OptionsMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openSettings, setOpenSettings] = React.useState(false);
    const [value, setValue] = useState(0);
    const [openReloginDialog, setOpenReloginDialog] = useState(false);
    const [reloginMessage, setReloginMessage] = useState("");
    const [reloginAction, setReloginAction] = useState(null);
    const [userInfo, setUserInfo] = React.useState({
        username: '',
        email: '',
        newEmail:'',
        code:'',
        nickname: '',
        newPassword: '',
        password: '',
        confirmPassword: '',
        userGroup: '',
        avatar: '',
    });
    const [previewImage, setPreviewImage] = useState(null);
    const navigate = useNavigate();
    const open = Boolean(anchorEl);

    useEffect(() => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfoData = JSON.parse(userInfoString);
            setUserInfo({
                id: userInfoData.id,
                username: userInfoData.username || '',
                email: userInfoData.email || '',
                nickname: userInfoData.nickName || '',
                newPassword: '',
                password: '',
                confirmPassword: '',
                userGroup: userInfoData.authorityString || '',
                avatar: userInfoData.avatar || '',
            });
            setPreviewImage(userInfoData.avatar);
        }
    }, []);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('退出登录失败:', error);
            alert('退出登录失败，请重试！');
        }
    };

    const handleOpenSettings = () => {
        setOpenSettings(true);
        handleClose();
    };

    const handleCloseSettings = () => {
        setOpenSettings(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserInfo({ ...userInfo, [name]: value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 使用函数式更新状态
            setUserInfo((prevState) => ({
                ...prevState,
                avatar: file // 保存图片文件
            }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 设置预览图片
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveSettings = async () => {
        console.log('用户信息:', userInfo);
        let userAvatar = "";
        if (userInfo.avatar && typeof userInfo.avatar === 'object') {
            userAvatar = await uploadUserImage(userInfo.avatar);
        } else if (userInfo.avatar && typeof userInfo.avatar === "string") {
            // 如果 avatar 是一个字符串，意味着用户没有更新图片，直接使用现有的 URL
            userAvatar = userInfo.avatar;
        }
        const userData = {
            id: userInfo.id,
            nickName: userInfo.nickname,
            avatar: userAvatar,
        };

        const success = await updateUser(userData);
        if (success.code === 200) {
            message.success("用户信息更新成功！");
            handleCloseSettings();

            // 显示重新登录提示
            setReloginMessage("个人信息已更新，重新登录后生效。");
            setReloginAction(() => () => {
                handleLogout();
            });
            setOpenReloginDialog(true);
        } else {
            message.error("用户信息更新失败，请重试！");
        }
    };



    const handleChangePassword = async () => {
        // 当前代码中参数命名有误
        // 修改参数匹配，确保字段名称正确对应
        if (!userInfo.password || !userInfo.newPassword || !userInfo.confirmPassword) {
            message.error("请填写所有密码字段");
            return;
        }

        if (userInfo.newPassword !== userInfo.confirmPassword) {
            message.error("两次输入的新密码不一致");
            return;
        }

        const updatePassData = {
            id: userInfo.id,
            password: userInfo.password,         // 旧密码
            newPassword: userInfo.newPassword,   // 新密码
        }

        try {
            const result = await updatePassword(updatePassData);
            if (result.code === 200) {
                message.success("密码已成功更改！");
                // 清空密码字段
                setUserInfo({
                    ...userInfo,
                    password: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                handleCloseSettings();

                // 显示重新登录提示
                setReloginMessage("密码已更新，重新登录后生效。");
                setReloginAction(() => () => {
                    handleLogout();
                });
                setOpenReloginDialog(true);
            } else {
                message.error(result.message || "密码更改失败，请重试！");
            }
        } catch (error) {
            console.error("修改密码出错:", error);
            message.error("修改密码时发生错误，请重试！");
        }
    };

    const handleSendEmail = async () => {
        const result = await sendResetEmail(userInfo.email);
        if (result.code !== 200) {
            message.error(result.message || "重置密码邮件发送失败，请重试！");
            return;
        }
        message.success("重置密码邮件已发送，请检查您的邮箱！");
    }



    const handleChangeEmail = async () => {
        if (!userInfo.code || !userInfo.newEmail) {
            message.error("请填写验证码和新邮箱地址");
            return;
        }

        console.log('新邮箱:', userInfo);
        const newEmailData = {
            code: userInfo.code,
            email: userInfo.email,
            newEmail: userInfo.newEmail,
        };
        try{
            const result = await updateEmail(newEmailData);
            if (result.code === 200){
                message.success("邮箱已更新成功！");
                setUserInfo({
                    ...userInfo,
                    code: '',
                    newEmail: '',
                });
                handleCloseSettings();

                // 显示重新登录提示
                setReloginMessage("邮箱已更新，重新登录后生效。");
                setReloginAction(() => () => {
                    handleLogout();
                });
                setOpenReloginDialog(true);
            } else {
                message.error(result.message || "邮箱更改失败，请重试！");
            }
        } catch (error) {
            console.error("修改邮箱出错:", error);
            message.error("修改邮箱时发生错误，请重试！");
        }
    };

    const renderUserInfo = () => (
        <Grid container spacing={4} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="用户名"
                    value={userInfo.username}
                    InputProps={{
                        readOnly: true,
                    }}
                    helperText="此用户名将作为登录使用 无法修改."
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="用户昵称"
                    name="nickname"
                    value={userInfo.nickname}
                    onChange={handleInputChange}
                    helperText="用户昵称用于前台显示"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="邮箱地址"
                    value={userInfo.email}
                    InputProps={{
                        readOnly: true,
                    }}
                    helperText="邮箱地址用于找回密码"
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="权限组"
                    value={userInfo.userGroup}
                    InputProps={{
                        readOnly: true,
                    }}
                    helperText="无法修改"
                />
            </Grid>
        </Grid>
    );

    const renderChangePassword = () => (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    type="password"
                    label="旧密码"
                    name="password"
                    value={userInfo.password}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    type="password"
                    label="新密码"
                    name="newPassword"
                    value={userInfo.newPassword}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    type="password"
                    label="确认新密码"
                    name="confirmPassword"
                    value={userInfo.confirmPassword}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item container xs={10.9} justifyContent="flex-end">
                <Button variant="contained" color="secondary" onClick={handleChangePassword}>
                    提交
                </Button>
            </Grid>
        </Grid>
    );

    const renderChangeEmail = () => (
        <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="输入验证码"
                    name="code"
                    value={userInfo.code}
                    onChange={handleInputChange}
                    InputProps={{
                        endAdornment: (
                            <Button variant="contained" color="inherit" onClick={handleSendEmail}>发送</Button>
                        ),
                    }}
                    helperText={`更换绑定邮箱需要向${userInfo.email}发送验证.`}
                />
            </Grid>
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="新邮箱地址"
                    name="newEmail"
                    value={userInfo.newEmail}
                    onChange={handleInputChange}
                />
            </Grid>
            <Grid item container xs={10.5} justifyContent="flex-end">
                <Button variant="contained" color="secondary" onClick={handleChangeEmail}>
                    提交
                </Button>
            </Grid>
        </Grid>
    );

    return (
        <ThemeProvider theme={theme}>
            <React.Fragment>
                <MenuButton
                    aria-label="Open menu"
                    onClick={handleClick}
                    sx={{ borderColor: 'transparent' }}
                >
                    <MoreVertRoundedIcon />
                </MenuButton>
                <Menu
                    anchorEl={anchorEl}
                    id="menu"
                    open={open}
                    onClose={handleClose}
                    sx={{
                        [`& .${listClasses.root}`]: { padding: '4px' },
                        [`& .${paperClasses.root}`]: { padding: 0 },
                    }}
                >
                    <MenuItem onClick={handleOpenSettings}>设置</MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                        <ListItemText>Logout</ListItemText>
                        <ListItemIcon>
                            <LogoutRoundedIcon fontSize="small" />
                        </ListItemIcon>
                    </MenuItem>
                </Menu>

                {/* 用户设置模态框 */}
                <Dialog open={openSettings} onClose={handleCloseSettings} maxWidth="sm" fullWidth sx={{ '& .MuiDialogContent-root': { maxHeight: '90vh', overflowY: 'auto' } }}>
                    <DialogTitle>账号设置</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                            <Grid item xs={4} display="flex" flexDirection="column" alignItems="center">
                                {/* 头像部分 */}
                                <Avatar src={previewImage} sx={{ width: 100, height: 100, mb: 3 }} />
                                <Button variant="contained" component="label">
                                    修改头像
                                    <input hidden accept="image/*" type="file" onChange={handleAvatarChange} />
                                </Button>
                            </Grid>
                            <Grid item xs={8} sx={{ flexGrow: 1 }}>
                                <Tabs value={value} onChange={(event, newValue) => setValue(newValue)} aria-label="用户设置选项">
                                    <Tab label="个人信息" />
                                    <Tab label="修改密码" />
                                    <Tab label="修改邮箱" />
                                </Tabs>
                                <div style={{ flexGrow: 1, height: '300px', overflowY: 'auto' }}>
                                    {value === 0 && renderUserInfo()}
                                    {value === 1 && renderChangePassword()}
                                    {value === 2 && renderChangeEmail()}
                                </div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseSettings} color="primary">
                            取消
                        </Button>
                        <Button onClick={handleSaveSettings} color="primary">
                            保存
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={openReloginDialog}
                    onClose={() => setOpenReloginDialog(false)}
                    aria-labelledby="relogin-dialog-title"
                    aria-describedby="relogin-dialog-description"
                >
                    <DialogTitle id="relogin-dialog-title">
                        {"操作成功"}
                    </DialogTitle>
                    <DialogContent>
                        <Typography id="relogin-dialog-description">
                            {reloginMessage}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenReloginDialog(false)} color="primary">
                            稍后重新登录
                        </Button>
                        <Button onClick={reloginAction} color="secondary" autoFocus>
                            立即重新登录
                        </Button>
                    </DialogActions>
                </Dialog>

                <MenuButton
                    aria-label="Open menu"
                    onClick={handleClick}
                    sx={{ borderColor: 'transparent' }}
                >
                    <MoreVertRoundedIcon />
                </MenuButton>


            </React.Fragment>
        </ThemeProvider>
    );
}
