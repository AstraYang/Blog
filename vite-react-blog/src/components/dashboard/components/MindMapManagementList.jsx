import { useEffect, useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Divider,
    Pagination,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, Checkbox,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import {fetchMindMapManagementList, createMindMap, deleteMindMaps, fetchMindMapByKeyword} from '../../../api/MindMap';
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

export default function MindMapManagementList() {
    const [userId, setUserId] = useState(null);
    const [mindMaps, setMindMaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // 添加搜索状态
    const [newMindMapTitle, setNewMindMapTitle] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(1);

    // 控制弹窗的状态
    const [openCreateDialog, setOpenCreateDialog] = useState(false);
    const [newMindMapId, setNewMindMapId] = useState(null);

    // 控制删除弹窗的状态
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [confirmDeleteIds, setConfirmDeleteIds] = useState([]);

    const pageSize = 4;
    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        const parsedUserInfo = JSON.parse(userInfo);
        if (parsedUserInfo) {
            const uId = parsedUserInfo.id;
            setUserId(uId);
            fetchMindMapsData(uId);
        }
    }, [currentPage, searchTerm]);

    const fetchMindMapsData = async (uId) => {
        setLoading(true);
        try {
            if (searchTerm){
                const data = await fetchMindMapByKeyword(currentPage, pageSize, searchTerm, uId);
                setMindMaps(data.data.records);
                setTotal(data.data.pages || 0);
            }  else {
                const data = await fetchMindMapManagementList(uId, currentPage, pageSize);
                setMindMaps(data.data.records);
                setTotal(data.data.pages || 0);
            }
        } catch (error) {
            console.error('Error fetching mind maps:', error);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMindMap = async () => {
        if (!newMindMapTitle.trim()) {
            message.error('思维导图标题不能为空');
            return;
        }

        try {
            const userInfo = localStorage.getItem('userInfo');
            const parsedUserInfo = JSON.parse(userInfo);
            if (parsedUserInfo) {
                const userId = parsedUserInfo.id;
                const response = await createMindMap({title: newMindMapTitle, author: userId});
                setNewMindMapTitle('');
                setNewMindMapId(response.data);
                setOpenCreateDialog(true);
                message.success('添加成功');
            }
        } catch (error) {
            console.error('Failed to create mind map:', error);
        }
    };

    const handleDialogClose = (confirm) => {
        setOpenCreateDialog(false);
        if (confirm) {
            navigate(`/admin/mindMap/${newMindMapId}`);
        }
        fetchMindMapsData(userId);
    };

    const handleDeleteMindMaps = () => {
        if (selectedIds.length === 0) return;

        setConfirmDeleteIds(selectedIds);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await deleteMindMaps(confirmDeleteIds);
            setSelectedIds([]);
            fetchMindMapsData(userId);
            message.success('删除成功');
        } catch (error) {
            message.error('删除失败');
            console.error('Failed to delete mind maps:', error);
        } finally {
            setOpenDeleteDialog(false);
        }
    };

    const handleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((selectedId) => selectedId !== id) : [...prev, id]
        );
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const isSelected = (id) => selectedIds.includes(id);

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
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <Typography variant="h5" gutterBottom sx={{ mt: 7 }}>
                    知识地图管理
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="搜索导图..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1); // 重置为第一页
                        }}
                        sx={{ mx: 2, width: '200px' }}
                    />
                </Box>
                </Box>
                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                        label="知识地图标题"
                        value={newMindMapTitle}
                        onChange={(e) => setNewMindMapTitle(e.target.value)}
                        size="small"
                        sx={{ width: '150px' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddMindMap}>
                        添加知识地图
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDeleteMindMaps}
                        disabled={selectedIds.length === 0}
                    >
                        删除选中
                    </Button>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : mindMaps.length === 0 ? (
                    <Typography variant="body1">暂无数据</Typography>
                ) : (
                    <Box sx={{ display: { xs: 'block', md: 'grid'}, gridTemplateColumns: { md: 'repeat(1, 1fr)' }, gap: 1 }}>
                        {mindMaps.map((mindMap) => (
                            <Card key={mindMap.id} sx={{ border: isSelected(mindMap.id) ? '2px solid #3f51b5' : '1px solid #ccc', borderRadius: 1, my:1 }}>
                                <CardContent sx={{padding:0.5}}>
                                    <Typography variant="h6">
                                        <Link to={`/admin/mindMap/${mindMap.id}`} style={{ textDecoration: 'none', color: '#027cb5' }}>
                                            {mindMap.title}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2">{mindMap.summary}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        更新时间: {mindMap.updatedAt ===null ? new Date(mindMap.createdAt).toLocaleString() :new Date(mindMap.updatedAt).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Checkbox
                                        checked={isSelected(mindMap.id)}
                                        onChange={() => handleSelect(mindMap.id)}
                                    />
                                </CardActions>
                            </Card>
                        ))}
                    </Box>
                )}

                <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                    <Pagination
                        count={total}
                        page={currentPage}
                        onChange={handlePageChange}
                        variant="outlined"
                        shape="rounded"
                        sx={{ display: 'flex', justifyContent: 'end', mb: 2 }}
                    />
                </Box>

                {/* 添加弹窗 */}
                <Dialog open={openCreateDialog} onClose={() => handleDialogClose(false)}>
                    <DialogTitle>知识地图创建成功</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            知识地图创建成功，您是否要跳转到编辑页面？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleDialogClose(false)} color="primary">
                            取消
                        </Button>
                        <Button onClick={() => handleDialogClose(true)} color="primary">
                            确认
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* 删除确认弹窗 */}
                <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
                    <DialogTitle>确认删除</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            您确定要删除选中的知识地图吗？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
                            取消
                        </Button>
                        <Button onClick={handleConfirmDelete} color="primary">
                            确认删除
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </ThemeProvider>
    );
}
