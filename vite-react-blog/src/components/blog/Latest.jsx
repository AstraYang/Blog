import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import IconButton from "@mui/material/IconButton";
import RssFeedRoundedIcon from "@mui/icons-material/RssFeedRounded";
import {Search} from "./MainContent.jsx";
import Chip from "@mui/material/Chip";
import {fetchArticles} from "../../api/articles";
import {fetchCategories} from "../../api/category";
import {useEffect, useState} from "react";

const articleInfo = [
  {
    image:'https://picsum.photos/800/450?random=1',
    categoryName: 'Engineering',
    title: 'The future of AI in software engineering',
    description:
      'Artificial intelligence is revolutionizing software engineering. Explore how AI-driven tools are enhancing development processes and improving software quality.'
  },
  {
    image:'https://picsum.photos/800/450?random=2',
    categoryName: 'Product',
    title: 'Driving growth with user-centric product design',
    description:
      'Our user-centric product design approach is driving significant growth. Learn about the strategies we employ to create products that resonate with users.'
  },
  {
    image:'https://picsum.photos/800/450?random=3',
    categoryName: 'Design',
    title: 'Embracing minimalism in modern design',
    description:
      'Minimalism is a key trend in modern design. Discover how our design team incorporates minimalist principles to create clean and impactful user experiences.'
  },
  {
    image:'https://picsum.photos/800/450?random=4',
    categoryName: 'Company',
    title: 'Cultivating a culture of innovation',
    description:
      'Innovation is at the heart of our company culture. Learn about the initiatives we have in place to foster creativity and drive groundbreaking solutions.'
  },
];

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
  const [categories, setCategories] = useState([]);           //分类列表
  const [articles, setArticles] = useState([]);                             // 文章列表
  const [selectedCategory, setSelectedCategory] = useState(null); // 当前选择的分类ID
  const [page, setPage] = useState(1); // 当前页码
  const [focusedCardIndex, setFocusedCardIndex] = useState(null); //



  const handleFocus = (index) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };
  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

    useEffect(() => {
        async function loadCategories() {
            try {
                const response = await fetchCategories();
                console.log('Fetched categories:', response); // 调试信息
                if (response && response.data && Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    console.error('Expected an array in the response data, but received:', typeof response.data);
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
                const response = await fetchArticles(page, 4, selectedCategory); // 每页显示4个
                console.log('文章列表api请求返回数据:', response); // 调试完整的响应数据

                // 确保数据存在并正确解析
                if (response && response.data && Array.isArray(response.data.records)) {
                    setArticles(response.data.records); // 设置文章数据
                    console.log('文章列表数据:',articles );
                } else {
                    console.warn('Unexpected response structure:', response);
                    setArticles([]); // 如果数据结构异常，设置为空数组
                }
            } catch (error) {
                console.error('Error fetching articles:', error); // 捕获并打印错误
                setArticles([]); // 遇到错误时，也设置为空数组以避免页面崩溃
            }
        }

        loadArticles(); // 加载文章数据
    }, [page, selectedCategory]); // 依赖于分页和分类的变化
    // 测试，更新数据
    useEffect(() => {
        console.log('文章列表数据（更新后的状态）:', articles);
    }, [articles]); // 当 articles 状态变化时触发


    // 分类切换
    const handleCategoryClick = (categoryId) => {
        setSelectedCategory(categoryId); // 更新所选分类
        console.log(selectedCategory)
        setPage(1); // 切换分类时回到第一页
    };



  return (
    <div>
      <Typography variant="h1" gutterBottom>
        Wisterain
      </Typography>
      <Typography>多读书 多看报 少吃零食 多睡觉</Typography>
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
            {categories.map((categories) => (
                <Chip
                    onClick={() => handleCategoryClick(categories.id)}
                    key={categories.id}
                    label={categories.categoryName}
                    size="medium"
                    sx={{
                        backgroundColor: selectedCategory === categories.id ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                        border: selectedCategory === categories.id ? '1px solid rgba(0, 123, 255, 0.5)' : 'none',
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
        {articles.map((articles, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 1,
                height: '100%',
              }}
            >
              {/* 图片显示区域 */}
              {articles.image && (
                  <Box
                      component="img"
                      src={articles.image} // 确保数据中的 `image` 字段正确提供图片路径
                      alt={articles.title} // 使用文章的标题作为图片的描述
                      sx={{
                        width: '100%',
                        height: 'auto', // 保证图片宽度自适应容器
                        maxHeight: 200, // 给图片一个最大高度，防止图片过大
                        objectFit: 'cover', // 确保图片比例正确
                        borderRadius: 1, // 添加一些圆角
                      }}
                  />
              )}
              <TitleTypography
                gutterBottom
                variant="h6"
                onFocus={() => handleFocus(index)}
                onBlur={handleBlur}
                tabIndex={0}
                className={focusedCardIndex === index ? 'Mui-focused' : ''}
              >
                {articles.title}
                <NavigateNextRoundedIcon
                  className="arrow"
                  sx={{ fontSize: '1rem' }}
                />
              </TitleTypography>
              <StyledTypography variant="body2" color="text.secondary" gutterBottom>
                {articles.description}
              </StyledTypography>
              <Typography gutterBottom variant="caption" component="div">
                {articles.categoryName}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 4 }}>
        <Pagination hidePrevButton hideNextButton count={10} boundaryCount={10} />
      </Box>
    </div>
  );
}
