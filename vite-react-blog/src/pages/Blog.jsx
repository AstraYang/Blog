import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/blog/AppAppBar.jsx';
import Latest from '../components/blog/Latest.jsx';
import Footer from '../components/blog/Footer.jsx';
import LinkCardPage from "../components/blog/LinkCardPage.jsx";
import MindMap from "../components/dashboard/components/MinMap.jsx"; // 修正组件名
import MindMapList from "../components/blog/MindMapList.jsx";
import { useLocation, useParams } from 'react-router-dom';
import ArticleDetail from "../components/blog/ArticleDetail.jsx";

export default function Blog(props) {
    const location = useLocation(); // 获取当前 URL
    const { id } = useParams(); // 假设在路由中定义了 mindmapId 的参数
    const [selectedMenu, setSelectedMenu] = React.useState('首页'); // 默认选中“首页”

    React.useEffect(() => {
        // 根据 URL 更新选中的菜单
        if (location.pathname === '/') {
            setSelectedMenu('首页');
        } else if (location.pathname.startsWith('/mindMap/')) {
            setSelectedMenu('知识地图'); // 或对应的菜单项
        }else if (location.pathname.startsWith('/article/')) {
            setSelectedMenu('文章'); // 或对应的菜单项
        }
    }, [location.pathname]);

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar onSelectMenu={setSelectedMenu} />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
            >
                {selectedMenu === '首页' && <Latest />}
                {selectedMenu === '文章' && < ArticleDetail id={id} />}
                {selectedMenu === '知识地图' && !id && <MindMapList />}
                {selectedMenu === '知识地图' && id && <MindMap id={id} />}
                {selectedMenu === '导航' && <LinkCardPage />}

            </Container>
            <Footer />
        </AppTheme>
    );
}
