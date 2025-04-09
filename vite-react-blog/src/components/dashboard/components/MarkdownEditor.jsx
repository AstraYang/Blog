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
} from "@mui/material";
import MDEditor from "@uiw/react-md-editor";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCategories } from "../../../api/category.js";
import {uploadCoverImage, submitArticle, fetchArticleById, upDateArticle} from "../../../api/articles.js"; // 文章 API
import { fetchTags } from "../../../api/tags.js";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {message} from "antd";

const theme = createTheme({
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    top: "2px",
                },
                shrink: {
                    top: "-5px",
                },
            },
        },
    },
});

export default function MarkdownEditor() {
    const navigate = useNavigate(); // 路由跳转
    const { articleId } = useParams(); // 获取路由参数中的 articleId

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

                // 如果 articleId 存在，获取文章信息
                if (articleId) {
                    const articleData = await fetchArticleById(articleId); // 获取要编辑的文章
                    if (articleData) {
                        setTitle(articleData.title);
                        setCategoryId(articleData.categoryId);
                        setTags(articleData.tags || []); // 确保 tags 是数组
                        setSummary(articleData.summary);
                        setContent(articleData.content);
                        setIsStatus(articleData.status);
                        setIsComment(articleData.comment);

                        // 设置封面图片
                        const coverImageUrl = articleData.coverImage; // 确保这个 URL 是有效的
                        setCoverImage(coverImageUrl);
                        setPreviewImage(coverImageUrl);
                    }
                }
            } catch (error) {
                console.error("初始化数据失败:", error);
                message.success('加载数据失败，请重试！');
            }
        };
        fetchData();
    }, [articleId]); // 依赖于 articleId


    // 提交表单
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userInfo = localStorage.getItem('userInfo');
            const author = JSON.parse(userInfo).id;

            // 上传封面图片：仅在用户选择了新图片时才进行上传
            let coverImagePath = "";
            if (coverImage && typeof coverImage === "object") {
                // 只有当 coverImage 是一个文件对象时，才上传图片
                coverImagePath = await uploadCoverImage(coverImage);
            } else if (coverImage && typeof coverImage === "string") {
                // 如果 coverImage 是一个字符串，意味着用户没有更新图片，直接使用现有的 URL
                coverImagePath = coverImage;
            }

            // 准备提交的数据
            const articleData = {
                title,
                categoryId,
                tags,
                summary,
                content,
                author,
                coverImage: coverImagePath, // 传递图片路径（如果有）
                status: isStatus,
                comment: isComment,
            };

            // 根据 articleId 的存在决定是创建还是更新
            if (articleId) {
                // 更新文章
                await upDateArticle(articleData, articleId); // 假设 upDateArticle 支持更新
                message.success('文章更新成功');

                navigate("/admin/articles"); // 跳转到文章列表页

            } else {
                // 创建新文章
                await submitArticle(articleData);
                message.success('文章添加成功');

                navigate("/admin"); // 跳转到文章列表页
            }

        } catch (error) {
            console.error("提交文章失败:", error); // 记录错误日志
            message.error('提交文章失败', error);

        }
    };


    // 处理封面图片选择
    const handleCoverImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImage(file); // 保存图片文件
            console.log('图片:',  setCoverImage)
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result); // 设置预览图片
                console.log('图片文件::',  setPreviewImage)
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="lg" sx={{ py: 7 }}>
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
                                <Select
                                    multiple
                                    value={tags} // 确保这是一个数组
                                    onChange={(e) => setTags(Array.from(e.target.value))} // 确保将值转换为数组
                                    label="标签"
                                >
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
                                {articleId ? "更新文章" : "提交文章"}
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}
