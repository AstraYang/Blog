import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Divider,
    ToggleButton,
    ToggleButtonGroup,
    Button,
    Pagination,
    useMediaQuery,
} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {deleteArticlesSoft, fetchArticleManagementList, setArticlePublishStatus} from "../../../api/articles.js";
//import { getCurrentUser } from "../../../api/User.js";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "2px",
                    fontSize: "14px",
                },
                shrink: {
                    top: "-5px",
                },
            },
        },
    },
});

export default function ArticleList() {
    const [data, setData] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [filter, setFilter] = useState(0);
    const [user, setUser] = useState(0);
    const [publishState, setPublishState] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const articlesPerPage = 7;

    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 检测是否为手机端

    const loadArticles = async (page) => {
        try {
            const result = await fetchArticleManagementList(page, articlesPerPage, filter, publishState);
            if (result.code === 200) {
                setData(result.data.records);
                setTotalPages(result.data.pages);
            } else {
                console.error('获取文章失败', result.message);
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const fetchUser = async () => {
        const currentUser = localStorage.getItem('userInfo');
        setUser(JSON.parse(currentUser).id);
    };

    useEffect(() => {
        fetchUser();
        loadArticles(currentPage);
    }, [currentPage, filter, publishState]);

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const isSelected = (id) => selectedIds.includes(id);

    const handleDelete = async () => {
        try {
            await deleteArticlesSoft(selectedIds, true);
            const updatedData = data.filter(article => !selectedIds.includes(article.id));
            setData(updatedData);
            setSelectedIds([]);
        } catch (error) {
            console.error('删除文章失败', error);
        }
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter);
        }
    };

    const handlePublishStateChange = (event, newPublishState) => {
        if (newPublishState !== null) {
            setPublishState(newPublishState === 'published');
        }
    };

    const togglePublishStatus = async (id, status) => {
        console.log('togglePublishStatus', id, !status)
        const articleStatus = {
            articleId:id,
            status: !status,
        }
        const setStatus = await setArticlePublishStatus(articleStatus);
        console.log('setArticlePublishStatus', setStatus)
        if (setStatus.code !== 200) {
            console.error('设置文章发布状态失败', setStatus.message);
        }

        const updatedData = data.map(article =>
            article.id === id ? { ...article, status: !article.status } : article
        );

        setData(updatedData);
    };

    const filteredData = data;

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: { xs: '100%', sm: '80%', md: '70%' },
                    maxWidth: '1200px',
                    mx: 'auto',
                    mt: 4,
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ mt: 7 }}>
                    文章管理
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0}
                        sx={{ maxHeight: '40px' }}
                    >
                        删除选中项
                    </Button>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <ToggleButtonGroup
                            value={filter}
                            exclusive
                            onChange={handleFilterChange}
                            sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', maxHeight: '40px' }}
                        >
                            <ToggleButton value={0} sx={{ flex: 1, fontSize: '14px' }}>
                                所有
                            </ToggleButton>
                            <ToggleButton value={user} sx={{ flex: 1, fontSize: '14px' }}>
                                我的
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    <Box sx={{ mx: 2 }}>
                        <ToggleButtonGroup
                            value={publishState ? 'published' : 'unpublished'}
                            exclusive
                            onChange={handlePublishStateChange}
                            sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', maxHeight: '40px' }}
                        >
                            <ToggleButton value="published" sx={{ flex: 1, fontSize: '14px' }}>
                                发布
                            </ToggleButton>
                            <ToggleButton value="unpublished" sx={{ flex: 1, fontSize: '14px' }}>
                                草稿
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>

                {/* 根据屏幕大小选择表格或卡片展示 */}
                {isMobile ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {filteredData.map((row) => (
                            <Paper key={row.id} sx={{ padding: 2, borderRadius: 2, boxShadow: 2 }}>
                                <Box
                                    sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                >
                                    <Typography variant="h6" component={Link} to={`/admin/article/${row.id}`} sx={{ textDecoration: 'none', color: '#027cb5' }}>
                                        {row.title}
                                    </Typography>
                                    <Checkbox
                                        checked={isSelected(row.id)}
                                        onChange={() => handleSelect(row.id)}
                                    />
                                </Box>
                                <Typography variant="body2">作者: {row.authorName}</Typography>
                                <Typography variant="body2">分类: {row.categoryName}</Typography>
                                <Typography variant="body2">更新日期: {new Date(row.createdAt).toLocaleDateString() || '未更新'}</Typography>
                                <Button
                                    variant={row.status ? 'contained' : 'outlined'}
                                    color={row.status ? 'success' : 'error'}
                                    onClick={() => togglePublishStatus(row.id, row.status)}
                                    sx={{ mt: 1 }}
                                >
                                    {row.status ? '已发布' : '未发布'}
                                </Button>
                            </Paper>
                        ))}
                    </Box>
                ) : (
                    <TableContainer
                        component={Paper}
                        sx={{
                            mb: 2,
                            borderRadius: '8px',
                            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                            overflow: 'hidden',
                        }}
                    >
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox" align="center">
                                        <Checkbox
                                            indeterminate={
                                                selectedIds.length > 0 && selectedIds.length < filteredData.length
                                            }
                                            checked={filteredData.length > 0 && selectedIds.length === filteredData.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(filteredData.map((item) => item.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">文章名</TableCell>
                                    <TableCell align="center">作者</TableCell>
                                    <TableCell align="center">分类</TableCell>
                                    <TableCell align="center">更新日期</TableCell>
                                    <TableCell align="center">发布状态</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredData.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        selected={isSelected(row.id)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell padding="checkbox" align="center">
                                            <Checkbox
                                                checked={isSelected(row.id)}
                                                onChange={() => handleSelect(row.id)}
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Link to={`/admin/article/${row.id}`} style={{ textDecoration: 'none', color: '#027cb5' }}>
                                                {row.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="center">{row.authorName}</TableCell>
                                        <TableCell align="center">{row.categoryName}</TableCell>
                                        <TableCell align="center">{new Date(row.createdAt).toLocaleString() || '未更新'}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant={row.status ? 'contained' : 'outlined'}
                                                color={row.status ? 'success' : 'error'}
                                                onClick={() => togglePublishStatus(row.id, row.status)}
                                            >
                                                {row.status ? '已发布' : '未发布'}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}
                />
            </Box>
        </ThemeProvider>
    );
}
