import React, { useState } from 'react';
import { TextField, Grid, Card, CardContent, CardMedia, Typography, Container } from '@mui/material';

// 假设的书籍数据
const booksData = [
    { id: 1, title: "电子学", author: "作者1", cover: "https://image.struct.fun/i/2025/03/20/024232.png" },
    { id: 2, title: "书名2", author: "作者2", cover: "https://image.struct.fun/i/2025/03/20/024232.png" },
    { id: 3, title: "书名3", author: "作者3", cover: "https://via.placeholder.com/150" },
    // 可以添加更多书籍数据...
];

const Bookshelf = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredBooks, setFilteredBooks] = useState(booksData);

    // 处理搜索逻辑
    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        // 根据输入内容过滤书籍
        const filtered = booksData.filter(book =>
            book.title.toLowerCase().includes(value.toLowerCase()) ||
            book.author.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredBooks(filtered);
    };

    return (
        <Container>
            <TextField
                label="搜索书籍"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={handleSearch}
                margin="normal"
            />
            <Grid container spacing={2}>
                {filteredBooks.map(book => (
                    <Grid item key={book.id} xs={12} sm={6} md={4}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={book.cover}
                                alt={book.title}
                                style={{ width: '50%', objectFit: 'cover' }} // 设置宽度为100%，保证图片适应卡片
                            />
                            <CardContent>
                                <Typography variant="h6">{book.title}</Typography>
                                <Typography variant="body2" color="textSecondary">{book.author}</Typography>
                            </CardContent>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Bookshelf;
