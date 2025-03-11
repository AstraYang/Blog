import { useState, useEffect } from "react";
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
import MDEditor from "@uiw/react-md-editor"; // Markdown 编辑器
import { useNavigate } from "react-router-dom"; // 路由跳转
import { fetchCategories } from "../../../api/category.js";
import { fetchTags, uploadCoverImage, submitArticle } from "../../../api/articles";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {getCurrentUser} from "../../../api/User.js"; // 引入 API


const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "2px", // 调整初始位置
                },
                shrink: {
                    top: "-5px", // 调整缩小后的位置
                    // left: "10px", // 调整水平位置
                    // fontSize: "0.8rem", // 缩小后的字体大小
                },
            },
        },
    },
});
export default function MarkdownEditor() {
    const navigate = useNavigate(); // 路由跳转

    // 表单数据状态
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [tags, setTags] = useState([]);
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState(""); // Markdown 内容
    const [coverImage, setCoverImage] = useState(null); // 封面图片文件
    const [previewImage, setPreviewImage] = useState(null); // 预览图片
    const [isStatus, setIsStatus] = useState(true); // 是否允许发布
    const [isComment, setIsComment] = useState(true); // 是否允许评论

    // 分类和标签数据
    const [categories, setCategories] = useState([]);
    const [tagsList, setTagsList] = useState([]);

    // 初始化：获取分类和标签数据
    useEffect(() => {
        const fetchData = async () => {
            try {
                const categoriesData = await fetchCategories(); // 获取分类数据
                const tagsData = await fetchTags(); // 获取标签数据
                setCategories(categoriesData);
                setTagsList(tagsData);
            } catch (error) {
                console.error("初始化数据失败:", error);
            }
        };
        fetchData();
    }, []);

    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

            let author = await getCurrentUser().id;
            // 上传封面图片
            let coverImagePath = "";
            if (coverImage) {
                coverImagePath = await uploadCoverImage(coverImage);
            }

            // 准备提交的数据
            const articleData = {
                title,
                categoryId,
                tags,
                summary,
                content,
                author: author,
                coverImage: coverImagePath,
                is_status: isStatus,
                is_comment: isComment,
            };

            // 提交文章
            await submitArticle(articleData);
            alert("文章添加成功！");
            navigate("/admin"); // 跳转到文章列表页
        } catch (error) {
            console.error("提交文章失败:", error); // 记录错误日志
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
        <ThemeProvider theme={theme}>
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            {/* 返回按钮 */}
            {/*<IconButton onClick={() => navigate("/dashboard")} sx={{ mb: 2 }}>*/}
            {/*    <ArrowBackIcon />*/}
            {/*</IconButton>*/}

            <Grid container spacing={4}>
                {/* 左侧内容区 */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                        <TextField
                            label="标题"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <Divider sx={{ mb: 2 }} />

                        {/* Markdown 编辑器 */}
                        <Typography variant="h6" gutterBottom>
                            内容编辑
                        </Typography>
                        <MDEditor
                            value={content}
                            onChange={setContent}
                            height={500}
                            style={{ marginBottom: "16px" }}
                        />
                    </Paper>
                </Grid>

                {/* 右侧设置区 */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={3} sx={{ p: 3, display: "flex", flexDirection: "column", height: "100%" }}>
                        {/* 封面图片 */}
                        <Typography variant="h6" gutterBottom>
                            封面图片
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 2, textAlign: "center" }}>
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="封面预览"
                                    style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px" }}
                                />
                            ) : (
                                <Typography variant="body2" color="textSecondary">
                                    尚未选择图片
                                </Typography>
                            )}
                            <Button variant="contained" component="label">
                                上传封面图片
                                <input type="file" accept="image/*" hidden onChange={handleCoverImageChange} />
                            </Button>
                        </Box>

                        {/* 发布设置 */}
                        <Typography variant="h6" gutterBottom>发布设置</Typography>
                        <Divider sx={{ mb: 3 }} />
                        <FormControl fullWidth sx={{ mb: 3 }}>
                            <InputLabel>分类</InputLabel>
                            <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} label="分类">
                                {categories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>
                                        {category.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ mb: 5 }}>
                            <InputLabel>标签</InputLabel>
                            <Select multiple value={tags} onChange={(e) => setTags(e.target.value)} label="标签">
                                {tagsList.map((tag) => (
                                    <MenuItem key={tag.id} value={tag.id}>
                                        {tag.tagName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="摘要"
                            fullWidth
                            value={summary}
                            onChange={(e) => setSummary(e.target.value)}
                            multiline
                            rows={1}
                            sx={{ mb: 2 }}
                        />

                        <FormControlLabel
                            control={<Checkbox checked={isStatus} onChange={(e) => setIsStatus(e.target.checked)} />}
                            label="允许发布"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={isComment} onChange={(e) => setIsComment(e.target.checked)} />}
                            label="允许评论"
                        />

                        <Button variant="contained" color="primary" fullWidth sx={{ mt: "auto" }} onClick={handleSubmit}>
                            提交文章
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
        </ThemeProvider>
    );
}
