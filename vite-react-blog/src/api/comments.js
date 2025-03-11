import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/comments';

export const fetchComments = async (articleId, page, size,) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getComments/${articleId}`, {
            params: {
                page,
                size,
            },
        });
        if (response.data.code === 200) {
            console.log("API获取评论成功:", response.data);
            return response.data;
        }
    } catch (error) {
        console.error("获取评论失败:", error);
    }
};

export const fetchReplies = async (parentId, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getReplies/${parentId}`, {
            params: {
                page,
                size,
            },
        });
        if (response.data.code === 200) {
            console.log("API获取评论成功:", response.data);
            return response.data;
        }
    }catch (error){
        console.error("获取评论失败:", error);
    }
};

export const submitComment = async (commentData) =>{
    try {
        // 发送 POST 请求到 /comments/save
        const response = await axios.post(`${API_BASE_URL}/save`, commentData);
        return response.data;
    } catch (error) {
        console.error('请求评论时发生错误:', error);
        throw error;
    }
}