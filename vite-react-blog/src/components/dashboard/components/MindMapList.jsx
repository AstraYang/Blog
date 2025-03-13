import React, { useEffect, useState } from 'react';
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
import { fetchMindMaps, createMindMap, deleteMindMaps } from '../../../api/MindMap';
import { createTheme, ThemeProvider } from "@mui/material/styles";

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

export default function MindMapList() {
    const [mindMaps, setMindMaps] = useState([]);
    const [loading, setLoading] = useState(true);
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
        fetchMindMapsData();
    }, [currentPage]);

    const fetchMindMapsData = async () => {
        setLoading(true);
        try {
            const data = await fetchMindMaps(currentPage, pageSize);
            setMindMaps(data.data.records);
            setTotal(data.data.pages || 0);
        } catch (error) {
            console.error('Error fetching mind maps:', error);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handleAddMindMap = async () => {
        if (!newMindMapTitle.trim()) {
            alert('思维导图标题不能为空');
            return;
        }

        try {
            const response = await createMindMap({ title: newMindMapTitle });
            setNewMindMapTitle('');
            setNewMindMapId(response.data);
            setOpenCreateDialog(true);
        } catch (error) {
            console.error('Failed to create mind map:', error);
        }
    };

    const handleDialogClose = (confirm) => {
        setOpenCreateDialog(false);
        if (confirm) {
            navigate(`/admin/mindMap/${newMindMapId}`);
        }
        fetchMindMapsData();
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
            fetchMindMapsData();
        } catch (error) {
            alert('删除失败');
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
                <Typography variant="h5" gutterBottom sx={{ mt: 7 }}>
                    思维导图管理
                </Typography>
                <Divider sx={{ my: 1.5 }} />

                <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                    <TextField
                        label="思维导图标题"
                        value={newMindMapTitle}
                        onChange={(e) => setNewMindMapTitle(e.target.value)}
                        size="small"
                    />
                    <Button variant="contained" color="primary" onClick={handleAddMindMap}>
                        添加思维导图
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
                    <Box sx={{ display: { xs: 'block', md: 'grid' }, gridTemplateColumns: { md: 'repeat(2, 1fr)' }, gap: 2 }}>
                        {mindMaps.map((mindMap) => (
                            <Card key={mindMap.id} sx={{ border: isSelected(mindMap.id) ? '2px solid #3f51b5' : '1px solid #ccc', borderRadius: 2 }}>
                                <CardContent>
                                    <Typography variant="h6">
                                        <Link to={`/admin/mindMap/${mindMap.id}`} style={{ textDecoration: 'none', color: '#027cb5' }}>
                                            {mindMap.title}
                                        </Link>
                                    </Typography>
                                    <Typography variant="body2">{mindMap.summary}</Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        更新时间: {new Date(mindMap.updatedAt).toLocaleString()}
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
                        sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}
                    />
                </Box>

                {/* 添加弹窗 */}
                <Dialog open={openCreateDialog} onClose={() => handleDialogClose(false)}>
                    <DialogTitle>思维导图创建成功</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            思维导图创建成功，您是否要跳转到编辑页面？
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
                            您确定要删除选中的思维导图吗？
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
