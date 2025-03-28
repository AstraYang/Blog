import axios from "axios";

export function disableUsers() {
}


const API_BASE_URL = 'http://localhost:8080/admin/user';
const API_Upload_URL = 'http://localhost:8080/uploads';


//登录
export const login = async (username, password) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/login`,
            { username, password },
            { withCredentials: true } // 允许携带 Cookie
        );

        const token = response.data.data; // 获取 Token

        if (response.data.code === 200){
            localStorage.setItem('token', token); // 存储 Token
            // 解析 Token 并存储用户信息
            const userInfo = parseJwt(token);
            console.log('__保存用户信息', userInfo);
            localStorage.setItem('userInfo', JSON.stringify(userInfo)); // 存储用户信息
            console.log('保存用户信息', localStorage.getItem('userInfo'));
            console.log("code:",response);

        }
        return response.data;
    } catch (error) {
        console.error('登录失败:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
};

// 解析 JWT 的函数
const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload); // 返回解析后的 JSON 对象
};


//注册
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


//重置密码
export const resetPassword = async (signUpData) =>{
    console.log('重置密码:', signUpData);
    try {
        const response = await axios.post(`${API_BASE_URL}/reset-password`, signUpData, {
                withCredentials: true, // 允许携带 Cookie
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('重置密码:', response.data);
        return response.data;
    } catch (error) {
        console.error('重置密码:', error.response ? error.response.data : error.message);
        throw error; // 抛出错误，由调用方处理
    }
}

//通过旧密码修改
export const updatePassword = async (userUpdatePassData) =>{
    console.log('修改密码:', userUpdatePassData);
    try {
        const response = await axios.post(`${API_BASE_URL}/update-password`, userUpdatePassData, {
                withCredentials: true, // 允许携带 Cookie
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
        );
        console.log('修改密码:', response.data);
        return response.data;
   } catch (error) {
        console.error('修改密码:', error.response ? error.response.data : error.message);
        throw error;
    }
}


//更改电子邮箱
export const updateEmail = async (userUpdateEmailData) =>{
    console.log('修改电子邮箱:', userUpdateEmailData);
    try {
        const response = await axios.post(`${API_BASE_URL}/update-email`, userUpdateEmailData, {
                withCredentials: true, // 允许携带 Cookie
                headers: {
                    'Content-Type': 'application/json',
                     'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }
       );
        return response.data;
    } catch (error) {
        console.error('修改电子邮箱:', error.response ? error.response.data : error.message);
        throw error;
    }
}
// 上传头像
export const uploadUserImage = async (userImage) => {
    try {
        const formData = new FormData();
        formData.append("image", userImage); // 将图片文件添加到 FormData 中

        const response = await axios.post(`${API_Upload_URL}/image`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        });
        return response.data.data;
    } catch (error) {
        console.error("上传头像图片失败:", error);
        throw error;
    }
};

//修改用户信息
export const updateUser = async (userData) => {
    console.log('修改用户信息:', userData);
    try {
        const response = await axios.post(`${API_BASE_URL}/updateUser`, userData, {
            withCredentials: true, // 允许携带 Cookie
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('修改用户信息失败:', error.response ? error.response.data : error.message);
    }
}

//获取用户列表
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

/**
 * 修改用户状态
 *
 */
export const updateUserStatus = async (userStatus) => {
    try {
        console.log('修改用户状态:', userStatus)
        const response = await axios.post(`${API_BASE_URL}/updateStatus`, userStatus, {
            withCredentials: true, // 允许携带 Cookie
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('修改用户状态失败:', error.response ?error.response.data : error.message);
    }
}
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


// 删除用户
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
    localStorage.removeItem('userInfo');
};

