import React, { useEffect } from 'react';
import { useParams} from 'react-router-dom';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import {
    Paper,
    Container,
    Typography,
} from '@mui/material';
import { fetchMindMapById } from '../../api/MindMap.js';
import { createTheme, ThemeProvider } from "@mui/material/styles";

// 导入自定义节点和边
import { TextUpdaterNode, LogoNode, BaseNode, ImgNode } from '../Flow/components/Nodes';
import { CustomEdge } from '../Flow/components/Edges';

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

const MindMapDetail = () => {
    const { id } = useParams(); // 获取路由参数中的ID
    const [nodes, setNodes] = useNodesState(initialNodes);
    const [edges, setEdges] = useEdgesState(initialEdges);

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

    // 定义自定义节点的类型
    const nodeTypes = {
        textUpdater: TextUpdaterNode,
        logo: LogoNode,
        base: BaseNode,
        img: ImgNode,
    };

    // 定义自定义边的类型
    const edgeTypes = {
        custom: CustomEdge,
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <Typography variant="h4" align="center" style={{ marginBottom: '20px' }}>
                    {title}
                </Typography>
                <Typography variant="body1" align="center" style={{ marginBottom: '20px' }}>
                    {details}
                </Typography>
                <Paper style={{ padding: '20px', height: '600px' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        edgeTypes={edgeTypes}
                        fitView
                        attributionPosition="bottom-right"
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant="dots" gap={12} size={1} />
                    </ReactFlow>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default MindMapDetail;
