import axios from 'axios';



const API_BASE_URL = 'http://localhost:8080/comments';

export const fetchCommentsById = async (articleId, page, size,) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public/getComments/${articleId}`, {
            params: {
                page,
                size,
            },
            withCredentials: true
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
        const response = await axios.get(`${API_BASE_URL}/public/getReplies/${parentId}`, {
            params: {
                page,
                size,
            },
            withCredentials: true
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
        const response = await axios.post(`${API_BASE_URL}/save`, commentData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('请求评论时发生错误:', error);
        throw error;
    }
}

export const fetchComments = async (page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getCommentList`, {
            params: {
                page,
                size,
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        if (response.data.code === 200) {
            console.log("API获取评论成功:", response.data);
            return response.data;
        }
    } catch (error) {
        console.error("获取评论失败:", error);
    }
};

//获取评论总数
export const fetchCommentCount = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/count`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log("获取评论总数成功:", response.data);
        return response.data; // 返回获取到的文献列表
    } catch (error) {
        console.error("获取文献列表失败:", error.response ? error.response.data : error.message);
    }
}

export const deleteComments = async (commentIds) =>{
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete`,{
            data: commentIds,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log('删除成功:', response.data);
        return response.data;
    }catch (error) {
        console.error('删除评论失败:', error);
    }


}


