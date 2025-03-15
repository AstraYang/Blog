import axios from "axios";


const API_BASE_URL = 'http://localhost:8080/admin/user';

// 登录函数
export const login = async (username, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { username, password },
            { withCredentials: true } // 允许携带 Cookie
        );
        const token = response.data.data; // 直接返回 Token
        console.log('保存token', token);
        localStorage.setItem('token', token); // 存储 Token
        return token; // 返回 Token
    } catch (error) {
        console.error('登录失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
};

export const register = async (signUpData) =>{
    console.log('注册数据:', signUpData);
    try {
        const response = await axios.post(`${API_BASE_URL}/signup`, signUpData, {
            withCredentials: true, // 允许携带 Cookie
            headers: {
                'Content-Type': 'application/json'
            }
        }
        );
        console.log('注册成功API:', response.data);
        return response.data;
    } catch (error) {
        console.error('注册失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
}

export const getUserList = async () => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/list`,
            {
                withCredentials: true ,// 允许携带 Cookie
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        console.log('获取用户列表成功API:', response.data);
        return response.data;
    } catch (error) {
        console.error('获取用户列表失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
};

export const createUser = async (user) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/create`, user, {
            withCredentials: true, // 允许携带 Cookie
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('创建用户失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误
    }
}

export const deleteUsers = async (userIds) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/delete`, {
            data: { userIds },
            withCredentials: true,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('删除用户失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误
    }
}

// 退出登录函数（直接删除 Token）
export const logout = () => {
    // 清除本地存储中的 Token
    localStorage.removeItem('token');
};

// 获取当前用户信息的函数（可选）
export const getCurrentUser = () => {
    const token = localStorage.getItem('token');
    if (!token) return null; // 如果没有 Token，返回 null

    const parseJwt = (token) => {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload); // 返回解析后的 JSON 对象
    };
    return parseJwt(token); // 返回解析后的用户信息


};
