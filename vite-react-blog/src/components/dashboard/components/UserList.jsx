import { useState, useEffect } from 'react';
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
import { getUserList, createUser, deleteUsers } from '../../../api/User.js'; // 假设你有相关的 API 函数
import { createTheme, ThemeProvider } from "@mui/material/styles";

// 创建主题
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

export default function UserList() {
    const [data, setData] = useState([]); // 用户列表数据
    const [selectedIds, setSelectedIds] = useState([]); // 选中项
    const [newUserData, setNewUserData] = useState({ username: '', nickName: '', email: '', permissions: '' }); // 新增用户数据
    const [showInput, setShowInput] = useState(false); // 控制新增输入框是否显示

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

    // 添加新用户
    const handleAdd = async () => {
        const { username, nickName, email, permissions } = newUserData;
        if (!username.trim() || !nickName.trim() || !email.trim() || !permissions.trim()) {
            alert('所有字段不能为空');
            return;
        }
        try {
            await createUser(newUserData); // 调用后端 API 创建用户
            setNewUserData({ username: '', nickName: '', email: '', permissions: '' }); // 清空输入框
            setShowInput(false); // 隐藏输入框
            await loadUsers(); // 重新加载用户列表
        } catch (error) {
            console.error('Failed to add user', error);
        }
    };

    // 删除选中的用户
    const handleDelete = async () => {
        try {
            await deleteUsers(selectedIds); // 调用后端 API 删除用户
            await loadUsers(); // 重新加载用户列表
        } catch (error) {
            alert('删除失败');
            console.error('Failed to delete users:', error);
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
                    {/* 删除按钮 */}
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
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
                                label="账号"
                                value={newUserData.username}
                                onChange={(e) => setNewUserData({ ...newUserData, username: e.target.value })}
                                size="small"
                            />
                            <TextField
                                label="昵称"
                                value={newUserData.nickName}
                                onChange={(e) => setNewUserData({ ...newUserData, nickName: e.target.value })}
                                size="small"
                            />
                            <TextField
                                label="邮箱"
                                value={newUserData.email}
                                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                                size="small"
                            />
                            <TextField
                                label="权限"
                                value={newUserData.permissions}
                                onChange={(e) => setNewUserData({ ...newUserData, permissions: e.target.value })}
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
                                <TableCell align="center">头像</TableCell>
                                <TableCell align="center">账号</TableCell>
                                <TableCell align="center">昵称</TableCell>
                                <TableCell align="center">电子邮箱</TableCell>
                                <TableCell align="center">权限</TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </ThemeProvider>
    );
}
