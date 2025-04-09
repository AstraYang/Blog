import axios  from "axios";

const API_BASE_URL = 'http://localhost:8080/menu-items';

export const fetchMenuItemData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/fetch`,{
            withCredentials: true
        });
        console.log("API请求数据：", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const  updateMenuItem = async (menuItemData) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/delete`, menuItemData,{
            withCredentials: true
            ,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log('菜单项更新成功:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating menu item:', error);
        throw error;
    }
}
