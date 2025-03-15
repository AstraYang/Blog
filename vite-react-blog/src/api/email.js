import axios from 'axios';



const API_BASE_URL = 'http://localhost:8080/email';

export const sendEmail = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/send-code`, {
            params:{
                email
            },
        });
        return response.data;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
};

export const sendResetEmail = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/send-reset-code`, {
        params:{
            email
        },
    });
        console.log("发送邮件成功");
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to send reset email:', error);
        throw error;
    }
};

export const verifyCode = async (emailCode) => {
    console.log("api验证码："+emailCode);
    try {
        const response = await axios.post(`${API_BASE_URL}/verify-code`, emailCode,{
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        console.error('Failed to verify code:', error);
        throw error;
    }
};