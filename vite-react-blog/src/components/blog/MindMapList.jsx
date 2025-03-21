import { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    CircularProgress,
    Pagination,
    Divider,
} from '@mui/material';
import { fetchMindMaps } from '../../api/MindMap';
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import {
    ReactFlow,
    ReactFlowProvider,
    Background,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 导入自定义节点和边
import { TextUpdaterNode, LogoNode, BaseNode, ImgNode } from '../Flow/components/Nodes';
import { CustomEdge } from '../Flow/components/Edges';
import PropTypes from "prop-types";

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

const StyledTypography = styled(Typography)({
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
});

// 注册自定义节点类型
const nodeTypes = {
    textUpdater: TextUpdaterNode,
    logo: LogoNode,
    base: BaseNode,
    image: ImgNode,
};

// 注册自定义边类型
const edgeTypes = {
    custom: CustomEdge,
};

// 单个思维导图组件，使用ReactFlowProvider防止多个流图实例之间冲突
const MindMapPreview = ({ mindMap }) => {
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([]);

    useEffect(() => {
        try {
            if (mindMap && mindMap.data) {
                const flowData = JSON.parse(mindMap.data);
                setNodes(flowData.nodes || []);
                setEdges(flowData.edges || []);
            }
        } catch (error) {
            console.error('Error parsing mind map data:', error, mindMap);
        }
    }, [mindMap]);

    if (!nodes.length && !edges.length) {
        return <Typography color="error">思维导图数据为空</Typography>;
    }

    return (
        <div style={{ width: '100%', height: '200px' }}>
            <ReactFlowProvider>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    fitView
                    zoomOnScroll={false}
                    panOnScroll={true}
                    panOnDrag={true}
                    interactive={true}
                >
                    <Background />
                </ReactFlow>
            </ReactFlowProvider>
        </div>
    );
};
MindMapPreview.propTypes = {
    mindMap: PropTypes.shape({
        data: PropTypes.string, // 假设 data 是字符串形式的 JSON
    }).isRequired,
};

const MindMapList = () => {
    const [mindMaps, setMindMaps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [total, setTotal] = useState(1);
    const pageSize = 4;

    useEffect(() => {
        fetchMindMapsData();
    }, [currentPage]);

    const fetchMindMapsData = async () => {
        setLoading(true);
        try {
            const data = await fetchMindMaps(currentPage, pageSize);
            if (data && data.data && data.data.records) {
                setMindMaps(data.data.records);
                setTotal(data.data.pages || 0);
            } else {
                console.error('Invalid response format:', data);
                setMindMaps([]);
                setTotal(0);
            }
        } catch (error) {
            console.error('Error fetching mind maps:', error);
            setMindMaps([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: { xs: '100%', sm: '80%', md: '100%' },
                    mx: 'auto',
                    mt: 0,
                }}
            >
                <Divider sx={{ my: 1.5 }} />

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : mindMaps.length === 0 ? (
                    <Typography variant="body1" sx={{ textAlign: 'center', my: 4 }}>暂无数据</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {mindMaps.map((mindMap) => (
                            <Grid item xs={12} sm={6} md={3} key={mindMap.id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    <Box sx={{ height: '200px', position: 'relative' }}>
                                        <MindMapPreview mindMap={mindMap} />
                                    </Box>
                                    <CardContent sx={{ p: 2, backgroundColor: '#f5f5f5', flexGrow: 1 }}>
                                        <Link to={`/mindMap/${mindMap.id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                                            <Typography variant="h6" sx={{ mb: 1 }}>
                                                {mindMap.title || '无标题'}
                                            </Typography>
                                        </Link>
                                        <StyledTypography variant="body2" color="text.secondary" sx={{ mb: 2, height: '40px' }}>
                                            {mindMap.summary || '无描述'}
                                        </StyledTypography>
                                        <Typography variant="caption" color="text.secondary">
                                            更新时间：{new Date(mindMap.updatedAt).toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Divider sx={{ my: 1.5 }} />

                {total > 0 && (
                    <Box sx={{ marginTop: 2, textAlign: 'center' }}>
                        <Pagination
                            count={total}
                            page={currentPage}
                            onChange={handlePageChange}
                            variant="outlined"
                            shape="rounded"
                            sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}
                        />
                    </Box>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default MindMapList;

