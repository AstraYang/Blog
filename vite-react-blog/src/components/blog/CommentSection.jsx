import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {Box, Typography, TextField, Button, Grid, IconButton, Pagination} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useParams } from "react-router-dom";
import { fetchCommentsById, fetchReplies, submitComment } from "../../api/comments.js";
import CommentItem from "./CommentItem";

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

const CommentSection = () => {
    const { articleId } = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [website, setWebsite] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [renovate, setRenovate] = useState(false);
    const [expandedReplies, setExpandedReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const commentPerPage = 4;


    useEffect(() => {
        const loadComments = async (page) => {
            try {
                const response = await fetchCommentsById(articleId, page, commentPerPage);
                setComments(response.data.records);
                setTotalPages(response.data.pages);

            } catch (error) {
                console.error('评论加载错误:', error);
            }
        };
        loadComments(currentPage);

        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfoData = JSON.parse(userInfoString);
            if (userInfoData) {
                setUsername(userInfoData.nickName || ""); // 设置昵称
                setEmail(userInfoData.email || ""); // 设置邮箱
            }
        }
    }, [currentPage, renovate]);

    const handleCommentSubmit = async () => {
        if (newComment.trim() && username.trim() && email.trim()) {
            const newCommentObj = {
                articleId: articleId,
                username,
                email,
                website,
                content: newComment,
                parentId: null,
            };

            try {
                const response = await submitComment(newCommentObj);
                setComments((prevComments) => [...prevComments, response.data]);
                resetInput();
                setRenovate(!renovate);
            } catch (error) {
                console.error('提交评论失败:', error);
            }
        }
    };


    const handleReplySubmit = (replyObj) => {
        const parentComment = comments.find(comment => comment.id === replyObj.parentId);
        const mainCommentId = parentComment?.parentId || replyObj.parentId;

        const updatedReplyObj = {
            ...replyObj,
            parentId: mainCommentId,
        };

        submitComment(updatedReplyObj)
            .then(response => {
                setComments([...comments, response.data]);
                setComments(prevComments =>
                    prevComments.map(comment =>
                        comment.id === mainCommentId ? { ...comment, replyCount: comment.replyCount + 1 } : comment
                    )
                );
            })
            .catch(error => {
                console.error('提交回复失败:', error);
            });
    };

    const resetInput = () => {
        setNewComment("");
        setUsername("");
        setEmail("");
        setWebsite("");
        setShowEmojiPicker(false);
    };

    const addEmoji = (emoji) => {
        setNewComment((prev) => prev + emoji.native);
        setShowEmojiPicker(false);
    };

    const toggleReplies = async (commentId) => {
        if (expandedReplies[commentId]) {
            setExpandedReplies(prev => ({ ...prev, [commentId]: false }));
        } else {
            const replies = await fetchReplies(commentId, 1, 10);
            setExpandedReplies(prev => ({ ...prev, [commentId]: true, [`${commentId}_replies`]: replies.data.records }));
        }
    };

    const renderComments = (parentId = null) => {
        return comments
            .filter(comment => comment.parentId === parentId)
            .map(comment => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReplySubmit}
                    expandedReplies={expandedReplies}
                    toggleReplies={toggleReplies}
                    renderComments={renderComments}
                    replyingTo={replyingTo}
                    setReplyingTo={setReplyingTo}
                />
            ));
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    return (
        <ThemeProvider theme={theme}>
            <Box>
                <Typography variant="h5" component="h2" gutterBottom>
                    评论区
                </Typography>

                <Box mt={2} position="relative">
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="昵称"
                                variant="outlined"
                                fullWidth
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="邮箱"
                                variant="outlined"
                                fullWidth
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <TextField
                                label="网址（可选）https://..."
                                variant="outlined"
                                fullWidth
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ position: "relative", mt: 2 }}>
                        <TextField
                            label="写下你的评论"
                            variant="outlined"
                            multiline
                            fullWidth
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        sx={{ position: "absolute", right: 8, bottom: 8 }}
                                    >
                                        <InsertEmoticonIcon />
                                    </IconButton>
                                )
                            }}
                        />

                        {showEmojiPicker && (
                            <Box sx={{
                                position: "absolute",
                                bottom: "100%",
                                right: 0,
                                zIndex: 1300,
                                transform: "translateY(-10px)",
                                boxShadow: 3,
                            }}>
                                <Picker
                                    data={data}
                                    onEmojiSelect={addEmoji}
                                    theme="light"
                                />
                            </Box>
                        )}
                    </Box>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCommentSubmit}
                        sx={{ mt: 2 }}
                    >
                        提交
                    </Button>
                </Box>

                <Box mt={2}>
                    {comments.length > 0 ? (
                        renderComments()
                    ) : (
                        <Typography color="textSecondary">暂无评论</Typography>
                    )}
                </Box>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}
                />
            </Box>
        </ThemeProvider>
    );
};

CommentSection.propTypes = {
    articleId: PropTypes.string.isRequired,
};

export default CommentSection;
