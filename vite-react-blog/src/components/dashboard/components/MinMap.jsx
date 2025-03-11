import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom'; // 导入 useParams 和 useLocation
import ReactFlow, {
    addEdge,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from 'react-flow-renderer';
import 'react-flow-renderer/dist/style.css';
import {
    Paper,
    Button,
    Container,
    TextField,
    Menu,
    MenuItem,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Select,
    MenuItem as SelectMenuItem,
    Box,
    Typography,
    Tooltip,
} from '@mui/material';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { CircleNode } from '../../../pages/NodeShapes.jsx';
import { fetchMindMapById, updateMindMap } from '../../../api/MindMap.js';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "-3px",
                    fontSize: "14px",
                },
                shrink: {
                    top: "-2px",
                },
            },
        },
    }
});

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
    circle: CircleNode,
};

const MindMap = () => {
    const { id } = useParams(); // 获取路由参数中的ID
    const location = useLocation(); // 获取当前 URL
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [selectedNodeId, setSelectedNodeId] = React.useState(null);
    const [customColor, setCustomColor] = React.useState('#000000');

    // 新节点设置对话框的状态
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [newNodeName, setNewNodeName] = React.useState('');
    const [newNodeColor, setNewNodeColor] = React.useState('#ffd700');
    const [parentNodeId, setParentNodeId] = React.useState('');
    const [selectedShape, setSelectedShape] = React.useState('circle');
    const [newNodeUrl, setNewNodeUrl] = React.useState('');

    // 导入导出相关状态
    const [importDialogOpen, setImportDialogOpen] = React.useState(false);
    const [fileInput, setFileInput] = React.useState(null);

    // 右键菜单相关状态
    const [editMenuOpen, setEditMenuOpen] = React.useState(false);
    const [newLabel, setNewLabel] = React.useState('');

    // 新增标题和详情状态
    const [title, setTitle] = React.useState('');
    const [details, setDetails] = React.useState('');

    useEffect(() => {
        const loadMindMapData = async () => {
            try {
                const response = await fetchMindMapById(id);
                const mindMapData = response.data;

                setTitle(mindMapData.title);
                setDetails(mindMapData.summary);

                const { nodes: loadedNodes, edges: loadedEdges } = JSON.parse(mindMapData.data);
                setNodes(loadedNodes);
                setEdges(loadedEdges);
            } catch (error) {
                console.error('Failed to fetch MindMap data:', error);
            }
        };

        loadMindMapData();
    }, [id]);

    const resetMap = () => {
        setNodes(initialNodes);
        setEdges(initialEdges);
    };

    const handleAddNodeClick = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewNodeName('');
        setNewNodeColor('#ffd700');
        setParentNodeId('');
        setSelectedShape('circle');
        setNewNodeUrl('');
    };

    const handleCreateNode = () => {
        const newNodeId = (nodes.length + 1).toString();
        const newNode = {
            id: newNodeId,
            data: { label: newNodeName, color: newNodeColor, url: newNodeUrl },
            position: { x: Math.random() * 400, y: Math.random() * 400 },
            type: 'circle',
        };

        setNodes((nds) => nds.concat(newNode));

        if (parentNodeId) {
            setEdges((eds) => addEdge({ source: parentNodeId, target: newNodeId }, eds));
        }

        handleDialogClose();
    };

    const handleNodeContextMenu = (event, node) => {
        if (location.pathname.includes('/admin/mindMap/')) {
            event.preventDefault();
            setSelectedNodeId(node.id);
            setAnchorEl(event.currentTarget);
            setNewLabel(node.data.label);
            setEditMenuOpen(true);
        }
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setEditMenuOpen(false);
        setNewLabel('');
    };

    const changeNodeColor = () => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNodeId ? { ...node, data: { ...node.data, color: customColor } } : node
            )
        );
        handleCloseMenu();
    };

    const updateNodeLabel = () => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNodeId ? { ...node, data: { ...node.data, label: newLabel } } : node
            )
        );
        handleCloseMenu();
    };

    const updateNodeUrl = (url) => {
        setNodes((nds) =>
            nds.map((node) =>
                node.id === selectedNodeId ? { ...node, data: { ...node.data, url } } : node
            )
        );
        handleCloseMenu();
    };

    const deleteNode = () => {
        setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== selectedNodeId && edge.target !== selectedNodeId));
        handleCloseMenu();
    };

    const exportData = () => {
        const data = {
            nodes,
            edges,
        };
        const jsonStr = JSON.stringify(data);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mindmap.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportFile = (e) => {
        setFileInput(e.target.files[0]);
    };

    const handleImportData = () => {
        if (fileInput) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                const { nodes: importedNodes, edges: importedEdges } = JSON.parse(content);
                setNodes(importedNodes);
                setEdges(importedEdges);
            };
            reader.readAsText(fileInput);
            setImportDialogOpen(false);
        }
    };

    const handleSubmit = async () => {
        const mindMapData = {
            title: title,
            summary: details,
            data: JSON.stringify({ nodes, edges }),
        };

        try {
            await updateMindMap(mindMapData, id);
            console.log('思维导图更新成功');
            setTitle('');
            setDetails('');
        } catch (error) {
            console.error('更新思维导图失败:', error);
        }
    };

    const handleNodeClick = (event, node) => {
        if (node.data.url) {
            window.open(node.data.url, '_blank');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Typography variant="h4" align="center" style={{ marginBottom: '20px', display: location.pathname.includes('/admin/mindMap/') ? 'none' : 'block' }}>
                    {title}
                </Typography>
                <Typography variant="body1" align="center" style={{ marginBottom: '20px', display: location.pathname.includes('/admin/mindMap/') ? 'none' : 'block' }}>
                    {details}
                </Typography>
                <Paper style={{ padding: '20px', height: '550px' }}>

                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={(params) => setEdges((eds) => addEdge(params, eds))}
                        onNodeContextMenu={(event, node) => handleNodeContextMenu(event, node)}
                        onNodeClick={handleNodeClick}
                        nodeTypes={nodeTypes}
                        draggable
                    >
                        <MiniMap />
                        <Controls />
                        <Background />
                    </ReactFlow>
                    {location.pathname.includes('/admin/mindMap/') && (
                        <Menu anchorEl={anchorEl} open={editMenuOpen} onClose={handleCloseMenu}>
                            <MenuItem>
                                <TextField
                                    type="color"
                                    value={customColor}
                                    onChange={(e) => setCustomColor(e.target.value)}
                                    style={{ marginRight: '10px' }}
                                />
                                <Button onClick={changeNodeColor} color="primary">确定颜色</Button>
                            </MenuItem>
                            <MenuItem>
                                <TextField
                                    value={newLabel}
                                    onChange={(e) => setNewLabel(e.target.value)}
                                    placeholder="新节点名称"
                                    style={{ marginRight: '10px', flex: 1 }}
                                />
                                <Button onClick={updateNodeLabel} color="primary">修改名称</Button>
                            </MenuItem>
                            <MenuItem>
                                <TextField
                                    type="url"
                                    placeholder="新节点 URL"
                                    onChange={(e) => updateNodeUrl(e.target.value)}
                                    style={{ marginRight: '10px', flex: 1 }}
                                />
                            </MenuItem>
                            <MenuItem>
                                <Button onClick={deleteNode} color="secondary">删除节点</Button>
                            </MenuItem>
                        </Menu>
                    )}
                </Paper>

                {location.pathname.includes('/admin/mindMap/') && (
                    <>
                        <Tooltip title="重置思维导图">
                            <Button variant="contained" color="primary" onClick={resetMap} sx={{ mt: 2 }}>
                                <RotateLeftIcon />
                            </Button>
                        </Tooltip>

                        <Tooltip title="添加新节点">
                            <Button variant="contained" color="secondary" onClick={handleAddNodeClick} style={{ marginLeft: '10px' }} sx={{ mt: 2 }}>
                                <AddIcon />
                            </Button>
                        </Tooltip>

                        <Tooltip title="导出数据">
                            <Button variant="contained" color="default" onClick={exportData} style={{ marginLeft: '10px' }} sx={{ mt: 2 }}>
                                <GetAppIcon />
                            </Button>
                        </Tooltip>

                        <Tooltip title="导入数据">
                            <Button variant="contained" color="default" onClick={() => setImportDialogOpen(true)} style={{ marginLeft: '10px' }} sx={{ mt: 2 }}>
                                <FileCopyIcon />
                            </Button>
                        </Tooltip>
                    </>
                )}

                {/* 新节点设置对话框 */}
                <Dialog open={dialogOpen} onClose={handleDialogClose}>
                    <DialogTitle>添加新节点</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="节点名称"
                            type="text"
                            fullWidth
                            value={newNodeName}
                            onChange={(e) => setNewNodeName(e.target.value)}
                        />
                        <TextField
                            type="url"
                            label="节点 URL"
                            margin="dense"
                            fullWidth
                            value={newNodeUrl}
                            onChange={(e) => setNewNodeUrl(e.target.value)}
                        />
                        <TextField
                            type="color"
                            label="节点颜色"
                            margin="dense"
                            fullWidth
                            value={newNodeColor}
                            onChange={(e) => setNewNodeColor(e.target.value)}
                            sx={{ height: '40px' }}
                        />
                        <TextField
                            select
                            label="形状"
                            fullWidth
                            value={selectedShape}
                            onChange={(e) => setSelectedShape(e.target.value)}
                            margin="dense"
                            sx={{ mt: 3 }}
                        >
                            <SelectMenuItem value="circle">圆形</SelectMenuItem>
                        </TextField>

                        <TextField
                            select
                            label="父节点"
                            fullWidth
                            value={parentNodeId}
                            onChange={(e) => setParentNodeId(e.target.value)}
                            margin="dense"
                        >
                            <SelectMenuItem value="">无</SelectMenuItem>
                            {nodes.map(node => (
                                <SelectMenuItem key={node.id} value={node.id}>{node.data.label}</SelectMenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleDialogClose} color="primary">取消</Button>
                        <Button onClick={handleCreateNode} color="primary">创建节点</Button>
                    </DialogActions>
                </Dialog>

                {/* 导入数据对话框 */}
                <Dialog open={importDialogOpen} onClose={() => setImportDialogOpen(false)}>
                    <DialogTitle>导入数据</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            请选择一个 JSON 文件以导入节点和边的数据。
                        </DialogContentText>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleImportFile}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setImportDialogOpen(false)} color="primary">取消</Button>
                        <Button onClick={handleImportData} color="primary">导入</Button>
                    </DialogActions>
                </Dialog>

                {/* 新增标题和详情输入框与提交按钮 */}
                {location.pathname.includes('/admin/mindMap/') && (
                    <Box sx={{ marginTop: 2 }}>
                        <TextField
                            label="标题"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            style={{ marginBottom: '10px' }}
                        />
                        <TextField
                            label="详情"
                            variant="outlined"
                            fullWidth
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            multiline
                            rows={4}
                            style={{ marginBottom: '10px' }}
                        />
                        <Button variant="contained" color="primary" onClick={handleSubmit}>
                            提交
                        </Button>
                    </Box>
                )}
            </Container>
        </ThemeProvider>
    );
};

export default MindMap;
