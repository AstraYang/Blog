import { useState, useEffect } from 'react';
import {
    Box,
    Button,
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
    Avatar,
    Grid,
    useMediaQuery,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from '@mui/material';
import { deleteComments, fetchComments } from '../../../api/comments.js'; // 请确保这些 API 正确
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme();
function timeAgo(date) {
    const now = new Date();
    const createdAt = new Date(date);
    const secondsPast = Math.floor((now - createdAt) / 1000);

    // 小于一分钟
    if (secondsPast < 60) {
        return `${secondsPast} 秒前`;
    }
    // 小于一小时
    if (secondsPast < 3600) {
        return `${Math.floor(secondsPast / 60)} 分钟前`;
    }
    // 小于一天
    if (secondsPast < 86400) {
        return `${Math.floor(secondsPast / 3600)} 小时前`;
    }

    // 计算天数和完整的日期差
    const daysPast = Math.floor(secondsPast / 86400);
    const yearsPast = new Date(now - createdAt).getFullYear() - 1970; // 计算年份差
    const monthsPast = new Date(now - createdAt).getMonth(); // 计算月份差

    if (yearsPast > 0) {
        return `${yearsPast} 年前`;
    }
    if (monthsPast > 0) {
        return `${monthsPast} 月前`;
    }
    return `${daysPast} 天前`;
}


export default function CommentList() {
    const [data, setData] = useState([]); // 评论数据
    const [selectedIds, setSelectedIds] = useState([]); // 选中项
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [openDialog, setOpenDialog] = useState(false); // 控制删除确认对话框的状态
    const [errorMessage, setErrorMessage] = useState(""); // 用于存储错误信息
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // 判断是否为手机端

    // 从后端获取评论列表
    const loadComments = async (page) => {
        try {
            const comments = await fetchComments(page, 5);
            setData(comments.data.records); // 更新评论列表
            setTotalPages(comments.data.pages);
        } catch (error) {
            console.error('Failed to fetch comments', error);
        }
    };

    // 初始化加载
    useEffect(() => {
        loadComments(currentPage);
    }, [currentPage]);

    // 处理选中事件
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // 删除选中的评论
    const handleDelete = async () => {
        try {
            await deleteComments(selectedIds); // 调用后端 API 删除评论
            // 更新状态，直接从当前数据中删除选中的项
            setData((prevData) => prevData.filter(comment => !selectedIds.includes(comment.id)));
            setSelectedIds([]);
            setOpenDialog(false); // 关闭确认对话框
        } catch (error) {
            setErrorMessage('删除评论失败，请稍后再试。'); // 设置错误信息
            console.error('Failed to delete comments', error);
        }
    };

    const handleOpenDialog = () => {
        setOpenDialog(true); // 打开确认对话框
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // 关闭确认对话框
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
                    评论管理
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                {/* 操作按钮容器 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleOpenDialog} // 打开确认对话框
                        disabled={selectedIds.length === 0} // 如果没有选中项，禁用按钮
                    >
                        删除选中
                    </Button>
                </Box>

                {/* 删除确认对话框 */}
                <Dialog open={openDialog} onClose={handleCloseDialog}>
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            您确定要删除选中的评论吗？此操作无法撤销。
                        </DialogContentText>
                        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} color="primary">
                            取消
                        </Button>
                        <Button onClick={handleDelete} color="error">
                            删除
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 列表显示 */}
                {isMobile ? (
                    // 手机端显示评论列表的代码
                    <Grid container spacing={2}>
                        {data.map((comment) => (
                            <Grid item xs={12} key={comment.id}>
                                <Box sx={{ border: '1px solid #ccc', borderRadius: '8px', p: 2, mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar src={comment.avatarUrl} alt={comment.username} sx={{ mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6">{comment.username}</Typography>
                                            <Typography variant="body2">{comment.email}</Typography>
                                        </Box>
                                        <Checkbox
                                            checked={selectedIds.includes(comment.id)}
                                            onChange={() => handleSelect(comment.id)}
                                            sx={{ marginLeft: 'auto' }}
                                        />
                                    </Box>
                                    <Typography variant="body1" sx={{ ml: 7 }}>
                                        {/* 时间显示等 */}
                                        {timeAgo(comment.createdAt)} 于 <a href={`/article/${comment.articlesId}`} style={{ color: '#00BFFF', textDecoration: 'none' }}>
                                        {comment.articlesTitle}
                                    </a>
                                    </Typography>
                                    <Typography variant="body2">{comment.content}</Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    // PC端显示评论列表的代码
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox
                                            indeterminate={selectedIds.length > 0 && selectedIds.length < data.length}
                                            checked={data.length > 0 && selectedIds.length === data.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(data.map((item) => item.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>用户</TableCell>
                                    <TableCell>内容</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((comment) => (
                                    <TableRow key={comment.id} selected={selectedIds.includes(comment.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={selectedIds.includes(comment.id)}
                                                onChange={() => handleSelect(comment.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar src={comment.avatarUrl} alt={comment.username} sx={{ mr: 2 }} />
                                                <Box>
                                                    <Typography variant="body1">{comment.username}</Typography>
                                                    <Typography variant="body2">
                                                        {comment.email}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                                <Typography variant="body1">
                                                    {timeAgo(comment.createdAt)} 于
                                                    <a href={`/article/${comment.articlesId}`} style={{ color: '#00BFFF', textDecoration: 'none', fontWeight: 'bold' }}>
                                                        {comment.articlesTitle}
                                                    </a>
                                                </Typography>
                                                <Typography variant="body2">
                                                    {comment.content}
                                                </Typography>
                                            </Box>
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
