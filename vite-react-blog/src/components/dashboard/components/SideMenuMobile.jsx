import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton.jsx';
import MenuContent from './MenuContent.jsx';
import CardAlert from './CardAlert.jsx';
import { useEffect, useState } from "react";
import { logout} from "../../../api/User.js";
import {useNavigate} from "react-router-dom";

function SideMenuMobile({ open, toggleDrawer, onMenuSelect }) {
  const [user, setUser] = useState(null); // 保存用户信息
  const [loading, setLoading] = useState(true); // 保存加载状态
  const [error, setError] = useState(null); // 保存错误信息
  const navigate = useNavigate();


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true); // 开始加载
        const userInfo = localStorage.getItem('userInfo'); // 调用 API 获取用户信息
        setUser(JSON.parse(userInfo)); // 保存用户信息到状态
        setLoading(false); // 加载完成
      } catch (err) {
        console.error('获取用户信息失败:', err);
        setError('Failed to load user info');
        setLoading(false); // 加载完成
      }
    };

    fetchUserInfo();
  }, []); // 仅在组件挂载时执行一次

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('退出登录失败:', error);
      // 可根据需要显示错误提示
      alert('退出登录失败，请重试！');
    }
  };

  return (
      <Drawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            [`& .${drawerClasses.paper}`]: {
              backgroundImage: 'none',
              backgroundColor: 'background.paper',
            },
          }}
      >
        <Stack
            sx={{
              maxWidth: '70dvw',
              height: '100%',
            }}
        >
          <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
            <Stack
                direction="row"
                sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
            >
              <Avatar
                  sizes="small"
                  alt={user?.username || "Riley Carter"}
                  src={user?.avatar || "/static/images/avatar/7.jpg"}
                  sx={{ width: 24, height: 24 }}
              />
              <Typography component="p" variant="h6">
                {user?.nickName}
              </Typography>
            </Stack>
            <MenuButton showBadge>
              <NotificationsRoundedIcon />
            </MenuButton>
          </Stack>
          <Divider />
          <Stack sx={{ flexGrow: 1 }}>
            <MenuContent onMenuSelect={onMenuSelect} />
            <Divider />
          </Stack>
          <CardAlert />
          <Stack sx={{ p: 2 }}>
            <Button variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}  onClick={handleLogout}>
              Logout
            </Button>
          </Stack>
        </Stack>
      </Drawer>
  );
}

SideMenuMobile.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func.isRequired,
  onMenuSelect: PropTypes.func, // 添加对 onMenuSelect 的验证
};

export default SideMenuMobile;
