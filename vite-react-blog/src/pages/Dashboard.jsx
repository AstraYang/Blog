import React, { useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/dashboard/components/AppNavbar.jsx';
import Header from '../components/dashboard/components/Header.jsx';
import SideMenu from '../components/dashboard/components/SideMenu.jsx';
import AppTheme from '../shared-theme/AppTheme.jsx';
import CategoryList from "../components/dashboard/components/CategoryList.jsx";
import MainGrid from "../components/dashboard/components/MainGrid.jsx";
import ArticleManagementPage from "./ArticleManagementPage.jsx";
import MarkdownEditor from "../components/dashboard/components/MarkdownEditor.jsx";
import TagList from "../components/dashboard/components/TagList.jsx";
import BlogCreatPage from "./BlogCreatPage.jsx";
import SettingsPage from "../components/dashboard/components/SettingsPage.jsx";
import UserList from "../components/dashboard/components/UserList.jsx";
import MindMap from "../components/dashboard/components/MinMap.jsx";
import MindMapList from "../components/dashboard/components/MindMapList.jsx";

const Dashboard = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams(); // 获取 URL 参数
    const articleId = params.articleId; // 提取 articleId
    const id = params.id;

    const getSelectedMenu = () => {
        const pathParts = location.pathname.split('/');
        const lastPart = pathParts[pathParts.length - 1];

        if (pathParts.length > 2 && pathParts[pathParts.length - 2] === 'article') {
            return 'article'; // 如果是文章路径，返回 'article'
        }
        if (pathParts.length > 2 && pathParts[pathParts.length - 2] === 'mindMap') {
            return 'mindMap'; // 如果是文章路径，返回 'article'
        }

        switch (lastPart) {
            case 'markdown':
                return 'markdown';
            case 'categories':
                return 'categories';
            case 'tags':
                return 'tags';
            case 'articles':
                return 'articles';
            case 'page':
                return 'page';
            case 'map':
                return 'map';
            case 'userList':
                return 'userList';
            case 'Settings':
                return 'Settings';
           case 'controlPanel':
            default:
                return 'controlPanel';
        }
    };

    const [selectedMenu, setSelectedMenu] = React.useState(getSelectedMenu());

    useEffect(() => {
        setSelectedMenu(getSelectedMenu());
    }, [location]);

    const handleMenuSelect = (menu) => {
        setSelectedMenu(menu);
        navigate(`/admin/${menu}`); // 跳转到对应的 URL
    };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'controlPanel':
                return <MainGrid />;
            case 'markdown':
                return <MarkdownEditor />;
            case 'articles':
                return <ArticleManagementPage />;
            case 'article':
                    return <MarkdownEditor articleId={articleId} />;
            case 'categories':
                return <CategoryList />;
            case 'tags':
                return <TagList />;
            case 'page':
                return <BlogCreatPage/>;
            case 'map':
                return <MindMapList />;
            case 'mindMap':
                return <MindMap id={id} />;
            case 'userList':
                return <UserList/>;
            case 'Settings':
                return <SettingsPage/>;
            default:
                return <div>请选择菜单项来查看内容</div>;
        }
    };

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <AppNavbar onMenuSelect={handleMenuSelect} />
                <SideMenu onMenuSelect={handleMenuSelect} />
                <Box component="main" sx={{ flexGrow: 1, overflow: 'auto'}}>
                    <Stack spacing={2} sx={{ alignItems: 'center', mx: 3, pb: 5}}>
                        <Header selectedMenu={selectedMenu} onMenuSelect={setSelectedMenu} />
                        {renderContent()}
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
};

export default Dashboard;
