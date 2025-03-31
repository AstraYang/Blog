import { useState, useEffect } from 'react';
import {
    Box,
    Button,
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
import {getUserList, updateUserStatus} from '../../../api/User.js'; // 修改了引入的API函数
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {message} from "antd";

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

export default function UserList() {
    const [data, setData] = useState([]); // 用户列表数据
    const [selectedIds, setSelectedIds] = useState([]); // 选中项

    // 从后端获取用户列表
    const loadUsers = async () => {
        try {
            const users = await getUserList();
            setData(users.data); // 更新用户列表
            console.log(data)
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    // 初始化加载
    useEffect(() => {
        loadUsers();
    }, []);

    // 处理选中事件
    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    // 检查是否选中
    const isSelected = (id) => selectedIds.includes(id);

    // 禁用选中的用户
    const handleDisable = async () => {
        try {
            const success = await updateUserStatus({
                ids: selectedIds,
                newStatus: false // 设置状态为禁用
            });
            message.success(success.data);
            await loadUsers(); // 重新加载用户列表
            setSelectedIds([]); // 清空选择
        } catch (error) {
            message.success('禁用失败');
            console.error('Failed to disable users:', error);
        }
    };
    const handleEnable = async () => {
        try {
            const success = await updateUserStatus({
                ids: selectedIds,
                newStatus: true // 设置状态为启用
            });
            message.success(success.data);
            await loadUsers(); // 重新加载用户列表
            setSelectedIds([]); // 清空选择
        } catch (error) {
            message.success('启用失败');
            console.error('Failed to enable users:', error);
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
                <Typography variant="h5" gutterBottom sx={{ mt: 7 }}>
                    用户管理
                </Typography>
                <Divider sx={{ my: 1.5 }} /> {/* 水平分割线 */}

                {/* 操作按钮容器 */}
                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    {/* 禁用按钮 */}
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={handleDisable}
                        disabled={selectedIds.length === 0} // 如果没有选中项，禁用按钮
                    >
                        禁用选中
                    </Button>
                    {/* 启用按钮 */}
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleEnable}
                        disabled={selectedIds.length === 0} // 如果没有选中项，禁用按钮
                    >
                        启用选中
                    </Button>
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
                                            selectedIds.length > 0 && selectedIds.length < data.filter(item => item.permissions !== 'ADMIN').length
                                        }
                                        checked={
                                            data.filter(item => item.permissions !== 'ADMIN').length > 0 &&
                                            selectedIds.length === data.filter(item => item.permissions !== 'ADMIN').length
                                        }
                                        onChange={(e) => {
                                            // 全选或取消全选（排除 ADMIN 用户）
                                            if (e.target.checked) {
                                                setSelectedIds(data.filter(item => item.permissions !== 'ADMIN').map((item) => item.id));
                                            } else {
                                                setSelectedIds([]);
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell align="center">头像</TableCell>
                                <TableCell align="center">账号</TableCell>
                                <TableCell align="center">昵称</TableCell>
                                <TableCell align="center">电子邮箱</TableCell>
                                <TableCell align="center">用户组</TableCell>
                                <TableCell align="center">状态</TableCell>
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
                                        {row.permissions === 'ADMIN' ? null : (
                                            // 非 ADMIN 用户显示复选框
                                            <Checkbox
                                                checked={isSelected(row.id)}
                                                onChange={() => handleSelect(row.id)}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell align="center">
                                        <img
                                            src={row.avatar} // 假设头像的 URL 存储在 row.avatar 中
                                            alt="用户头像"
                                            style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                                        />
                                    </TableCell>
                                    <TableCell align="center">{row.username}</TableCell>
                                    <TableCell align="center">{row.nickName}</TableCell>
                                    <TableCell align="center">{row.email}</TableCell>
                                    <TableCell align="center">{row.permissions}</TableCell>
                                    <TableCell align="center">
                                        <span style={{
                                            color: row.status ? 'green' : 'red',
                                            fontWeight: 'bold'
                                        }}>
                                            {row.status ? '正常' : '已禁用'}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}
