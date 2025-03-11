import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Typography, TextField, Button, Paper, Grid, IconButton, Divider, Avatar } from "@mui/material";
import InsertEmoticonIcon from "@mui/icons-material/InsertEmoticon";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useParams } from "react-router-dom";

const CommentItem = ({ comment, onReply, expandedReplies, toggleReplies, renderComments, replyingTo, setReplyingTo }) => {
    const { articleId } = useParams();
    const [newComment, setNewComment] = useState("");
    const [replyUsername, setReplyUsername] = useState("");
    const [replyEmail, setReplyEmail] = useState("");
    const [replyWebsite, setReplyWebsite] = useState("");
    const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);

    const handleReplySubmit = (commentId, parentId) => {
        if (newComment.trim() && replyUsername.trim() && replyEmail.trim()) {
            const replyObj = {
                articleId: articleId,
                username: replyUsername,
                email: replyEmail,
                website: replyWebsite,
                content: newComment,
                parentId: parentId ? parentId : commentId,
            };
            onReply(replyObj);
            setNewComment("");
            setReplyUsername("");
            setReplyEmail("");
            setReplyWebsite("");
            setReplyingTo(null);
        }
    };

    const addReplyEmoji = (emoji) => {
        setNewComment((prev) => prev + emoji.native);
        setShowReplyEmojiPicker(false);
    };

    const handleReplyClick = (commentId) => {
        if (replyingTo === commentId) {
            setReplyingTo(null);
        } else {
            setReplyingTo(commentId);
            setNewComment(`@${comment.username} `);
        }
    };

    return (
        <Paper key={comment.id} sx={{ padding: 2, marginBottom: 2, display: 'flex', alignItems: 'flex-start' }}>
            <Avatar src={comment.avatarUrl} alt="头像" sx={{ width: 40, height: 40, marginRight: 2 }} />
            <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                    {comment.website ? (
                        <a href={comment.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
                            {comment.username}
                        </a>
                    ) : (
                        comment.username
                    )}
                </Typography>
                <Divider sx={{ my: 1, backgroundColor: '#4a4f4f', height: 1 }} />
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 1,
                    backgroundColor: 'rgba(185,222,239,0.44)',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    p: 3
                }}>
                    <Typography variant="body1">{comment.content}</Typography>
                </Box>
                <Typography variant="caption" color="textSecondary" sx={{ display: 'block', marginTop: 1 }}>
                    {comment.createdAt}
                    <Button
                        size="small"
                        onClick={() => handleReplyClick(comment.id)}
                    >
                        回复
                    </Button>
                    {comment.replyCount > 0 && (
                        <Button
                            size="small"
                            onClick={() => toggleReplies(comment.id)}
                        >
                            {expandedReplies[comment.id] ? '收起回复' : `查看${comment.replyCount}条回复`}
                        </Button>
                    )}
                </Typography>

                {replyingTo === comment.id && (
                    <Box sx={{ mt: 2, position: "relative" }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="昵称"
                                    variant="outlined"
                                    fullWidth
                                    value={replyUsername}
                                    onChange={(e) => setReplyUsername(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="邮箱"
                                    variant="outlined"
                                    fullWidth
                                    value={replyEmail}
                                    onChange={(e) => setReplyEmail(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    label="网址（可选）"
                                    variant="outlined"
                                    fullWidth
                                    value={replyWebsite}
                                    onChange={(e) => setReplyWebsite(e.target.value)}
                                />
                            </Grid>
                        </Grid>

                        <TextField
                            label={`回复 @${comment.username}`}
                            variant="outlined"
                            multiline
                            fullWidth
                            rows={3}
                            value={newComment}
                            sx={{ marginTop: 2 }}
                            onChange={(e) => setNewComment(e.target.value)}
                            InputProps={{
                                endAdornment: (
                                    <IconButton
                                        onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                                        sx={{ position: "absolute", right: 8, bottom: 8 }}
                                    >
                                        <InsertEmoticonIcon />
                                    </IconButton>
                                )
                            }}
                        />

                        {showReplyEmojiPicker && (
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
                                    onEmojiSelect={addReplyEmoji}
                                    theme="light"
                                />
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleReplySubmit(comment.id, comment.parentId)}
                            sx={{ mt: 1 }}
                        >
                            提交回复
                        </Button>
                    </Box>
                )}

                {expandedReplies[comment.id] && (
                    <Box sx={{
                        marginLeft: { xs: 0, sm: 4 }, // 手机端下不缩进，PC 端下缩进
                    }}>
                        {expandedReplies[`${comment.id}_replies`]?.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                onReply={onReply}
                                expandedReplies={expandedReplies}
                                toggleReplies={toggleReplies}
                                renderComments={renderComments}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                            />
                        ))}
                    </Box>
                )}

                <Box sx={{
                    marginLeft: { xs: 0, sm: 4 }, // 手机端下不缩进，PC 端下缩进
                }}>
                    {renderComments(comment.id)}
                </Box>
            </Box>
        </Paper>
    );
};

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired,
    onReply: PropTypes.func.isRequired,
    expandedReplies: PropTypes.object.isRequired,
    toggleReplies: PropTypes.func.isRequired,
    renderComments: PropTypes.func.isRequired,
    replyingTo: PropTypes.number,
    setReplyingTo: PropTypes.func.isRequired,
};

export default CommentItem;