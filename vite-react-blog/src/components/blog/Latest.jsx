import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Pagination,
    IconButton,
    Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded';
import { useNavigate } from 'react-router-dom';
import { fetchArticles } from '../../api/articles';
import { fetchCategories } from '../../api/category';
import { getSiteSettings } from '../../menuStorage'; // 导入获取设置的函数
import { Search } from './MainContent.jsx';

// 使得文本在超过两行时会显示省略号
const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

// 当鼠标悬停在标题上时，显示一个箭头图标，并且在悬停时显示一条底部横线
const TitleTypography = styled(Typography)(({ theme }) => ({
    position: 'relative',
    textDecoration: 'none',
    '&:hover': { cursor: 'pointer' },
    '& .arrow': {
        visibility: 'hidden',
        position: 'absolute',
        right: 0,
        top: '50%',
        transform: 'translateY(-50%)',
    },
    '&:hover .arrow': {
        visibility: 'visible',
        opacity: 0.7,
    },
    '&:focus-visible': {
        outline: '3px solid',
        outlineColor: 'hsla(210, 98%, 48%, 0.5)',
        outlineOffset: '3px',
        borderRadius: '8px',
    },
    '&::before': {
        content: '""',
        position: 'absolute',
        width: 0,
        height: '1px',
        bottom: 0,
        left: 0,
        backgroundColor: (theme.vars || theme).palette.text.primary,
        opacity: 0.3,
        transition: 'width 0.3s ease, opacity 0.3s ease',
    },
    '&:hover::before': {
        width: '100%',
    },
}));

export default function Latest() {
    const [categories, setCategories] = useState([]); // 分类列表
    const [articles, setArticles] = useState([]); // 文章列表
    const [selectedCategory, setSelectedCategory] = useState(null); // 当前选择的分类ID
    const [page, setPage] = useState(1); // 当前页码
    const [totalPages, setTotalPages] = useState(1); // 总页数
    const [focusedCardIndex, setFocusedCardIndex] = useState(null); // 聚焦的卡片索引
    const navigate = useNavigate();

    // 新增的状态来存储网站设置
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');

    const handleFocus = (index) => {
        setFocusedCardIndex(index);
    };

    const handleBlur = () => {
        setFocusedCardIndex(null);
    };

    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId); // 更新所选分类
        setPage(1); // 切换分类时回到第一页
    };

    const handlePageChange = (event, value) => {
        setPage(value); // 更新当前页码
    };

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await fetchCategories();
                if (response) {
                    setCategories(response);
                } else {
                    setCategories([]); // 设置为空数组以避免后续错误
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]); // 设置为空数组以避免后续错误
            }
        }
        loadCategories();
    }, []);

    useEffect(() => {
        async function loadArticles() {
            try {
                const response = await fetchArticles(page, 6, selectedCategory);
                if (response && response.data && Array.isArray(response.data.records)) {
                    setArticles(response.data.records);
                    setTotalPages(response.data.pages || 1);
                } else {
                    setArticles([]); // 如果数据结构异常，设置为空数组
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
                setArticles([]); // 遇到错误时，也设置为空数组以避免页面崩溃
            }
        }

        loadArticles();
    }, [page, selectedCategory]);

    // 新增 useEffect 来获取网站设置
    useEffect(() => {
        const { siteName, siteDescription } = getSiteSettings(); // 从本地存储获取网站设置
        setSiteName(siteName);
        setSiteDescription(siteDescription);
    }, []);

    return (
        <div>
            <Typography variant="h1" gutterBottom>
                {siteName}
            </Typography>
            <Typography>{siteDescription}</Typography>
            <Typography>&nbsp;</Typography>
            <Box
                sx={{
                    display: { xs: 'flex', sm: 'none' },
                    flexDirection: 'row',
                    gap: 1,
                    width: { xs: '100%', md: 'fit-content' },
                    overflow: 'auto',
                }}
            >
                <Search />
                <IconButton size="small" aria-label="RSS feed">
                    <RssFeedRoundedIcon />
                </IconButton>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column-reverse', md: 'row' },
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'start', md: 'center' },
                    gap: 4,
                    overflow: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'inline-flex',
                        flexDirection: 'row',
                        gap: 3,
                        overflow: 'auto',
                    }}
                >
                    <Chip
                        onClick={() => handleCategoryClick(null)}
                        size="medium"
                        label="All categories"
                        sx={{
                            backgroundColor: selectedCategory === null ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                            border: selectedCategory === null ? '1px solid rgba(0, 123, 255, 0.5)' : 'none',
                        }}
                    />
                    {categories.map((category) => (
                        <Chip
                            onClick={() => handleCategoryClick(category.id)}
                            key={category.id}
                            label={category.categoryName}
                            size="medium"
                            sx={{
                                backgroundColor: selectedCategory === category.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                                border: selectedCategory === category.id ? '1px solid rgba(0, 123, 255, 0.5)' : 'none',
                            }}
                        />
                    ))}
                </Box>
                <Box
                    sx={{
                        display: { xs: 'none', sm: 'flex' },
                        flexDirection: 'row',
                        gap: 1,
                        width: { xs: '100%', md: 'fit-content' },
                        overflow: 'auto',
                    }}
                >
                    <Search />
                    <IconButton size="small" aria-label="RSS feed">
                        <RssFeedRoundedIcon />
                    </IconButton>
                </Box>
            </Box>
            <Grid container spacing={8} columns={12} sx={{ my: 4 }}>
                {articles.map((article, index) => (
                    <Grid key={index} item xs={12} sm={6}>
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 2,
                                height: '100%',
                                alignItems: 'flex-start',
                            }}
                        >
                            {article.image && (
                                <Box
                                    component="img"
                                    src={article.image}
                                    alt={article.title}
                                    sx={{
                                        width: '30%',
                                        height: 'auto',
                                        maxHeight: 200,
                                        objectFit: 'cover',
                                        borderRadius: 1,
                                        flexShrink: 0,
                                    }}
                                />
                            )}
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    height: '100%',
                                    flex: 1,
                                }}
                            >
                                <TitleTypography
                                    gutterBottom
                                    variant="h6"
                                    onClick={() => navigate(`/article/${article.id}`)}
                                    onFocus={() => handleFocus(index)}
                                    onBlur={handleBlur}
                                    tabIndex={0}
                                    className={focusedCardIndex === index ? 'Mui-focused' : ''}
                                >
                                    {article.title}
                                    <NavigateNextRoundedIcon
                                        className="arrow"
                                        sx={{ fontSize: '1rem' }}
                                    />
                                </TitleTypography>
                                <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                                    {article.summary}
                                </StyledTypography>
                                <Typography gutterBottom variant="caption" component="div">
                                    {article.categoryName}
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                ))}
            </Grid>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
                <Pagination
                    page={page}
                    onChange={handlePageChange}
                    count={totalPages}
                    boundaryCount={2}
                />
            </Box>
        </div>
    );
}
