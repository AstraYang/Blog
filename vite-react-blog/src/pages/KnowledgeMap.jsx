import React, { useState, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import { Box, Typography, Paper } from "@mui/material";
import { blue, grey } from "@mui/material/colors";

const KnowledgeMap = () => {
    // 模拟的知识地图数据
    const data = {
        nodes: [
            { id: "1", label: "嵌入式学习", type: "theme" },
            { id: "2", label: "嵌入式入门", type: "article" },
            { id: "3", label: "嵌入式硬件设计", type: "article" },
            { id: "4", label: "嵌入式操作系统", type: "article" },
            { id: "5", label: "嵌入式驱动开发", type: "article" },
        ],
        links: [
            { source: "1", target: "2", type: "related" },
            { source: "1", target: "3", type: "related" },
            { source: "1", target: "4", type: "related" },
            { source: "1", target: "5", type: "related" },
        ],
    };

    // 当前选中的节点
    const [selectedNode, setSelectedNode] = useState(null);
    const forceGraphRef = useRef();

    // 节点点击事件
    const handleNodeClick = (node) => {
        setSelectedNode(node);
    };

    // 自定义节点样式
    const paintNode = (node, ctx, globalScale) => {
        const fontSize = 12 / globalScale;
        const nodeRadius = node.type === "theme" ? 10 : 6; // 中心节点更大

        // 绘制节点圆圈
        ctx.beginPath();
        ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = node.type === "theme" ? blue[500] : blue[300]; // 主题节点为深蓝色，文章节点浅蓝色
        ctx.fill();
        ctx.strokeStyle = blue[700];
        ctx.stroke();

        // 绘制节点标签
        ctx.font = `${fontSize}px Sans-Serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = grey[900];
        ctx.fillText(node.label, node.x, node.y + nodeRadius + fontSize);
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "100vh",
                backgroundColor: grey[100],
            }}
        >
            {/* 左侧知识地图 */}
            <Box sx={{ width: "75%", height: "100%", padding: "10px" }}>
                <Typography
                    variant="h5"
                    sx={{ textAlign: "center", color: grey[800], marginBottom: "10px" }}
                >
                    知识地图 - 嵌入式学习
                </Typography>

                <ForceGraph2D
                    ref={forceGraphRef}
                    graphData={data}
                    nodeCanvasObject={paintNode}
                    linkDirectionalArrowLength={6} // 添加箭头
                    linkDirectionalArrowRelPos={1} // 箭头位置
                    linkCurvature={0.25} // 弧线连线
                    onNodeClick={handleNodeClick}
                    nodePointerAreaPaint={(node, color, ctx) => {
                        ctx.fillStyle = color;
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, 10, 0, 2 * Math.PI, false);
                        ctx.fill();
                    }}
                />
            </Box>

            {/* 右侧节点详情面板 */}
            <Box
                sx={{
                    width: "25%",
                    height: "100%",
                    backgroundColor: grey[200],
                    padding: "20px",
                    overflowY: "auto",
                }}
            >
                <Typography variant="h6" sx={{ color: grey[800], marginBottom: "10px" }}>
                    节点详情
                </Typography>
                {selectedNode ? (
                    <Paper
                        sx={{
                            padding: "15px",
                            backgroundColor: grey[50],
                            borderRadius: "8px",
                            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Typography variant="h6" sx={{ color: blue[600] }}>
                            {selectedNode.label}
                        </Typography>
                        <Typography variant="body1" sx={{ color: grey[800] }}>
                            类型：{selectedNode.type === "theme" ? "主题" : "文章"}
                        </Typography>
                    </Paper>
                ) : (
                    <Typography variant="body2" sx={{ color: grey[600] }}>
                        点击节点查看详情
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default KnowledgeMap;
