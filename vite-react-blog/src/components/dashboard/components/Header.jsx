import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker.jsx';
import NavbarBreadcrumbs from './NavbarBreadcrumbs.jsx';
import MenuButton from './MenuButton.jsx';
import ColorModeIconDropdown from '../../../shared-theme/ColorModeIconDropdown';
import OpenInBrowserIcon from '@mui/icons-material/OpenInBrowser';
import Search from './Search.jsx';
import {useNavigate} from "react-router-dom";

export default function Header({ selectedMenu, onMenuSelect }) {
    const navigate = useNavigate(); // 路由跳转

    return (
        <Stack
            direction="row"
            sx={{
                display: { xs: 'none', md: 'flex' },
                width: '100%',
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between',
                maxWidth: { sm: '100%', md: '1700px' },
                pt: 1.5,
            }}
            spacing={2}
        >
            <NavbarBreadcrumbs selectedMenu={selectedMenu} onMenuSelect={onMenuSelect} />
            <Stack direction="row" sx={{ gap: 1 }}>
                <Search />
                <CustomDatePicker />
                <MenuButton onClick={() => navigate("/")}>
                    <OpenInBrowserIcon />
                </MenuButton>
                <MenuButton showBadge aria-label="Open notifications">
                    <NotificationsRoundedIcon />
                </MenuButton>
                <ColorModeIconDropdown />
            </Stack>
        </Stack>
    );
}
