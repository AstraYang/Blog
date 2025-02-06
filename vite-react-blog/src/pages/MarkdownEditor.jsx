import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Container,
    TextField,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Box,
    Grid,
    Paper,
    Divider,
    IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // 导入返回箭头图标
import MDEditor from "@uiw/react-md-editor"; // 使用带工具栏的 Markdown 编辑器组件
import { useNavigate } from "react-router-dom"; // 路由跳转

const API_BASE_URL = "http://localhost:8080"; // 后端 API 地址

const MarkdownEditor = () => {
    const navigate = useNavigate(); // 路由跳转
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(""); // Markdown 内容
    const [coverImage, setCoverImage] = useState(null); // 封面图片文件
    const [previewImage, setPreviewImage] = useState(null); // 预览图片
    const [isStatus, setIsStatus] = useState(true);
    const [isComment, setIsComment] = useState(true);

    const [categories, setCategories] = useState([]); // 分类列表
    const [tagsList, setTagsList] = useState([]); // 标签列表

    // 获取分类和标签数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesResponse = await axios.get(
                    `${API_BASE_URL}/admin/category/list`
                );
                const tagsResponse = await axios.get(`${API_BASE_URL}/admin/tags/list`);
                setCategories(categoriesResponse.data.data);
                setTagsList(tagsResponse.data.data);
            } catch (error) {
                console.error("获取数据失败:", error);
            }
        };
        fetchData();
    }, []);

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // 上传封面图片并获取路径
            let coverImagePath = "";
            if (coverImage) {
                const formData = new FormData();
                formData.append("image", coverImage); // 将图片文件添加到 FormData 中

                const response = await axios.post(`${API_BASE_URL}/admin/uploads/image`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                coverImagePath = response.data.data; // 获取返回的图片路径
            }

            // 提交文章数据
            const articleData = {
                title,
                categoryId,
                tags,
                summary,
                content,
                coverImage: coverImagePath, // 使用服务器返回的图片路径
                is_status: isStatus,
                is_comment: isComment,
            };

            const response = await axios.post(
                `${API_BASE_URL}/admin/articles/add`,
                articleData
            );
            console.log("文章添加成功:", response.data);
            alert("文章添加成功！");
            navigate("/dashboard"); // 跳转到文章列表页
        } catch (error) {
            console.error(
                "文章添加失败:",
                error.response ? error.response.data : error.message
            );
            alert("文章添加失败，请重试！");
        }
    };

    // 处理封面图片选择
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file); // 保存图片文件
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 设置预览图片
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            {/* 返回按钮 */}
            <IconButton onClick={() => navigate("/dashboard")} sx={{ mb: 2 }}>
                <ArrowBackIcon />
            </IconButton>

            <Grid container spacing={4}>
                {/* 左侧内容区域 */}
                <Grid item xs={12} md={8}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}
                    >
                        {/* 标题输入 */}
                        <TextField
                            label="标题"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        {/* 显示文章链接模板（不可编辑） */}
                        <Box sx={{ mb: 2, color: "gray" }}>
                            <Typography variant="body2">
                                文章链接：blog.struct.fun/archives/{"{cid}"}
                            </Typography>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Markdown 编辑器 */}
                        <Typography variant="h6" gutterBottom>
                            内容编辑
                        </Typography>
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            height={500} // 设置编辑器高度
                            style={{ marginBottom: "16px" }}
                        />
                    </Paper>
                </Grid>

                {/* 右侧设置区域 */}
                <Grid item xs={12} md={4}>
                    <Paper
                        elevation={3}
                        sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}
                    >
                        {/* 添加封面图片 */}
                        <Typography variant="h6" gutterBottom>
                            封面图片
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box
                            sx={{
                                mb: 2,
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="封面预览"
                                    style={{
                                        width: "100%",
                                        height: "200px",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        marginBottom: "8px",
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    尚未选择图片
                                </Typography>
                            )}
                            <Button variant="contained" component="label">
                                上传封面图片
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleCoverImageChange}
                                />
                            </Button>
                        </Box>

                        {/* 分类 */}
                        <Typography variant="h6" gutterBottom>
                            发布设置
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>分类</InputLabel>
                            <Select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                label="分类"
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 标签 */}
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>标签</InputLabel>
                            <Select
                                multiple
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                label="标签"
                            >
                                {tagsList.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        {tag.tagName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* 摘要 */}
                        <TextField
                            label="摘要"
                            fullWidth
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            multiline
                            rows={3}
                            sx={{ mb: 2 }}
                        />

                        {/* 权限设置 */}
                        <Typography variant="subtitle1" gutterBottom>
                            权限设置
                        </Typography>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isStatus}
                                    onChange={(e) => setIsStatus(e.target.checked)}
                                />
                            }
                            label="允许发布"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isComment}
                                    onChange={(e) => setIsComment(e.target.checked)}
                                />
                            }
                            label="允许评论"
                        />

                        {/* 提交按钮 */}
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: "auto" }}
                            onClick={handleSubmit}
                        >
                            提交文章
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default MarkdownEditor;
