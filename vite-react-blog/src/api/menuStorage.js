import axios from "axios";
import {message} from "antd";

const SETTINGS_KEY = 'siteSettings';

export const getSiteSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : {
        siteName: '',
        siteDescription: '',
        allowRegistration: false, // 默认注册不允许
        favicon: '', // 默认 Favicon URL
        logo: '', // 默认 LOGO URL
        siteStartDate: '', // 默认站点运行时间
        linkItems: JSON.stringify([]),
    };
};

export const setSiteSettings = (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};



export const fetchSettings = async () => {
    try {
        const response = await axios.get('http://localhost:8080/settings/get');
        const settings = response.data.data[0];

        const settingsData = {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            allowRegistration: settings.allowRegistration || false,
            favicon: settings.favicon || '',
            logo: settings.logo || '',
            siteStartDate: settings.siteStartDate || '',
            linkItems: settings.linkItems,
        };
        setSiteSettings(settingsData);
        return settingsData;
    } catch (error) {
        message.error('获取失败!',error);
    }
};

export const saveSettings = async (settings) => {
    try {
        console.log('save：', settings)
        await axios.post('http://localhost:8080/settings/save', settings, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
        });
    } catch (error) {
        message.error('保存失败！',error);
    }
}
