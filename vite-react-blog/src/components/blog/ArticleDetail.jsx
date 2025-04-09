import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, CircularProgress, Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import CommentSection from "./CommentSection.jsx";
import { getArticleDetail } from "../../api/articles.js";
import TableOfContents from "./TableOfContents.jsx";

marked.use(markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'shell';
        return hljs.highlight(code, { language }).value;
    }
}));

const ArticleDetail = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState({ content: "" });
    const [htmlContent, setHtmlContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const fetchedArticle = await getArticleDetail(articleId);
                if (fetchedArticle) {
                    let localCounter = 1;
                    const customMarked = marked
                        .use({
                            renderer: {
                                heading({ text, depth }) {
                                    const id = `heading-${localCounter++}`;
                                    return `<h${depth} id="${id}">${text}</h${depth}>`;
                                }
                            }
                        });

                    const parsedHtml = customMarked(fetchedArticle.content);
                    setHtmlContent(parsedHtml);
                    setArticle({
                        id: fetchedArticle.id,
                        title: fetchedArticle.title,
                        updatedTime: fetchedArticle.updateAt,
                        views: fetchedArticle.views,
                        content: fetchedArticle.content,
                        allowComments: fetchedArticle.comment,
                    });
                } else {
                    console.error("未获取到文章数据");
                }
            } catch (error) {
                console.error("获取文章失败：", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
        console.log("文章ID：", articleId);
    }, [articleId]);

    useEffect(() => {
        if (article.content) {
            const htmlContent = marked(article.content);
            console.log(htmlContent);
        }
    }, [article.content]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!article) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="textSecondary">
                    文章未找到
                </Typography>
            </Box>
        );
    }

    return (
        <Card>
            <CardHeader
                title={article.title}
                subheader={`${new Date(article.updatedTime).toLocaleString()} / ${article.views} 阅读`}
                sx={{
                    "& .MuiCardHeader-title": {
                        textAlign: "center",
                        fontSize: "2rem",
                        fontWeight: "bold",
                    },
                    "& .MuiCardHeader-subheader": {
                        textAlign: "left",
                        fontSize: "0.8rem",
                        color: "gray",
                    },
                }}
            />
            <Divider />
            <CardContent>
                <TableOfContents content={htmlContent} />
                {/* 文章内容（Markdown 格式渲染） */}
                <Box
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                    sx={{
                        "& h1": { fontSize: "1.5rem", fontWeight: "bold" },
                        "& h2": { fontSize: "1.25rem", fontWeight: "bold" },
                        "& p": { marginBottom: "1rem" },
                        "& code": {
                            background: "#b0dbef",
                            color: "#027cb5",
                            padding: "0.2rem",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                        },
                        "& pre": {
                            background: "#242424",
                            color: "#ffffff",
                            padding: "1rem",
                            borderRadius: "8px",
                            overflowX: "auto",
                            position: "relative", // 确保按钮定位正确
                        },
                        "& pre code": {
                            background: "none",
                            color: "inherit",
                            fontSize: "inherit",
                        },
                        "& img": {
                            maxWidth: "100%", // 图片最大宽度为 100%
                            height: "auto",   // 高度自动调整
                            display: "block", // 使图片为块级元素，便于居中
                            margin: "0 auto"  // 图片居中
                        },
                        "& ul": {
                            listStyleType: "disc", // 列表标记类型
                            paddingLeft: "20px", // 左侧内边距
                            marginBottom: "1rem", // 列表底部外边距
                        },
                        "& li": {
                            marginBottom: "0.5rem", // 列表项的底部外边距
                        },
                        "& table": {
                            width: "100%", // 表格宽度占满父容器
                            borderCollapse: "collapse", // 合并边框
                            marginBottom: "1rem", // 表格底部外边距
                        },
                        "& th, & td": {
                            border: "1px solid #ccc", // 表格单元格边框
                            padding: "8px", // 内边距
                            textAlign: "left", // 左对齐
                        },
                        "& th": {
                            backgroundColor: "#7886a2", // 表头背景色
                            fontWeight: "bold", // 表头加粗
                        },
                    }}
                />
                <Divider sx={{ my: 4 }} />
                {/* 评论区 */}
                {article.allowComments === true ? (
                    <CommentSection articleId={articleId} />
                ) : (
                    <Typography variant="body1" color="textSecondary">
                        该文章已关闭评论
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default ArticleDetail;
