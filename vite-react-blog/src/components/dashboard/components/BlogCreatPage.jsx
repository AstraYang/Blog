import { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    MenuItem,
    Divider,
    Paper,
} from '@mui/material';
import { fetchMenuItemData, updateMenuItem } from '../../../api/menu.js';
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
    const defaultMenuItems = {
        '首页': { id: 1, status: false, deleted: false },
        '知识地图': { id: 2, status: false, deleted: false }
    };
    const [menuItems, setMenuItemsState] = useState({});
    const [availableOptions, setAvailableOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    // 获取菜单项数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetchMenuItemData();
                console.log("获取菜单项成功:", response);
                const items = {};

                response.data.forEach(item => {
                    items[item.menuItem] = {
                        id: item.id,
                        status: item.status,
                        deleted: item.deleted
                    };
                });

                setMenuItemsState({ ...defaultMenuItems, ...items });

                const addableOptions = response.data.filter(item => item.status && item.deleted).map(item => item.menuItem);
                setAvailableOptions(addableOptions);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // 根据已添加的项更新可用选项
        const currentAddedItems = Object.keys(menuItems).filter(item => !menuItems[item].deleted);
        setAvailableOptions(prevOptions => prevOptions.filter(option => !currentAddedItems.includes(option)));
    }, [menuItems]);

    const handleAddMenuItem = async () => {
        if (selectedOption && availableOptions.includes(selectedOption)) {
            const updatedMenuItems = { ...menuItems };
            const selectedItem = updatedMenuItems[selectedOption];

            updatedMenuItems[selectedOption].deleted = false; // 将选中项的deleted改为false
            setMenuItemsState(updatedMenuItems);
            setSelectedOption('');

            // 调用API更新菜单项，使用ID进行更新
            try {
                console.log("更新菜单项:", { ids: [selectedItem.id], deleted: false });
                await updateMenuItem({ ids: [selectedItem.id], deleted: false });
            } catch (error) {
                console.error("Error updating menu item:", error);
            }
        }
    };

    const handleDeleteSelectedItems = async () => {
        const updatedMenuItems = { ...menuItems };
        const idsToDelete = [];

        selectedItems.forEach(item => {
            if (item in updatedMenuItems) {
                console.log("删除菜单项:", item);
                updatedMenuItems[item].deleted = true; // 将选中项的deleted改为true
                idsToDelete.push(updatedMenuItems[item].id); // 使用ID
            }
        });

        setMenuItemsState(updatedMenuItems);
        setSelectedItems([]); // 清空选中项

        // 调用更新菜单项的API
        if (idsToDelete.length > 0) {
            try {
                console.log("更新菜单项:", { ids: idsToDelete, deleted: true });
                await updateMenuItem({ ids: idsToDelete, deleted: true });
            } catch (error) {
                console.error("Error updating menu items:", error);
            }
        }
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
                    py: 7,
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
                                color: 'text.primary',
                                backgroundColor: 'background.paper',
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
                        disabled={selectedItems.length === 0}
                        sx={{
                            marginLeft: 2,
                            color: selectedItems.length > 0 ? 'white' : 'text.primary',
                            backgroundColor: selectedItems.length > 0 ? 'error.main' : 'transparent',
                            borderColor: selectedItems.length > 0 ? 'error.main' : 'text.primary',
                            '&:hover': {
                                backgroundColor: selectedItems.length > 0 ? 'error.dark' : 'transparent',
                                borderColor: selectedItems.length > 0 ? 'error.dark' : 'text.primary',
                            },
                        }}
                    >
                        删除选中项
                    </Button>
                </Box>

                {/* 菜单项列表 */}
                <Paper sx={{ padding: 2, borderRadius: 2, boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                        {Object.entries(menuItems).filter(([_, { deleted }]) => !deleted).map(([item, _]) => (
                            <Box
                                key={item}
                                onClick={() => handleSelectItem(item)}
                                sx={{
                                    padding: 1,
                                    margin: 0.5,
                                    border: 'none',
                                    borderRadius: '4px',
                                    backgroundColor: '#60bd5a', // 显示的项背景色
                                    color: 'black',
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                    ...(selectedItems.includes(item) && { border: '1px solid cyan' }),
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
