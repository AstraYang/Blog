import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SettingsIcon from '@mui/icons-material/Settings';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import BookIcon from '@mui/icons-material/Book';

const mainListItems = [
    { text: '主控制台', icon: <HomeRoundedIcon />, value: 'controlPanel' },
    { text: '撰写文章', icon: <EditNoteIcon />, value: 'markdown' },
    { text: '图书收纳', icon: <BookIcon />, value: 'books'},

    {
        text: '内容管理', icon: <AutoAwesomeMosaicIcon />,
        children: [
            { text: '独立页面', value: 'page' },
            { text: '知识地图', value: 'map' },
            { text: '文章', value: 'articles' },
            { text: '分类', value: 'categories' },
            { text: '标签', value: 'tags' },
            { text: '评论', value: 'comments' },
        ]
    },
    { text: '用户管理', icon: <AccountBoxIcon />, value: 'userList' },
    { text: '网站设置', icon: <SettingsIcon />, value: 'Settings' },
];

export default function MenuContent({ onMenuSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openIndexes, setOpenIndexes] = useState({});
    const [userRole, setUserRole] = useState('');

    // 从 localStorage 获取用户信息并获取权限
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        if (userInfo && userInfo.authorityString) {
            setUserRole(userInfo.authorityString);
        }
    }, []);

    const handleClick = (item, index) => {
        if (item.children) {
            setOpenIndexes((prev) => ({
                ...prev,
                [index]: !prev[index],
            }));
        } else {
            setSelectedIndex(index);
            onMenuSelect(item.value); // 调用回调函数，传递菜单值
        }
    };

    // 根据用户角色过滤菜单项
    const filteredMenuItems = mainListItems.filter(item => {
        // 如果是 User 角色，屏蔽某些菜单项
        if (userRole === 'USER') {
            return item.value !== 'userList' && item.value !== 'Settings';
        }
        return true; // 其他角色不做过滤
    });

    const filterChildrenItems = (children) => {
        if (!children) return [];

        // 如果是 User 角色，屏蔽某些子菜单项
        if (userRole === 'USER') {
            return children.filter(child =>
                child.value !== 'page' &&
                child.value !== 'categories' &&
                child.value !== 'tags' &&
                child.value !== 'comments'
            );
        }
        return children; // 其他角色不做过滤
    };
    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {filteredMenuItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem disablePadding sx={{ display: 'block' }}>
                            <ListItemButton
                                selected={selectedIndex === index}
                                onClick={() => handleClick(item, index)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                                {item.children && (openIndexes[index] ? <ExpandLess /> : <ExpandMore />)}
                            </ListItemButton>
                        </ListItem>

                        {item.children && (
                            <Collapse in={openIndexes[index]} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    {filterChildrenItems(item.children).map((child, childIndex) => (
                                        <ListItem key={childIndex} disablePadding sx={{ pl: 4 }}>
                                            <ListItemButton
                                                selected={selectedIndex === `${index}-${childIndex}`}
                                                onClick={() => {
                                                    setSelectedIndex(`${index}-${childIndex}`);
                                                    onMenuSelect(child.value); // 选择子菜单
                                                }}
                                            >
                                                <ListItemText primary={child.text} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Collapse>
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Stack>
    );
}

// 定义 PropTypes
MenuContent.propTypes = {
    onMenuSelect: PropTypes.func.isRequired,
};
