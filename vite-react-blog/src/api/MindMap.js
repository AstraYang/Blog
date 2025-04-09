import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/map';

/**
 * 获取分页的 MindMap 列表
 * @param {number} page - 当前页码
 * @param {number} size - 每页显示的数量
 * @returns {Promise<object>} - 返回一个 Promise，解析为 MindMap 列表数据
 */
export const fetchMindMaps = async (page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public/list`, {
            params: {
                page,
                size,
            },
            withCredentials: true
        });
        console.log("API请求MindMap列表：", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

/**
 * 获取分页的 MindMap 管理列表
 * @param {number} uId - 当前登陆用户的 ID
 * @param {number} page - 当前页码
 * @param {number} size - 每页显示的数量
 * @returns {Promise<object>} - 返回一个 Promise，解析为 MindMap 列表数据
 */
export const fetchMindMapManagementList = async (uId, page, size) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/admin/list`, {
            params: {
                uId,
                page,
                size,
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log("API请求MindMap列表：", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};


export const fetchMindMapByKeyword = async (page, size, keyword,uId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public/search/page`, {
            params: {
                page,
                size,
                keyword,
                uId
            },
            withCredentials: true
        });
        console.log("API请求MindMap列表：", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }
}


export const fetchMindMapById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/public/getMindMapById/${id}`,{
            withCredentials: true
        });
        console.log("API请求MindMap详情：", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};



//添加MindMap
export const createMindMap = async (mindMapData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, mindMapData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log("API请求添加MindMap：", response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};

//删除MindMap
export const deleteMindMaps = async (ids) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete`, {
            data: ids,
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



// 修改MindMap
export const updateMindMap = async (mindMapData,id) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/update/${id}`, mindMapData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log("API请求修改MindMap：", response.data);

        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        throw error; // 抛出错误以便调用者处理
    }
};


