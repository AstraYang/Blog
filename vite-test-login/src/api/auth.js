import axios from "axios";


const API_BASE_URL = 'http://localhost:8080/admin/user';
export const login = async (username, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { username, password },
            { withCredentials: true } // 允许携带 Cookie
        );
        return response.data; // 返回登录结果
    } catch (error) {
        console.error('登录失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
};

export const logout = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/logout`, {
            withCredentials: true, // 确保携带 Cookie
        });
        return response.data; // 返回后端响应
    } catch (error) {
        console.error('退出登录失败:', error.response ? error.response.data : error.message);
        throw error;
    }
};
