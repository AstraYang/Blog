import { useState, useEffect } from 'react';
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
import {
    fetchSettings,
    getSiteSettings,
    saveSettings,
    setSiteSettings
} from '../../../api/menuStorage.js';
import { message } from "antd"; // 导入新存储方法

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
    const [link, setLink] = useState(JSON.stringify([])); // 初始状态为 JSON 字符串
    const [formattedLink, setFormattedLink] = useState(''); // 新增状态用于存储格式化后的链接
    const [allowRegistration, setAllowRegistration] = useState(false);
    const [favicon, setFavicon] = useState('');
    const [logo, setLogo] = useState('');
    const [siteStartDate, setSiteStartDate] = useState('');

    useEffect(() => {
        fetchSettings();
        const settings = getSiteSettings();
        setSiteName(settings.siteName);
        setSiteDescription(settings.siteDescription);
        setLink(settings.linkItems);
        setFormattedLink(formatJson(settings.linkItems)); // 格式化链接
        setAllowRegistration(settings.allowRegistration || false);
        setFavicon(settings.favicon || '');
        setLogo(settings.logo || '');
        setSiteStartDate(settings.siteStartDate || '');
    }, []);

    const formatJson = (jsonString) => {
        try {
            const jsonObject = JSON.parse(jsonString);
            return JSON.stringify(jsonObject, null, 2); // 使用2个空格缩进
        } catch (error) {
            return jsonString; // 如果解析失败，返回原始字符串
        }
    };

    const handleSave = () => {
        let parsedLink;
        try {
            parsedLink = JSON.parse(link); // 尝试将 link 解析为对象
        } catch (error) {
            message.error('链接设置格式错误，请检查 JSON 格式！');
            return;
        }

        const settings = {
            id: 1,
            siteName,
            siteDescription,
            allowRegistration,
            favicon,
            logo,
            siteStartDate,
            linkItems: JSON.stringify(parsedLink), // 确保 linkItems 是合法的 JSON 字符串
        };

        setSiteSettings(settings);
        saveSettings(settings);
        message.success('设置已保存！');
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

                    {/* 站点运行时间设置 */}
                    <Box sx={{ mb: 5 }}>
                        <TextField
                            label="站点运行时间 (YYYY-MM-DD)"
                            variant="outlined"
                            fullWidth
                            value={siteStartDate}
                            onChange={(e) => setSiteStartDate(e.target.value)} // 更新状态
                            placeholder="例如: 2023-10-01"
                        />
                        <Typography variant="caption" color="textSecondary">
                            请提供站点运行的开始日期，格式为 YYYY-MM-DD.
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
                        value={formattedLink} // 显示格式化后的链接
                        onChange={(e) => {
                            setLink(e.target.value);
                            setFormattedLink(formatJson(e.target.value)); // 更新格式化后的链接
                        }} // 更新状态
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
