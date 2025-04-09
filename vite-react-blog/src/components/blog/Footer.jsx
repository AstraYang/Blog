import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub'; // 注意这里是 GitHubIcon
import { fetchSettings } from "../../api/menuStorage.js";

function Copyright() {
    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            {'Copyright © '}
            <Link color="text.secondary" href="https://blog.struct.fun/">
                AstraYang
            </Link>
            &nbsp;{new Date().getFullYear()}
        </Typography>
    );
}

// 添加站点运行时长组件
function SiteRuntime() {
    const [runtime, setRuntime] = React.useState('');
    React.useEffect(() => {
        const loadSettings = async () => {
            const fetchedSettings = await fetchSettings();

            // 确保在获取到设置后再执行下面的逻辑
            if (fetchedSettings && fetchedSettings.siteStartDate) {
                const startDate = new Date(fetchedSettings.siteStartDate); // 使用从设置中获取的创建日期

                // 计算并显示运行时间的函数
                const calculateRuntime = () => {
                    const currentDate = new Date();
                    const timeDiff = currentDate - startDate;

                    // 计算天数、小时、分钟和秒数
                    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                    setRuntime(`${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`);
                };

                // 初始运行和每秒更新
                calculateRuntime();
                const timer = setInterval(calculateRuntime, 1000);

                // 组件卸载时清除计时器
                return () => clearInterval(timer);
            }
        };

        loadSettings();
    }, []);

    return (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
            站点已运行 {runtime}
        </Typography>
    );
}

export default function Footer() {
    return (
        <React.Fragment>
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 4, sm: 1 },
                    py: { xs: 8, sm: 10 },
                    textAlign: { sm: 'center', md: 'left' },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        width: '100%',
                        justifyContent: 'space-between',
                    }}
                >
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        pt: { xs: 4, sm: 2 },
                        width: '100%',
                        borderTop: '1px solid',
                        borderColor: 'divider',
                    }}
                >
                    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <Copyright />
                        <Box sx={{ mx: 2 }} /> {/* 使用 Box 添加一些水平间距 */}
                        <SiteRuntime />
                    </Box>
                    <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{
                            justifyContent: 'left',
                            color: 'text.secondary',
                            mt: { xs: 2, sm: 0 }
                        }}
                    >
                        <IconButton
                            color="inherit"
                            size="small"
                            href="https://github.com/AstraYang/Blog"
                            aria-label="GitHub"
                            sx={{ alignSelf: 'center' }}
                        >
                            <GitHubIcon />
                        </IconButton>
                    </Stack>
                </Box>
            </Container>
        </React.Fragment>
    );
}
