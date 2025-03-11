import * as React from 'react';
import { alpha, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown.jsx';
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logout } from '../../api/User.js';
import Drawer from "@mui/material/Drawer";
import { getMenuItems, getSiteSettings } from '../../menuStorage'; // 确保从存储中获取网站设置

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
      : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

const MenuButton = styled(Button)(({ selected }) => ({
  position: 'relative',
  '&::after': {
    content: selected ? '""' : 'none',
    position: 'absolute',
    left: '50%',
    bottom: -4,
    transform: 'translateX(-50%)',
    width: '100%',
    height: 2,
    backgroundColor: 'currentColor',
  },
}));

export default function AppAppBar({ onSelectMenu }) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [user, setUser] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedMenu, setSelectedMenu] = React.useState('首页'); // 选中状态
  const [siteSettings, setSiteSettings] = React.useState({}); // 新增状态用于存储网站设置

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const handleSigin = () => {
    navigate("/login");
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    setUser(null);
    await logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    onSelectMenu(menu);
  };

  React.useEffect(() => {
    async function fetchUserInfo() {
      try {
        const userInfo = await getCurrentUser();
        setUser(userInfo);
        console.log('获取用户信息成功:', userInfo.nickName);
      } catch (error) {
        console.error('未登录或获取用户信息失败', error);
      }
    }
    fetchUserInfo();

    // 加载网站设置
    const settings = getSiteSettings();
    setSiteSettings(settings);
  }, []);

  const menuItems = getMenuItems();

  return (
      <AppBar
          position="fixed"
          enableColorOnDark
          sx={{
            boxShadow: 0,
            bgcolor: 'transparent',
            backgroundImage: 'none',
            mt: 'calc(var(--template-frame-height, 0px) + 28px)',
          }}
      >
        <Container maxWidth="lg">
          <StyledToolbar variant="dense" disableGutters>
            <Box
                sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}
                onClick={() => navigate('/')}
            >
              {/* 显示网站 Logo */}
              {siteSettings.logo && (
                  <Box
                      component="img"
                      src={siteSettings.logo}
                      alt="Logo"
                      sx={{
                        height: 40, // 根据需要调整高度
                        marginRight: 2, // 添加右边距
                      }}
                  />
              )}
              {/* 导航按钮 */}
              <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                {Object.keys(menuItems).map((menu) => (
                    <MenuButton
                        key={menu}
                        variant="text"
                        color="info"
                        size="small"
                        selected={selectedMenu === menu}
                        onClick={() => handleMenuClick(menu)}
                    >
                      {menu}
                    </MenuButton>
                ))}
              </Box>
            </Box>
            <Box
                sx={{
                  display: { xs: 'none', md: 'flex' },
                  gap: 1,
                  alignItems: 'center',
                }}
            >
              {user ? (
                  <>
                    <IconButton onClick={handleMenuOpen} sx={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      padding: 0,
                    }}>
                      <Avatar alt={user.nickName} src={user.avatar} />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                      <MenuItem disabled>{user.nickName}</MenuItem>
                      <Divider />
                      <MenuItem onClick={() => navigate('/admin')}>后台管理</MenuItem>
                      <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                  </>
              ) : (
                  <Button color="primary" variant="contained" size="small" onClick={handleSigin}>
                    Sign in
                  </Button>
              )}
              <ColorModeIconDropdown />
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
              <ColorModeIconDropdown size="medium" />
              <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer
                  anchor="top"
                  open={open}
                  onClose={toggleDrawer(false)}
                  PaperProps={{
                    sx: {
                      top: 'var(--template-frame-height, 0px)',
                    },
                  }}
              >
                <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                  <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                      }}
                  >
                    <IconButton onClick={toggleDrawer(false)}>
                      <CloseRoundedIcon />
                    </IconButton>
                  </Box>
                  {Object.keys(menuItems).map((menu) => (
                      <MenuItem key={menu} onClick={() => handleMenuClick(menu)}>
                        {menu}
                      </MenuItem>
                  ))}
                  <Divider sx={{ my: 3 }} />
                  <MenuItem>
                    <Button color="primary" variant="contained" fullWidth>
                      Sign up
                    </Button>
                  </MenuItem>
                  <MenuItem>
                    <Button color="primary" variant="outlined" fullWidth onClick={handleSigin}>
                      Sign in
                    </Button>
                  </MenuItem>
                </Box>
              </Drawer>
            </Box>
          </StyledToolbar>
        </Container>
      </AppBar>
  );
}
