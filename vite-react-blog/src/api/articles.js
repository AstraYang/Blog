import axios from 'axios';

/**
 * 获取文章列表
 * @param {number} page 当前页码
 * @param {number} size 每页记录数
 * @param {number|null} categoryId 分类 ID，如果为 null 则不筛选分类
 * @returns {Promise} 包含文章列表数据的 Promise 对象
 */
const API_BASE_URL = 'http://localhost:8080';

    export const fetchArticles = async (page, size, categoryId = null) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/articles/articles`, {
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

// 管理文章列表
export const fetchArticleManagementList =async (page, size, userFilter, publishFilter) =>{
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/articles/articleList`, {
            params: {
                page,
                size,
                userFilter,
                publishFilter,
            },
        });
        console.log("API请求文章列表：", response.data);
        return response.data;
    } catch (error) {
        console.error('请求出错', error);
        throw error; // 可以抛出错误以供调用者处理
    }
};
// 获取文章详情的函数
export const getArticleDetail = async (articleId) => {
    console.log("获取文章详情的函数"+ articleId);
    try {
        // 发送 GET 请求到后端 API
        const response = await axios.get(`${API_BASE_URL}/admin/articles/article/${articleId}`);

        // 检查返回的数据结构
        if (response.data.code === 200) {
            console.log("文章详情：", response.data.data);
            return response.data.data; // 返回文章详情
        } else {
            console.error("请求失败：", response.data.message);
            return null;
        }
    } catch (error) {
        console.error("请求出错：", error);
        return null;
    }
};

//获取文章所有数据
export const fetchArticleById = async (articleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/articles/fetch/${articleId}`);
        return response.data.data; // 返回文章数据
    } catch (error) {
        console.error("API获取文章数据失败:", error);
        throw error;
    }
};

export const fetchCategories = async () => {
    try {
        console.log("API_BASE_URL:", API_BASE_URL);
        const response = await axios.get(`${API_BASE_URL}/admin/category/list`);
        console.log("分类列表：", response.data.data)
        return response.data.data; // 返回分类数据
    } catch (error) {
        console.error("API获取分类列表失败:", error);
        throw error;
    }
};

// 获取标签列表
export const fetchTags = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/tags/list`);
        return response.data.data; // 返回标签数据
    } catch (error) {
        console.error("API获取标签列表失败:", error);
        throw error;
    }
};

//获取文章标签
export const fetchArticleTags = async (articleId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/tags/article/${articleId}`);
        return response.data.data; // 返回标签数据
    } catch (error) {
        console.error("API获取文章标签列表失败:", error);
        throw error;
    }
};

// 上传封面图片
export const uploadCoverImage = async (coverImage) => {
    try {
        const formData = new FormData();
        formData.append("image", coverImage); // 将图片文件添加到 FormData 中

        const response = await axios.post(`${API_BASE_URL}/admin/uploads/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data.data; // 返回图片路径
    } catch (error) {
        console.error("上传封面图片失败:", error);
        throw error;
    }
};

// 提交文章
export const submitArticle = async (articleData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/articles/add`, articleData);
        return response.data; // 返回提交成功的响应
    } catch (error) {
        console.error("文章提交失败:", error.response ? error.response.data : error.message);
        throw error;
    }
};

// 修改文章
export const upDateArticle = async (articleData,articleId) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/admin/articles/upDate/${articleId}`, articleData);
        return response.data; // 返回提交成功的响应
    } catch (error) {
        console.error("文章提交失败:", error.response ? error.response.data : error.message);
        throw error;
    }
};

//删除文章（软删除）
export const deleteArticlesSoft = async (articleIds, del) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/admin/articles/delete/soft`, {
            data: {
                ids:articleIds,
                del:del
            },
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('删除成功:', response.data);
    } catch (error) {
        console.error('删除失败:', error);
    }
};



