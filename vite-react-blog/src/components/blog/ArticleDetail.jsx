import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, CircularProgress, Divider, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { marked } from "marked";
import hljs from "highlight.js"; // 引入 highlight.js
import "highlight.js/styles/github-dark.css"; // 引入代码高亮样式
import CommentSection from "./CommentSection.jsx";
import { getArticleDetail } from "../../api/articles.js"; // 引入 API 请求方法

// 配置 marked 使用 highlight.js 进行代码高亮
marked.setOptions({
    headerIds: true,
    headerPrefix: "header-",
    highlight: (code, language) => {
        const validLanguage = hljs.getLanguage(language) ? language : "plaintext";
        return hljs.highlight(code, { language: validLanguage, ignoreIllegals: true }).value;
    },
    sanitize: false, // 确保 Markdown 中的 HTML 被正确渲染
    smartypants: false,
    breaks: true,
});

const ArticleDetail = () => {
    const { articleId } = useParams(); // 从路由中获取文章 ID
    const [article, setArticle] = useState({ content: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                const fetchedArticle = await getArticleDetail(articleId);
                if (fetchedArticle) {
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

    // 为每个代码块增加一键复制逻辑
    useEffect(() => {
        if (article.content) {
            const codeBlocks = document.querySelectorAll("pre code");
            codeBlocks.forEach((block) => {
                // 移除已有的高亮样式
                block.classList.remove("hljs");

                // 确保代码块的内容不会被错误地解析为 HTML 标签
                const originalCode = block.innerText;

                // 转义 < 和 >，确保不会被解析为 HTML 标签
                block.innerHTML = originalCode
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");

                // 使用 highlight.js 重新高亮代码块
                hljs.highlightElement(block);

                // 为代码块添加按钮容器
                const preElement = block.parentNode; // 找到 <pre> 元素
                if (!preElement.querySelector(".copy-button")) {
                    const copyButton = document.createElement("button");
                    copyButton.innerText = "复制";
                    copyButton.className = "copy-button";
                    copyButton.style.cssText =
                        "position: absolute; top: 8px; right: 8px; background: #616161; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer; z-index: 10;";
                    copyButton.addEventListener("click", () => {
                        navigator.clipboard.writeText(block.innerText).then(
                            () => {
                                copyButton.innerText = "已复制";
                                setTimeout(() => {
                                    copyButton.innerText = "复制";
                                }, 2000);
                            },
                            (err) => {
                                console.error("复制失败：", err);
                            }
                        );
                    });
                    preElement.style.position = "relative"; // 确保按钮位置正确
                    preElement.appendChild(copyButton);
                }
            });
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
                {/* 文章内容（Markdown 格式渲染） */}
                <Box
                    dangerouslySetInnerHTML={{ __html: marked(article.content) }}
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
