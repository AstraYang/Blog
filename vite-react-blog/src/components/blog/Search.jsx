import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
    Box, List, ListItem, ListItemText, CircularProgress, Button,
    Typography, Paper, Popper, Grow, ClickAwayListener
} from "@mui/material";
import { fetchArticlesByKeyword } from "../../api/articles.js";

// 最小搜索字符数
const MIN_SEARCH_LENGTH = 2;

export function Search() {
    const [keyword, setKeyword] = useState("");
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    // 引用搜索框和弹出结果容器
    const searchRef = useRef(null);
    const keywordRef = useRef(keyword);
    keywordRef.current = keyword;

    // 执行搜索的函数
    const executeSearch = async (searchKeyword) => {
        if (!searchKeyword || searchKeyword.trim().length < MIN_SEARCH_LENGTH) {
            setArticles([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        try {
            console.log('Search keyword:', searchKeyword);
            const result = await fetchArticlesByKeyword(0, 10, searchKeyword);

            if (result.data && Array.isArray(result.data.records)) {
                setArticles(result.data.records);
                setOpen(true); // 显示搜索结果弹出框
            } else {
                console.error('Unexpected response format:', result);
                setArticles([]);
                // 即使没有结果也显示弹出框
                setOpen(true);
            }
        } catch (error) {
            console.error('Error searching articles:', error);
            setArticles([]);
            setOpen(true); // 显示无结果的弹出框
        } finally {
            setLoading(false);
        }
    };

    // 自动搜索模式的 useEffect
    useEffect(() => {
        if (keyword.trim().length >= MIN_SEARCH_LENGTH) {
            const delayDebounceFn = setTimeout(() => {
                executeSearch(keyword);
            }, 500);

            return () => clearTimeout(delayDebounceFn);
        } else {
            // 关键字太短，清空文章列表并关闭弹出框
            setArticles([]);
            setOpen(false);
        }
    }, [keyword]);

    // 处理按下回车键
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            executeSearch(keyword);
        }
    };

    // 处理点击外部关闭弹出框
    const handleClickAway = () => {
        setOpen(false);
    };

    // 清空搜索框和结果
    const clearSearch = () => {
        setKeyword("");
        setArticles([]);
        setOpen(false);
    };

    return (
        <Box position="relative">
            <ClickAwayListener onClickAway={handleClickAway}>
                <Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Box display="flex" alignItems="center" gap={1} ref={searchRef}>
                            <FormControl sx={{ width: { xs: '100%', md: '45ch' } }} variant="outlined">
                                <OutlinedInput
                                    size="small"
                                    id="search"
                                    placeholder="Search…"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    sx={{ flexGrow: 1 }}
                                    startAdornment={
                                        <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                                            <SearchRoundedIcon fontSize="small" />
                                        </InputAdornment>
                                    }
                                    inputProps={{
                                        'aria-label': 'search',
                                    }}
                                />
                            </FormControl>
                        </Box>

                        {/* 最小字符提示 */}
                        {keyword.trim().length > 0 && keyword.trim().length < MIN_SEARCH_LENGTH && (
                            <Typography variant="caption" color="text.secondary">
                                请至少输入 {MIN_SEARCH_LENGTH} 个字符以开始搜索
                            </Typography>
                        )}
                    </Box>

                    {/* 悬浮式搜索结果 */}
                    <Popper
                        open={open && keyword.trim().length >= MIN_SEARCH_LENGTH}
                        anchorEl={searchRef.current}
                        placement="bottom-start"
                        transition
                        style={{ zIndex: 1300, width: searchRef.current ? searchRef.current.clientWidth : 'auto', maxWidth: '500px' }}
                    >
                        {({ TransitionProps }) => (
                            <Grow {...TransitionProps} timeout={200}>
                                <Paper elevation={3} sx={{ mt: 1, maxHeight: '400px', overflow: 'auto' }}>
                                    {/* 显示加载状态 */}
                                    {loading && (
                                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                            <CircularProgress size={24} />
                                        </Box>
                                    )}

                                    {/* 搜索结果列表 */}
                                    <List dense>
                                        {Array.isArray(articles) && articles.length > 0 ? (
                                            articles.map((article) => (
                                                <ListItem key={article.id} divider>
                                                    <ListItemText
                                                        primary={
                                                            <Link to={`/article/${article.id}`} style={{ textDecoration: 'none', color: 'revert' }}>
                                                                <Typography variant="subtitle2">{article.title}</Typography>
                                                            </Link>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="text.secondary" sx={{
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                display: '-webkit-box',
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: 'vertical',
                                                            }}>
                                                                {article.summary}
                                                            </Typography>
                                                        }
                                                    />
                                                </ListItem>
                                            ))
                                        ) : !loading && (
                                            <ListItem>
                                                <ListItemText primary="没有找到相关的文章" />
                                            </ListItem>
                                        )}
                                    </List>

                                    {/* 底部操作栏 */}
                                    {articles.length > 0 && (
                                        <Box sx={{ p: 1, borderTop: '1px solid rgba(0, 0, 0, 0.12)', display: 'flex', justifyContent: 'flex-end' }}>
                                            <Button size="small" onClick={clearSearch}>
                                                清除搜索
                                            </Button>
                                        </Box>
                                    )}
                                </Paper>
                            </Grow>
                        )}
                    </Popper>
                </Box>
            </ClickAwayListener>
        </Box>
    );
}
