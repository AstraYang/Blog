import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/books';


/*
* 提交数据
* */
export const saveBook = async (bookData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/add`, bookData,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log("提交成功:", response.data);
        return response.data; // 返回提交成功的响应
    } catch (error) {
        console.error("提交失败:", error.response ? error.response.data : error.message);
        throw error;
    }
};

/*
* 获取文献List
*/
export const getBookList = async (page, size, uId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/booksList`,{
            params: {
                page,
                size,
                uId,
            },
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return response.data; // 返回获取到的文献列表
    } catch (error) {
        console.error("获取文献列表失败:", error.response ? error.response.data : error.message);
        throw error;
    }
};

export const deleteBook = async (bId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteBook/${bId}`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log("删除成功:", response.data);
        return response.data; // 返回删除成功的响应
    } catch (error) {
        console.error("删除失败:", error.response ? error.response.data : error.message);
    }
}


