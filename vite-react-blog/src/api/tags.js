import axios from 'axios';

/**
 * 获取分类列表
 * @returns {Promise} 包含分类列表数据的 Promise 对象
 */
const API_BASE_URL = 'http://localhost:8080/admin/tags';
export const fetchTags = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/list`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};

export const createTag = async (tagName) => {
    try {
        const formData = new URLSearchParams();
        formData.append("tagName", tagName);

        const response = await axios.post(`${API_BASE_URL}/add`, formData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // 设置请求头为表单格式
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        return response.data;
    } catch (error) {
        console.error('Failed to create category:', error);
        throw error;
    }
};

export const deleteTags = async (categoryIds) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete`, {
            data: categoryIds,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log('删除成功:', response.data);
    } catch (error) {
        console.error('删除失败:', error);
    }
};
