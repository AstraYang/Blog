import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // 导入 Link 组件
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
} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deleteArticlesSoft, fetchArticleManagementList } from "../api/articles";
import { getCurrentUser } from "../api/User.js";

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
    const [data, setData] = useState([]); // API 数据
    const [selectedIds, setSelectedIds] = useState([]); // 选中项
    const [filter, setFilter] = useState(0); // 过滤状态 - 所有或我的
    const [user, setUser] = useState(0); // 当前用户 ID
    const [publishState, setPublishState] = useState(true); // 发布状态
    const [currentPage, setCurrentPage] = useState(1); // 当前页
    const [totalPages, setTotalPages] = useState(1); // 总页数
    const articlesPerPage = 7; // 每页显示的文章数

    // 获取文章数据
    const loadArticles = async (page) => {
        try {
            const result = await fetchArticleManagementList(page, articlesPerPage, filter, publishState);
            if (result.code === 200) {
                setData(result.data.records); // 设置文章数据
                setTotalPages(result.data.pages); // 设置总页数
            } else {
                console.error('获取文章失败', result.message);
            }
        } catch (error) {
            console.error('请求出错', error);
        }
    };

    const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser.id); // 设置当前用户 ID
    };

    useEffect(() => {
        fetchUser();
        loadArticles(currentPage); // 初始化时加载文章数据
    }, [currentPage, filter, publishState]); // 依赖项变更时重新加载数据

    // 处理选中事件
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    // 检查是否选中
    const isSelected = (id) => selectedIds.includes(id);

    // 删除选中文章
    const handleDelete = async () => {
        try {
            await deleteArticlesSoft(selectedIds, true); // 删除选中的文章
            const updatedData = data.filter(article => !selectedIds.includes(article.id));
            setData(updatedData); // 更新文章列表
            setSelectedIds([]); // 清空选中
        } catch (error) {
            console.error('删除文章失败', error);
        }
    };

    // 切换过滤状态
    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setFilter(newFilter); // 直接设置过滤器
        }
    };

    // 切换发布状态
    const handlePublishStateChange = (event, newPublishState) => {
        if (newPublishState !== null) {
            setPublishState(newPublishState === 'published'); // 处理发布状态为布尔值
        }
    };

    // 切换文章的发布状态
    const togglePublishStatus = (id) => {
        const updatedData = data.map(article =>
            article.id === id ? { ...article, status: !article.status } : article
        );
        setData(updatedData);
    };

    // 直接展示数据，无需额外过滤
    const filteredData = data; // 如果后端已处理好数据，则直接使用

    // 切换页码
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
                <Typography variant="h5" gutterBottom sx={{mt: 7}}>
                    文章管理
                </Typography>
                <Divider sx={{ my: 1.5 }} /> {/* 水平分割线 */}

                {/* 操作按钮容器 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={selectedIds.length === 0} // 禁用条件
                        sx={{ maxHeight: '40px' }} // 设置按钮高度
                    >
                        删除选中项
                    </Button>
                    <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                        <ToggleButtonGroup
                            value={filter}
                            exclusive
                            onChange={handleFilterChange}
                            sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', maxHeight: '40px' }} // 设置最小高度
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
                            sx={{ borderRadius: '4px', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', maxHeight: '40px' }} // 设置最小高度
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

                {/* 表格 */}
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
                                    <TableCell align="center">{row.createAt || '未更新'}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant={row.status ? 'contained' : 'outlined'}
                                            color={row.status ? 'success' : 'error'}
                                            onClick={() => togglePublishStatus(row.id)}
                                        >
                                            {row.status ? '已发布' : '未发布'}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* 分页组件 */}
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
