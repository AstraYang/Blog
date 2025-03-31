import { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    TextField,
    Button,
    Grid,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Snackbar,
    Alert, Pagination,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {deleteBook, getBookList, saveBook} from "../../api/books.js";
import {message} from "antd";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: '2px',
                    fontSize: '14px',
                },
                shrink: {
                    top: '-5px',
                },
            },
        },
    },
});

// 书籍管理组件
export default function BookManagement() {
    const [books, setBooks] = useState([]);
    const [newBook, setNewBook] = useState({
        title: '',
        author: '',
        coverImage: '',
        description: '',
        downloadUrl: '',
        categories: ''
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [uploader, setUploader] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const size = 5;
    // 组件首次渲染时获取用户信息和书籍列表
    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo) {
            const userId = parsedUserInfo.id;
            setUploader(userId);
            fetchBookList(currentPage, size, userId); // 获取书籍列表
        }
    }, [currentPage]);

    // 获取书籍列表
    const fetchBookList = async (page, size, uploaderId) => {
        try {
            const response = await getBookList(page, size, uploaderId);
            setTotalPages(response.data.pages);
            const data = response.data.records;
            // 处理分类数据并更新状态
            setBooks(data.map(book => ({ ...book, categories: book.categories.split(',').map(cat => cat.trim()) })));
        } catch (error) {
            console.error("获取书籍列表失败:", error);
            setSnackbarMessage('获取书籍列表失败');
            setSnackbarOpen(true);
        }
    };

    // 处理输入变化
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewBook({ ...newBook, [name]: value });
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    // 添加新书籍
    const handleAddBook = async () => {
        if (!newBook.title || !newBook.author || !newBook.downloadUrl) {
            setSnackbarMessage('请填写标题和作者');
            setSnackbarOpen(true);
            return;
        }

        const bookData = {
            title: newBook.title,
            author: newBook.author,
            uploader: uploader,
            coverImage: newBook.coverImage,
            description: newBook.description,
            downloadUrl: newBook.downloadUrl,
            categories: newBook.categories,
        };

        // 保存书籍的 API 调用
        await saveBook(bookData);
        // 更新书籍列表
        fetchBookList(currentPage, size, uploader); // 获取书籍列表
        setNewBook({ title: '', author: '', coverImage: '', description: '', categories: '', downloadUrl: '' });
        setSnackbarMessage('书籍添加成功');
        setSnackbarOpen(true);
    };

    // 删除书籍
    const handleDeleteBook = async (bId) => {
        try {
            await deleteBook(bId); // 调用删除书籍API
            // 重新获取书籍列表，确保UI更新
            fetchBookList(currentPage, size, uploader);
            message.success('书籍已删除');
        } catch (error) {
            console.error("删除书籍失败:", error);
            message.error('删除书籍失败');
        }
    };


    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    添加书籍
                </Typography>
                <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                    {/*<Typography variant="h4" component="h1" gutterBottom>*/}
                    {/*    添加书籍*/}
                    {/*</Typography>*/}
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="书籍标题"
                                name="title"
                                value={newBook.title}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="作者"
                                name="author"
                                value={newBook.author}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="封面图片 URL"
                                name="coverImage"
                                value={newBook.coverImage}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="简介"
                                name="description"
                                value={newBook.description}
                                onChange={handleInputChange}
                                multiline
                                rows={4}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="下载链接"
                                name="downloadUrl"
                                value={newBook.downloadUrl}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="分类（用逗号分隔）"
                                name="categories"
                                value={newBook.categories}
                                onChange={handleInputChange}
                                sx={{ mb: 2 }}
                            />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleAddBook}
                                sx={{ borderRadius: '8px', mt: 2 }}
                            >
                                添加书籍
                            </Button>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Typography variant="h5" component="h2" gutterBottom>
                                已添加书籍
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {books.length === 0 ? (
                                    <Typography variant="body1">没有书籍记录。</Typography>
                                ) : (
                                    <List>
                                        {books.map((book, index) => (
                                            <ListItem key={index} button>
                                                <ListItemText
                                                    primary={book.title}
                                                    secondary={`作者: ${book.author} | 分类: ${book.categories.join(', ')} | 下载: `}
                                                >
                                                    <a href={book.downloadUrl} target="_blank" rel="noreferrer">点击下载</a>
                                                </ListItemText>
                                                <ListItemSecondaryAction>
                                                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteBook(book.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                )}
                            </Box>
                            <Pagination
                                count={totalPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}
                            />
                        </Grid>
                    </Grid>
                </Paper>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={4000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}
