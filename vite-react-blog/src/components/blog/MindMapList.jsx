import React, { useEffect, useState } from 'react';
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
import ReactFlow from 'react-flow-renderer';
import { createTheme, styled, ThemeProvider } from "@mui/material/styles";
import { Link } from 'react-router-dom';
import { CircleNode } from '../../pages/NodeShapes';
import AppAppBar from "./AppAppBar.jsx";

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

const nodeTypes = {
    circle: CircleNode,
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
            setMindMaps(data.data.records);
            setTotal(data.data.pages || 0);
        } catch (error) {
            console.error('Error fetching mind maps:', error);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const renderMindMap = (mindMap) => {
        let nodes = [];
        let edges = [];

        try {
            const flowData = JSON.parse(mindMap.data);
            nodes = flowData.nodes;
            edges = flowData.edges;
        } catch (error) {
            console.error('Error parsing mind map data:', error);
            return <Typography color="error">思维导图数据格式错误</Typography>;
        }

        return (
            <div style={{ width: '100%', height: '300px' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    defaultZoom={0.5}
                    defaultPosition={[0, 0]}
                    nodeTypes={nodeTypes}
                />
            </div>
        );
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
                    <CircularProgress />
                ) : mindMaps.length === 0 ? (
                    <Typography variant="body1">暂无数据</Typography>
                ) : (
                    <Grid container spacing={2}>
                        {mindMaps.map((mindMap) => (
                            <Grid item xs={6} sm={3} md={3} key={mindMap.id}>
                                <Card sx={{ pb: 0 }}>
                                    <CardContent sx={{ p: 0, mb: -3 }}>
                                        {renderMindMap(mindMap)}
                                        <Box sx={{ backgroundColor: '#123456', color: 'white', p: 2, mt: 0 }}>
                                            <Link to={`/mindMap/${mindMap.id}`} style={{ textDecoration: 'none', color: '#189793' }}>
                                                <Typography variant="h6">
                                                    {mindMap.title}
                                                </Typography>
                                            </Link>
                                            <StyledTypography variant="body2" color="text.secondary" gutterBottom  sx={{height:'40px'}}>
                                                {mindMap.summary}
                                            </StyledTypography>
                                            <Typography variant="body2" color="white">
                                                更新时间：{new Date(mindMap.updatedAt).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
                <Divider sx={{ my: 1.5 }} />


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
            </Box>
        </ThemeProvider>
    );
};

export default MindMapList;
