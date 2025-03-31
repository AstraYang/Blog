import { useState } from 'react';
import { TextField, Container, Typography, Box } from '@mui/material';

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <Container
            sx={{
                height: '80vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <Typography variant="h4" sx={{ mb: 2, color: '#333', fontWeight: 'bold' }}>
                欢迎使用书籍搜索
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
                输入书籍名称或作者进行搜索
            </Typography>
            <TextField
                label="搜索书籍"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchChange}
                sx={{
                    width: '300px',
                    borderRadius: '8px',
                    boxShadow: 2,
                    '& .MuiOutlinedInput-root': {
                        '& input': {
                            padding: '12px 14px',
                        },
                    },
                }}
            />
            {/* 可以在这添加装饰图形或图标 */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '20%',
                    left: '10%',
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    background: 'rgb(179,216,232)',
                    filter: 'blur(30px)',
                    zIndex: 0,
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    top: '60%',
                    right: '10%',
                    width: '150px',
                    height: '150px',
                    borderRadius: '50%',
                    background: 'rgb(206,191,191)',
                    filter: 'blur(30px)',
                    zIndex: 0,
                }}
            />
        </Container>
    );
};

export default SearchPage;
