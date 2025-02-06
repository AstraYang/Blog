import axios from 'axios';

/**
 * 获取分类列表
 * @returns {Promise} 包含分类列表数据的 Promise 对象
 */
const API_BASE_URL = 'http://localhost:8080/admin/category';
export const fetchCategories = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/list`);
        // 假定返回的数据结构为 { data: [{ categoryId: 1, categoryName: 'Tech' }, {...}] }
        return response.data;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        throw error;
    }
};
