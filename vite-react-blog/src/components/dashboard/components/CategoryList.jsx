import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Divider,
} from '@mui/material';
import { fetchCategories, createCategory, deleteCategories} from '../../../api/category.js';
import {createTheme, ThemeProvider} from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "2px", // 调整初始位置
                    fontSize: "14px",
                },
                shrink: {
                    top: "-5px", // 调整缩小后的位置
                },
            },
        },
    },
});
export default function CategoryList() {
    const [data, setData] = useState([]); // 列表数据
    const [selectedIds, setSelectedIds] = useState([]); // 选中项
    const [newItemName, setNewItemName] = useState(''); // 新增项名称
    const [showInput, setShowInput] = useState(false); // 控制新增输入框是否显示

    // 从后端获取分类列表
    const loadCategories = async () => {
        try {
            const categories = await fetchCategories();
            setData(categories); // 更新分类列表
            console.log(categories)
        } catch (error) {
            console.error('Failed to fetch categories',error);
        }
    };

    // 初始化加载
    useEffect(() => {
        loadCategories();
    }, []);

    // 处理选中事件
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    // 检查是否选中
    const isSelected = (id) => selectedIds.includes(id);

    // 添加新项
    const handleAdd = async () => {
        if (!newItemName.trim()) {
            alert('分类名称不能为空');
            return;
        }
        try {
            console.log('newItemName:',newItemName);
            await createCategory(newItemName); // 调用后端 API 创建分类
            setNewItemName(''); // 清空输入框
            setShowInput(false); // 隐藏输入框
            await loadCategories(); // 重新加载分类列表
        } catch (error) {
            console.error('Failed to add category', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteCategories(selectedIds); // 调用后端 API 删除分类
            await loadCategories(); // 重新加载分类列表
        } catch (error) {
            alert('删除失败，只允许删除空分类')
            console.error('Failed to delete category：', error);
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
            }}
        >
            <Typography variant="h5" gutterBottom sx={{mt: 7}}>
                分类管理
            </Typography>
            <Divider sx={{ my: 1.5 }} /> {/* 水平分割线 */}

            {/* 操作按钮容器 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                {/* 删除按钮 */}
                <Button
                    variant="contained"
                    color="error"
                    onClick={handleDelete} // 可拓展删除功能
                    disabled={selectedIds.length === 0} // 如果没有选中项，禁用按钮
                >
                    删除选中
                </Button>

                {/* 添加按钮 */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setShowInput((prev) => !prev)} // 切换输入框显示状态
                >
                    {showInput ? '收起新增' : '添加'}
                </Button>

                {/* 新增输入框（动态显示） */}
                {showInput && (
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <TextField
                            label="分类名称"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            size="small"
                        />
                        <Button variant="contained" color="success" onClick={handleAdd}>
                            确定添加
                        </Button>
                    </Box>
                )}
            </Box>

            {/* 表格 */}
            <TableContainer
                component={Paper}
                sx={{
                    mb: 2,
                    borderRadius: '8px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox" align="center">
                                <Checkbox
                                    indeterminate={
                                        selectedIds.length > 0 && selectedIds.length < data.length
                                    }
                                    checked={data.length > 0 && selectedIds.length === data.length}
                                    onChange={(e) => {
                                        // 全选或取消全选
                                        if (e.target.checked) {
                                            setSelectedIds(data.map((item) => item.id));
                                        } else {
                                            setSelectedIds([]);
                                        }
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center">名称</TableCell>
                            <TableCell align="center">创建时间</TableCell>
                            <TableCell align="center">文章数</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.id}
                                selected={isSelected(row.id)}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell padding="checkbox" align="center">
                                    <Checkbox
                                        checked={isSelected(row.id)}
                                        onChange={() => handleSelect(row.id)}
                                    />
                                </TableCell>
                                <TableCell align="center">{row.categoryName}</TableCell>
                                <TableCell align="center">{row.createdAt}</TableCell>
                                <TableCell align="center">{row.count}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
        </ThemeProvider>
    );
}
