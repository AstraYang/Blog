import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import MenuContent from './MenuContent.jsx';
import { useEffect, useState } from "react";
import OptionsMenu from "./OptionsMenu.jsx";
//import {getCurrentUser} from "../../../api/User.js";

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
    width: drawerWidth,
    flexShrink: 0,
    boxSizing: 'border-box',
    [`& .${drawerClasses.paper}`]: {
        width: drawerWidth,
        boxSizing: 'border-box',
    },
});

export default function SideMenu({ onMenuSelect }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                setLoading(true);
                const userInfo = localStorage.getItem('userInfo');
                setUser(JSON.parse(userInfo));
                setLoading(false);
            } catch (err) {
                console.error('获取用户信息失败:', err);
                setError('Failed to load user info');
                setLoading(false);
            }
        };

        fetchUserInfo();
    }, []);

    return (
        <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                [`& .${drawerClasses.paper}`]: {
                    backgroundColor: 'background.paper',
                },
            }}
        >
            <Box>
            {/*    */}
            </Box>
            <Box sx={{ display: 'flex', mt: 'calc(var(--template-frame-height, 0px) + 4px)', p: 1.5 }} />
            <Divider />
            <Box sx={{ overflow: 'auto', height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* 菜单内容 */}
                <MenuContent onMenuSelect={onMenuSelect} />
            </Box>
            <Stack
                direction="row"
                sx={{
                    p: 2,
                    gap: 1,
                    alignItems: 'center',
                    borderTop: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {loading ? (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                        Loading...
                    </Typography>
                ) : error ? (
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                        {error}
                    </Typography>
                ) : (
                    <>
                        <Avatar
                            sizes="small"
                            alt={user?.username || 'User Avatar'}
                            src={user?.avatar || '/static/images/avatar/default.jpg'}
                            sx={{ width: 36, height: 36 }}
                        />
                        <Box sx={{ mr: 'auto' }}>
                            <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
                                {user?.nickName}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {user?.email || 'guest@example.com'}
                            </Typography>
                        </Box>
                        <OptionsMenu />
                    </>
                )}
            </Stack>
        </Drawer>
    );
}
