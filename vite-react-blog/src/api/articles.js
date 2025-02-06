import axios from 'axios';

/**
 * 获取文章列表
 * @param {number} page 当前页码
 * @param {number} size 每页记录数
 * @param {number|null} categoryId 分类 ID，如果为 null 则不筛选分类
 * @returns {Promise} 包含文章列表数据的 Promise 对象
 */
const API_BASE_URL = 'http://localhost:8080/admin/articles';

export const fetchArticles = async (page, size, categoryId = null) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/articles`, {
            params: {
                page,
                size,
                categoryId,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};
