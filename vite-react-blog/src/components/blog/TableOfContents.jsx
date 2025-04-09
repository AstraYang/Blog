import { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import {
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Typography,
    Divider,
    Slide,
    styled
} from '@mui/material';
import { ChevronLeft, MenuBook } from '@mui/icons-material';

const DrawerPaper = styled(Paper)(({ theme }) => ({
    width: 280,
    height: '100vh', // 全屏高度
    position: 'fixed',
    top: 0,         // 贴顶
    left: 0,        // 贴左
    overflowY: 'auto',
    zIndex: 1200,
    boxShadow: theme.shadows[16],
    // 使用transform实现动画
    transform: 'translateX(-100%)',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.standard
    }),
    '&.MuiSlide-entered': {
        transform: 'translateX(0)'
    }
}));

const ToggleButton = styled(IconButton)(({ theme }) => ({
    position: 'fixed',
    left: 290, // 初始位置在抽屉右侧
    top: '50%',
    transform: 'translate(-50%, -50%)', // 精确居中
    zIndex: 1200,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '50%',
    boxShadow: theme.shadows[8],
    transition: theme.transitions.create('left', {
        duration: theme.transitions.duration.standard
    }),
    '&:hover': {
        backgroundColor: theme.palette.grey[200],
    },
}));

const TableOfContents = ({ content }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeId, setActiveId] = useState('');
    const [headings, setHeadings] = useState([]);

    // 解析标题
    useEffect(() => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const elements = Array.from(doc.querySelectorAll('h1, h2, h3, h4'));

        const newHeadings = elements.map(heading => ({
            id: heading.id,
            text: heading.innerText,
            depth: parseInt(heading.tagName[1])
        }));

        setHeadings(newHeadings);
    }, [content]);

    // 滚动监听
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-20% 0px -60% 0px' }
        );

        headings.forEach(({ id }) => {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        });

        return () => observer.disconnect();
    }, [headings]);

    const handleClick = (id) => {
        const element = document.getElementById(id);
        // 查找第一个AppBar组件（假设使用MUI）
        const navBar = document.querySelector('.MuiAppBar-root');
        const headerHeight = navBar ? navBar.offsetHeight : 64;

        if (element) {
            window.scrollTo({
                top: element.offsetTop - headerHeight - 30,
                behavior: 'smooth'
            });
        }
        setIsOpen(false);
    };

    return (
        <>
            <Slide
                direction="right"
                in={isOpen}
                mountOnEnter
                unmountOnExit
                style={{
                    transformOrigin: 'left center', // 修正动画起点
                    zIndex: 1200
                }}
            >
                <DrawerPaper
                    sx={{
                        borderRadius: isOpen ? '0 8px 8px 0' : '0' // 动态圆角
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            p: 2,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            color: 'text.primary',
                            bgcolor: 'background.default',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }}
                    >
                        <MenuBook fontSize="small" />
                        文章目录
                    </Typography>
                    <Divider />

                    <List dense sx={{ p: 1 }}>
                        {headings.map((heading) => (
                            <ListItem
                                key={heading.id}
                                sx={{
                                    pl: 2 + (heading.depth - 1) * 2,
                                    py: 0.5,
                                    position: 'relative'
                                }}
                            >
                                <ListItemButton
                                    selected={activeId === heading.id}
                                    onClick={() => handleClick(heading.id)}
                                    sx={{
                                        borderRadius: 2,
                                        '&.Mui-selected': {
                                            bgcolor: 'action.selected',
                                            '&:hover': {
                                                bgcolor: 'action.hover'
                                            }
                                        }
                                    }}
                                >
                                    <ListItemText
                                        primary={heading.text}
                                        primaryTypographyProps={{
                                            variant: 'body2',
                                            sx: {
                                                fontWeight: activeId === heading.id ? 600 : 400,
                                                color: activeId === heading.id ?
                                                    'primary.main' : 'text.secondary',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DrawerPaper>
            </Slide>

            <ToggleButton
                onClick={() => setIsOpen(!isOpen)}
                size="large"
                sx={{
                    left: isOpen ? 280 : 10, // 动态跟随
                    transform: `translate(${isOpen ? -20 : -50}%, -50%)` // 微调位置
                }}
            >
                {isOpen ? <ChevronLeft /> : <MenuBook fontSize="small" />}
            </ToggleButton>
        </>
    );
};

TableOfContents.propTypes = {
    content: PropTypes.string.isRequired
};

export default TableOfContents;