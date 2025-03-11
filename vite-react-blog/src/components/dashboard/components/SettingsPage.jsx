import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Radio,
    RadioGroup,
    FormControlLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { getLinkItems, getSiteSettings, setLinkItems, setSiteSettings } from '../../../menuStorage'; // 导入新存储方法

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

export default function SettingsPage() {
    const [siteName, setSiteName] = useState('');
    const [siteDescription, setSiteDescription] = useState('');
    const [link, setLink] = useState('');
    const [allowRegistration, setAllowRegistration] = useState(false); // 改为布尔值
    const [favicon, setFavicon] = useState(''); // 新增状态用于存储 Favicon URL
    const [logo, setLogo] = useState(''); // 新增状态用于存储 LOGO URL

    // 从 localStorage 加载数据
    useEffect(() => {
        const settings = getSiteSettings(); // 获取网站设置
        const linkItems = getLinkItems(); // 获取链接数据
        setSiteName(settings.siteName);
        setSiteDescription(settings.siteDescription);
        setLink(JSON.stringify(linkItems, null, 2)); // 转换为 JSON 字符串并格式化
        setAllowRegistration(settings.allowRegistration || false); // 加载注册设置
        setFavicon(settings.favicon || ''); // 加载 Favicon URL
        setLogo(settings.logo || ''); // 加载 LOGO URL
    }, []);

    // 保存数据到 localStorage
    const handleSave = () => {
        const settings = {
            siteName,
            siteDescription,
            allowRegistration, // 保存是否允许注册的状态
            favicon, // 保存 Favicon URL
            logo, // 保存 LOGO URL
        };
        setSiteSettings(settings); // 保存网站设置

        try {
            const parsedLink = JSON.parse(link); // 尝试解析链接数据
            setLinkItems(parsedLink); // 保存链接数据
            alert('设置已保存！');
        } catch (error) {
            alert('链接设置格式错误，请检查 JSON 格式！'); // 错误提示
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    maxWidth: '90%',
                    mx: 'auto',
                    padding: 3,
                }}
            >
                <Paper sx={{ padding: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        网站设置
                    </Typography>

                    {/* 站点名称 */}
                    <Box sx={{ mt: 5, mb: 5, maxWidth: '100%' }}>
                        <TextField
                            label="站点名称"
                            variant="outlined"
                            fullWidth
                            value={siteName}
                            onChange={(e) => setSiteName(e.target.value)}
                        />
                        <Typography variant="caption" color="textSecondary">
                            站点的名称将显示在网页的标题处.
                        </Typography>
                    </Box>

                    {/* 站点描述 */}
                    <Box sx={{ mb: 5 }}>
                        <TextField
                            label="站点描述"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={1}
                            value={siteDescription}
                            onChange={(e) => setSiteDescription(e.target.value)}
                        />
                    </Box>

                    {/* 网站 Favicon 设置 */}
                    <Box sx={{ mb: 5 }}>
                        <TextField
                            label="网站 Favicon URL"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            value={favicon}
                            onChange={(e) => setFavicon(e.target.value)} // 更新状态
                        />
                        <Typography variant="caption" color="textSecondary">
                            请提供网站 Favicon 的有效 URL.
                        </Typography>
                    </Box>

                    {/* 网站 Logo 设置 */}
                    <Box sx={{ mb: 5 }}>
                        <TextField
                            label="网站 LOGO URL"
                            variant="outlined"
                            fullWidth
                            value={logo}
                            onChange={(e) => setLogo(e.target.value)} // 更新状态
                        />
                        <Typography variant="caption" color="textSecondary">
                            请提供网站 LOGO 的有效 URL.
                        </Typography>
                    </Box>

                    {/* 是否允许注册 */}
                    <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        是否允许用户注册
                    </Typography>
                    <RadioGroup
                        row
                        value={allowRegistration ? 'true' : 'false'} // 使用字符串形式显示
                        onChange={(e) => setAllowRegistration(e.target.value === 'true')} // 将字符串转换为布尔值
                    >
                        <FormControlLabel value="true" control={<Radio />} label="是" />
                        <FormControlLabel value="false" control={<Radio />} label="否" />
                    </RadioGroup>

                    {/* 导航设置 */}
                    <Typography variant="subtitle1" sx={{ marginTop: 2 }}>
                        导航设置
                    </Typography>
                    <TextField
                        label="导航设置"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={6}
                        value={link}
                        onChange={(e) => setLink(e.target.value)} // 更新状态
                    />
                    <Typography variant="caption" color="textSecondary">
                        介绍：用于填写导航链接 (请使用有效的 JSON 格式),注意：需要先添加导航页面，该项才会生效
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        格式：{"{\"视频直播\": [{\"name\": \"腾讯视频\", \"url\": \"https://v.qq.com\", \"icon\": \"https://v.qq.com/favicon.ico\"}]}"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        其他：JSON对象的形式添加
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                        网站icon获取：主域名后面添加/favicon.ico
                    </Typography>

                    {/* 保存按钮 */}
                    <Box sx={{ mt: 5, mb: 9 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{ float: 'right' }}
                        >
                            保存设置
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
