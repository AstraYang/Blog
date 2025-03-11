// src/MenuManagement.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Divider,
    Paper,
} from '@mui/material';
import { getMenuItems, setMenuItems } from '../menuStorage';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "2px", // 调整初始位置
                    fontSize: "14px",
                },
                shrink: {
                    top: "-4px", // 调整缩小后的位置
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'darkgreen', // 悬停时背景色
                        color: 'white', // 悬停时字体颜色
                    },
                },
            },
        },
    },
});

export default function BlogCreatPage() {
    const defaultMenuItems = { '首页': '首页', '知识地图': '知识地图' };
    const [menuItems, setMenuItemsState] = useState(() => {
        const existingItems = getMenuItems();
        return { ...defaultMenuItems, ...existingItems }; // 合并默认项和存储项
    });
    const [availableOptions, setAvailableOptions] = useState(['导航', '图片', '工具', '关于']);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedItems, setSelectedItems] = useState([]); // 用于保存选中的菜单项

    useEffect(() => {
        setMenuItems(menuItems);
    }, [menuItems]);

    const handleAddMenuItem = () => {
        if (selectedOption && !(selectedOption in menuItems)) {
            const updatedMenuItems = { ...menuItems, [selectedOption]: selectedOption };
            setMenuItemsState(updatedMenuItems);
            setAvailableOptions(availableOptions.filter(option => option !== selectedOption));
            setSelectedOption('');
        }
    };

    const handleDeleteSelectedItems = () => {
        const updatedMenuItems = { ...menuItems };
        selectedItems.forEach(item => {
            if (!(item in defaultMenuItems)) {
                delete updatedMenuItems[item];
            }
        });
        setMenuItemsState(updatedMenuItems);
        setSelectedItems([]); // 清空选中项
    };

    const handleSelectItem = (item) => {
        if (defaultMenuItems[item]) {
            // 如果是默认项，不执行选择
            return;
        }
        if (selectedItems.includes(item)) {
            // 如果已选中，则取消选中
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
        } else {
            // 否则添加到选中项
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: { xs: '100%', sm: '80%', md: '70%' },
                    maxWidth: '1200px',
                    mx: 'auto',
                    mt: 4,
                    padding: 2,
                }}
            >
                <Typography variant="h5" gutterBottom>
                    菜单选项管理
                </Typography>
                <Divider sx={{ my: 1.5 }} /> {/* 水平分割线 */}

                {/* 操作按钮容器 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                        select
                        label="添加页面"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                        sx={{
                            mt: 1,
                            minWidth: 120,
                            '& .MuiSelect-select': {
                                color: 'text.primary', // 文本颜色
                                backgroundColor: 'background.paper', // 背景色
                            },
                        }}

                    >
                        {availableOptions.map((option, index) => (
                            <MenuItem key={index} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="contained"
                        onClick={handleAddMenuItem}
                        disabled={!selectedOption}
                    >
                        添加
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleDeleteSelectedItems}
                        disabled={selectedItems.length === 0} // 如果没有选中项，则禁用删除按钮
                        sx={{
                            marginLeft: 2, // 添加左边距以分离按钮
                            color: selectedItems.length > 0 ? 'white' : 'text.primary', // 文本颜色
                            backgroundColor: selectedItems.length > 0 ? 'error.main' : 'transparent', // 背景色
                            borderColor: selectedItems.length > 0 ? 'error.main' : 'text.primary', // 边框颜色
                            '&:hover': {
                                backgroundColor: selectedItems.length > 0 ? 'error.dark' : 'transparent', // 悬停时背景色
                                borderColor: selectedItems.length > 0 ? 'error.dark' : 'text.primary', // 悬停时边框颜色
                            },
                        }}
                    >
                        删除选中项
                    </Button>
                </Box>

                {/* 菜单项列表 */}
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {Object.entries(menuItems).map(([item]) => (
                            <Box
                                key={item}
                                onClick={() => handleSelectItem(item)}
                                sx={{
                                    padding: 1,
                                    margin: 0.5,
                                    border: 'none', // 去除边框
                                    borderRadius: '4px',
                                    backgroundColor: defaultMenuItems[item] ? '#4a4f4f' : '#0f9a00', // 默认项为灰色，其他项为绿色
                                    color: defaultMenuItems[item] ? '#faf9f9' : 'black', // 默认项继承颜色，其他项为黑色
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: defaultMenuItems[item] ? 'not-allowed' : 'pointer', // 禁用光标
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', // 添加阴影
                                    ...(selectedItems.includes(item) && { border: '2px solid  cyan' }), // 选中项的边框颜色更改为天青色
                                }}
                            >
                                <Typography sx={{ flexGrow: 1 }}>{item}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Paper>
            </Box>
        </ThemeProvider>
    );
}
