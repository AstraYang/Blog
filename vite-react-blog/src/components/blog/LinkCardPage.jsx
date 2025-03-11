import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { getLinkItems } from '../../menuStorage'; // 导入获取链接数据的方法

export default function LinkCardPage() {
    const [data, setData] = useState({}); // 组件状态保存链接数据

    useEffect(() => {
        const linkData = getLinkItems(); // 从localStorage获取链接数据
        console.log('获取链接数据:', linkData)
        setData(linkData);
    }, []);

    return (
        <Box
            sx={{
                maxWidth: '1200px',
                padding: 2,
            }}
        >
            {Object.entries(data).length > 0 ? ( // 检查数据是否存在
                Object.entries(data).map(([category, links]) => (
                    <Box key={category} sx={{ mb: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            {category}
                        </Typography>
                        <Grid container spacing={2}>
                            {links.map((link, index) => (
                                <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Paper
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            padding: 2,
                                            borderRadius: 2,
                                            boxShadow: 2,
                                            textDecoration: 'none',
                                            color: 'text.primary',
                                            '&:hover': {
                                                boxShadow: 4,
                                            },
                                        }}
                                        component="a"
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <img
                                                src={link.icon}
                                                alt={link.name}
                                                style={{
                                                    width: '30px',
                                                    height: '30px',
                                                    marginRight: '16px',
                                                }}
                                            />
                                            <Typography variant="body1">
                                                {link.name}
                                            </Typography>
                                        </Box>
                                        <KeyboardDoubleArrowRightIcon />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                ))
            ) : (
                <Typography variant="h6" color="text.secondary">
                    暂无可用链接.
                </Typography>
            )}
        </Box>
    );
}
