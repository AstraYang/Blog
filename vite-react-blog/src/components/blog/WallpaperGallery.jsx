import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Tabs,
    Tab,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Pagination,
    CircularProgress,
    Chip,
    Dialog,
    DialogContent,
    IconButton,
    Button,
    Alert,
    Snackbar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';

const WallpaperGallery = () => {
    // 状态管理
    const [categories, setCategories] = useState([]);
    const [wallpapers, setWallpapers] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedWallpaper, setSelectedWallpaper] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const itemsPerPage = 8; // 每页显示8张图片

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    // 获取壁纸分类
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/wallpaper/categories');
                const data = await response.json();
                console.log('获取分类成功:', data);

                if (data.errno === "0" && data.data && data.data.length > 0) {
                    setCategories(data.data);
                    // 默认选择第一个分类
                    setSelectedCategory(data.data[0].id);
                }
            } catch (error) {
                console.error('获取分类失败:', error);
            }
        };

        fetchCategories();
    }, []);

    // 获取壁纸
    useEffect(() => {
        if (!selectedCategory) return;

        const fetchWallpapers = async () => {
            setLoading(true);
            try {
                const start = (page - 1) * itemsPerPage;
                const response = await fetch(
                    `http://localhost:8080/wallpaper/byCategory?cid=${selectedCategory}&start=${start}&count=${itemsPerPage}`
                );
                const data = await response.json();

                if (data.errno === "0") {
                    setWallpapers(data.data || []);
                    // 计算总页数
                    const total = parseInt(data.total, 10);
                    setTotalPages(Math.ceil(total / itemsPerPage));
                }
            } catch (error) {
                console.error('获取壁纸失败:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWallpapers();
    }, [selectedCategory, page]);

    // 处理分类切换
    const handleCategoryChange = (event, newValue) => {
        setSelectedCategory(newValue);
        setPage(1); // 重置页码
    };

    // 处理页码变化
    const handlePageChange = (event, value) => {
        setPage(value);
        // 滚动到页面顶部
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // 处理图片点击 - 确保每次都能触发
    const handleImageClick = (wallpaper) => {
        setSelectedWallpaper(wallpaper);
        setDialogOpen(true);
    };

    // 关闭对话框
    const handleCloseDialog = () => {
        setDialogOpen(false);
    };

    // 下载图片
    const handleDownload = (url, filename) => {
        // 显示下载中提示
        setSnackbarMessage('正在准备下载...');
        setSnackbarSeverity('info');
        setSnackbarOpen(true);

        // 对可能的跨域图片进行处理
        fetch(url, { mode: 'cors' })
            .then(response => {
                if (!response.ok) throw new Error('网络请求失败');
                return response.blob();
            })
            .then(blob => {
                // 创建Blob URL
                const blobUrl = window.URL.createObjectURL(blob);

                // 创建下载链接
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename || 'wallpaper.jpg';
                link.style.display = 'none';

                // 模拟点击下载
                document.body.appendChild(link);
                link.click();

                // 清理并显示成功消息
                setTimeout(() => {
                    document.body.removeChild(link);
                    window.URL.revokeObjectURL(blobUrl);

                    setSnackbarMessage('壁纸下载成功');
                    setSnackbarSeverity('success');
                    setSnackbarOpen(true);
                }, 100);
            })
            .catch(error => {
                console.error('下载图片失败:', error);

                // 尝试使用window.open方式下载
                try {
                    const newWindow = window.open(url, '_blank');
                    if (newWindow) {
                        setSnackbarMessage('请在新窗口中右键保存图片');
                        setSnackbarSeverity('info');
                    } else {
                        throw new Error('无法打开新窗口');
                    }
                } catch (e) {
                    setSnackbarMessage('下载失败，请右键图片选择"图片另存为"');
                    setSnackbarSeverity('error');
                }

                setSnackbarOpen(true);
            });
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    return (
        <Container maxWidth="lg" sx={{ my: 1 }}>

            {/* 分类区域 */}
            <Box sx={{
                mb: 1,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                p: 2,
                backgroundColor: '#fff'
            }}>

                {categories.length > 0 ? (
                    <Tabs
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            '& .MuiTabs-flexContainer': { flexWrap: 'wrap' },
                            '& .MuiTabs-indicator': {
                                // 关键修改: 完全隐藏底部指示条
                                display: 'none'
                            },
                            '& .Mui-selected': {
                                borderBottom: 'none',
                            },
                            '& .MuiTab-root:before': {
                                content: '""',
                                display: 'none',
                            },
                        }}
                    >
                        {categories.map((category) => (
                            <Tab
                                key={category.id}
                                label={
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        {category.name}
                                        <Chip
                                            label={category.totalcnt}
                                            size="small"
                                            sx={{ fontSize: '0.7rem' }}
                                        />
                                    </Box>
                                }
                                value={category.id}
                                sx={{
                                    minWidth: 100,
                                    '&.Mui-selected': {
                                        backgroundColor: 'rgba(196,168,255,0.45)', // 选中的背景色
                                        color: '#000',
                                        borderBottom: 'none' // 确保没有底部边框
                                    }
                                }}
                            />
                        ))}
                    </Tabs>
                ) : (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                        <CircularProgress size={24} />
                    </Box>
                )}
            </Box>

            {/* 壁纸展示区域 - 固定高度 */}
            <Box sx={{
                mb: 1,
                borderRadius: 2,
                boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
                p: 1,
                backgroundColor: '#fff',
                height: '490px', // 固定高度
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}>
                {loading ? (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%' // 加载指示器居中
                    }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box sx={{
                        overflowY: 'auto', // 允许内容滚动
                        flexGrow: 1, // 占满剩余空间
                        height: '100%' // 填充容器高度
                    }}>
                        <Grid container spacing={2}>
                            {wallpapers.map((wallpaper) => (
                                <Grid item xs={12} sm={6} md={3} key={wallpaper.pid}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            transition: 'transform 0.3s',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                transform: 'translateY(-5px)',
                                                boxShadow: '0 12px 20px rgba(0,0,0,0.1)'
                                            }
                                        }}
                                        onClick={() => handleImageClick(wallpaper)}
                                    >
                                        <Box sx={{
                                            position: 'relative',
                                            paddingTop: '75%', // 4:3 比例的容器
                                            width: '100%',
                                            overflow: 'hidden'
                                        }}>
                                            <CardMedia
                                                component="img"
                                                image={wallpaper.url}
                                                alt="壁纸"
                                                sx={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'contain', // 保证完整显示图片
                                                    backgroundColor: '#f5f5f5' // 背景色，让图片更容易看清
                                                }}
                                            />
                                        </Box>
                                        <CardContent sx={{ p: 1, textAlign: 'center' }}>
                                            <Typography variant="caption" color="text.secondary">
                                                ❤️ {wallpaper.fav_total}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        {wallpapers.length === 0 && !loading && (
                            <Box sx={{
                                textAlign: 'center',
                                py: 4,
                                height: '100%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Typography>暂无壁纸数据</Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>

            {/* 图片查看对话框 */}
            <Dialog
                open={dialogOpen}
                onClose={handleCloseDialog}
                maxWidth="lg"
                fullWidth
                TransitionProps={{
                    onExited: () => {
                        // 确保对话框完全关闭后重置选中的壁纸
                        setSelectedWallpaper(null);
                    }
                }}
            >
                <DialogContent sx={{ position: 'relative', p: 0, overflow: 'hidden' }}>
                    {selectedWallpaper && (
                        <>
                            <IconButton
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    backgroundColor: 'rgba(0,0,0,0.5)',
                                    color: 'white',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.7)',
                                    }
                                }}
                                onClick={handleCloseDialog}
                            >
                                <CloseIcon />
                            </IconButton>

                            <Box
                                component="img"
                                src={selectedWallpaper.url}
                                alt={selectedWallpaper.title || '壁纸'}
                                sx={{
                                    width: '100%',
                                    maxHeight: '80vh',
                                    objectFit: 'contain',
                                }}
                            />

                            <Box sx={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                p: 2,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="body1" color="white">
                                    {selectedWallpaper.title || '壁纸'}
                                    {selectedWallpaper.resolution && ` (${selectedWallpaper.resolution})`}
                                </Typography>

                                <Button
                                    variant="outlined"
                                    startIcon={<DownloadIcon />}
                                    onClick={() => handleDownload(selectedWallpaper.url, `wallpaper_${selectedWallpaper.pid}.jpg`)}
                                >
                                    下载壁纸
                                </Button>
                            </Box>
                        </>
                    )}
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            {/* 分页控件 */}
            {totalPages > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}
        </Container>
    );
};

export default WallpaperGallery;
