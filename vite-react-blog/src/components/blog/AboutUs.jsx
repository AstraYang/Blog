import { Container, Typography, Box, Paper, Grid, Divider, useTheme } from '@mui/material';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import MapIcon from '@mui/icons-material/Map';
import StorageIcon from '@mui/icons-material/Storage';

const AboutUs = () => {
    const theme = useTheme();

    return (
        <Container maxWidth="lg" sx={{ py: 5 }}>
            <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                <Typography variant="h3" component="h1" align="center" gutterBottom sx={{
                    fontWeight: 'bold',
                    color: theme.palette.primary.main,
                    mb: 4
                }}>
                    关于知识地图博客平台
                </Typography>

                <Box sx={{ mb: 5 }}>
                    <Typography variant="body1" paragraph>
                        知识地图博客平台致力于创建一个有创新点的学习分享博客系统，通过创新的知识可视化方式，帮助用户构建系统化的知识体系，实现高效学习与知识分享。我相信，知识不仅仅是孤立的信息点，而是相互关联的有机整体。
                    </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={4} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <MapIcon sx={{ mr: 2, fontSize: 30, color: theme.palette.primary.main }} />
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    知识图谱可视化
                                </Typography>
                                <Typography variant="body2">
                                    突破传统博客平台局限，创新性地引入知识地图功能，将零散的知识点通过图形化方式直观展示。这使学习者能够清晰把握知识脉络，形成完整的知识体系，实现从点到面的学习跃升。
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <CodeIcon sx={{ mr: 2, fontSize: 30, color: theme.palette.primary.main }} />
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    现代技术栈
                                </Typography>
                                <Typography variant="body2">
                                    采用前后端分离架构，前端基于React和Material UI构建流畅用户界面，后端使用Spring Boot提供强大支持，通过Docker实现一键部署，确保系统高效稳定运行。
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <SchoolIcon sx={{ mr: 2, fontSize: 30, color: theme.palette.primary.main }} />
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    学习效率提升
                                </Typography>
                                <Typography variant="body2">
                                    通过Markdown编辑器，用户可以轻松创建高质量内容；而知识点关联功能帮助构建个人知识网络，使学习者能够在知识海洋中找到明确方向，提高学习效率。
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <StorageIcon sx={{ mr: 2, fontSize: 30, color: theme.palette.primary.main }} />
                            <Box>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                    系统化知识管理
                                </Typography>
                                <Typography variant="body2">
                                    本平台不只是内容发布工具，更是个人知识管理系统。用户可以创建、组织和关联知识点，形成个性化知识库，实现知识的积累与成长。
                                </Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5, pt: 3, borderTop: `1px solid ${theme.palette.divider}` }}>
                    <Typography variant="body2" align="center" color="textSecondary">
                        知识图谱博客平台 © {new Date().getFullYear()} | 为系统化学习与知识分享而生 &bull; 毕设项目
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default AboutUs;
