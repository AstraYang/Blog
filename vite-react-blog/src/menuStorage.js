const MENU_ITEMS_KEY = 'menuItems';
const SETTINGS_KEY = 'siteSettings';
const LINK_ITEMS_KEY = 'linkItems'; // 新增链接数据的键

export const getMenuItems = () => {
    const savedMenuItems = localStorage.getItem(MENU_ITEMS_KEY);
    return savedMenuItems ? JSON.parse(savedMenuItems) : {};
};

export const setMenuItems = (items) => {
    localStorage.setItem(MENU_ITEMS_KEY, JSON.stringify(items));
};

export const getSiteSettings = () => {
    const savedSettings = localStorage.getItem(SETTINGS_KEY);
    return savedSettings ? JSON.parse(savedSettings) : {
        siteName: '',
        siteDescription: '',
        allowRegistration: false, // 默认值
        favicon: '', // 默认 Favicon URL
        logo: '', // 默认 LOGO URL
    };
};

export const setSiteSettings = (settings) => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

// 新增获取链接数据的函数
export const getLinkItems = () => {
    const savedLinkItems = localStorage.getItem(LINK_ITEMS_KEY);
    return savedLinkItems ? JSON.parse(savedLinkItems) : {};
};

// 新增设置链接数据的函数
export const setLinkItems = (items) => {
    console.log('设置链接数据', items);
    localStorage.setItem(LINK_ITEMS_KEY, JSON.stringify(items));
};
