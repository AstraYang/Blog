import { useState } from 'react';
import {
    Container,
    Grid,
    Typography,
    Paper,
    Button,
    Card,
    CardMedia,
    Chip,
    Divider,
    Box,
    Skeleton,
    Snackbar,
    Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';

// 示例书籍数据
const bookData = {
    id: '1',
    title: '电子学',
    author: ' Paul Horowitz / Winfield Hill',
    coverImage: 'https://image.struct.fun/i/2025/03/20/024232.png',
    description: `《电子学(第2版)》是哈佛大学的经典教材，自出版以来已被译成多种语言版本。《电子学(第2版)》通过强调电子电路系统设计者所需的实用方法，即对电路的基本原理、经验准则以及大量实用电路设计技巧的全面总结，侧重探讨了电子学及其电路的设计原理与应用。它不仅涵盖了电子学通常研究的全部知识点，还补充了有关数字电子学中的大量较新应用及设计方面的要点内容。对高频放大器、射频通信调制电路设计、低功耗设计、带宽压缩以及信号的测量与处理等重要电路设计以及电子电路制作工艺设计方面的难点也做了通俗易懂的阐述。《电子学(第2版)》包含丰富的电子电路分析设计实例和大量图表资料，内容全面且阐述透彻，是一本世界范围内公认的电子学电路分析、设计及其应用的优秀教材。

《电子学(第2版)》可作为电气、电子、通信、计算机与自动化类等专业本科生的专业基课程教材或参考书。对于从事电子工程、通信及微电子等方面电路设计的工程技术人员，也是一本具有较高参考价值的好书。`,
    categories: ['电子信息', '电路设计', '通信'],
};

function BookDetail() {
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleDownload = () => {
        setLoading(true);

        // 模拟下载操作
        setTimeout(() => {
            setLoading(false);
            setSnackbarMessage(`开始下载《${bookData.title}》`);
            setSnackbarOpen(true);
        }, 1500);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };


    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        setSnackbarMessage('链接已复制到剪贴板');
        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
                <Grid container spacing={4}>
                    {/* 左侧封面和操作区 */}
                    <Grid item xs={12} md={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Card elevation={5} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                                {loading ? (
                                    <Skeleton variant="rectangular" height={400} animation="wave" />
                                ) : (
                                    <CardMedia
                                        component="img"
                                        image={bookData.coverImage}
                                        alt={bookData.title}
                                        sx={{
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                )}
                            </Card>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        fullWidth
                                        startIcon={<DownloadIcon />}
                                        onClick={() => handleDownload()}
                                        disabled={loading}
                                        sx={{
                                            borderRadius: '8px',
                                            py: 1.5,
                                            fontWeight: 'bold',
                                            boxShadow: 2
                                        }}
                                    >
                                        下载
                                    </Button>

                                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<ShareIcon />}
                                        onClick={handleShare}
                                        sx={{ flex: 1, borderRadius: '8px' }}
                                    >
                                        分享
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* 右侧书籍信息区 */}
                    <Grid item xs={12} md={8}>
                        <Typography
                            variant="h3"
                            component="h1"
                            gutterBottom
                            sx={{
                                fontWeight: 'bold',
                                mb: 1
                            }}
                        >
                            {bookData.title}
                        </Typography>

                        <Typography
                            variant="h5"
                            color="text.secondary"
                            sx={{ mb: 3 }}
                        >
                            {bookData.author}
                        </Typography>

                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                            {bookData.categories.map(category => (
                                <Chip
                                    key={category}
                                    label={category}
                                    color="primary"
                                    variant="outlined"
                                    sx={{ borderRadius: '6px' }}
                                />
                            ))}
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                            简介
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Typography
                            variant="body1"
                            component="div"
                            sx={{
                                lineHeight: 1.8,
                                color: 'text.primary',
                                whiteSpace: 'pre-line'
                            }}
                        >
                            {bookData.description}
                        </Typography>
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
    );
}

export default BookDetail;
