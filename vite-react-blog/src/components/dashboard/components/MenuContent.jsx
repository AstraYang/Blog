import React, { useState } from 'react';
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
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';

const mainListItems = [
    { text: '主控制台', icon: <HomeRoundedIcon />, value: 'controlPanel' },
    { text: '撰写文章', icon: <EditNoteIcon />, value: 'markdown' },
    {
        text: '内容管理', icon: <AutoAwesomeMosaicIcon />,
        children: [
            {text: '独立页面', value: 'page'},
            { text: '知识地图', value: 'map' },
            { text: '文章', value: 'articles' },
            { text: '分类', value: 'categories' },
            { text: '标签', value: 'tags' },
            { text: '评论', value: 'comments' },
        ]
    },
    { text: '用户管理', icon: <AssignmentRoundedIcon />, value: 'userList' },
    { text: '网站设置', icon: <AssignmentRoundedIcon />, value: 'Settings' },
];

export default function MenuContent({ onMenuSelect }) {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [openIndexes, setOpenIndexes] = useState({});

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

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
            <List dense>
                {mainListItems.map((item, index) => (
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
                                    {item.children.map((child, childIndex) => (
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
