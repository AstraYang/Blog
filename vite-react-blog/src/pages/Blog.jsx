import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import AppTheme from '../shared-theme/AppTheme.jsx';
import AppAppBar from '../components/blog/AppAppBar.jsx';
import Latest from '../components/blog/Latest.jsx';
import Footer from '../components/blog/Footer.jsx';
import LinkCardPage from "../components/blog/LinkCardPage.jsx";
import MindMapList from "../components/blog/MindMapList.jsx";
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import ArticleDetail from "../components/blog/ArticleDetail.jsx";
import Bookshelf from "../components/blog/Bookshelf.jsx";
import MindMapDetail from "../components/blog/MindMapDetail.jsx";
export default function Blog(props) {
   // const location = useLocation(); // 获取当前 URL
    const navigate = useNavigate();
    const { id } = useParams();
    const {articleId} = useParams();
    const [selectedMenu, setSelectedMenu] = React.useState('首页'); // 默认选中“首页”

    const handleMenuSelect = (menu) => {
        console.log("选择的菜单:", menu);
        setSelectedMenu(menu);
        navigate(`/${menu}`); // 跳转到对应的 URL
    };

    // React.useEffect(() => {
    //     // 根据 URL 更新选中的菜单
    //     if (location.pathname === '/') {
    //         setSelectedMenu('首页');
    //
    //     }else if (location.pathname.startsWith('/article/')) {
    //         setSelectedMenu('文章');
    //     }
    // }, []);

    return (
        <AppTheme {...props}>
            <CssBaseline enableColorScheme />
            <AppAppBar onSelectMenu={handleMenuSelect} />
            <Container
                maxWidth="lg"
                component="main"
                sx={{ display: 'flex',minHeight: '81vh' ,flexDirection: 'column', mt: 12, mb: -10,gap: 4}}
            >
                {/*<MainContent />*/}
                {selectedMenu === '首页' && !articleId && <Latest />}
                {selectedMenu === '首页' && articleId && < ArticleDetail articleId={articleId} />}
                {selectedMenu === '知识地图' && !id && <MindMapList />}
                {selectedMenu === '知识地图' && id && <MindMapDetail id={id} />}
                {selectedMenu === '导航' && <LinkCardPage />}
                {selectedMenu === '资料' && <Bookshelf />}

            </Container>
            <Footer />
        </AppTheme>
    );
}
