import axios  from "axios";

const API_BASE_URL = 'http://localhost:8080/stats';

export const fetchSessionData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/daily-visits`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            withCredentials: true
        });
        console.log("API请求数据：", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // 重新抛出错误以便上层处理
    }
};
