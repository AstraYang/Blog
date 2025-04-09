import { useState, useEffect } from 'react';
import { TextField, Typography, Box, Grid, Paper, InputAdornment, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BookDetail from "./BookDetail.jsx";
import { fetchBooksByKeyword } from "../../api/books.js";

const SearchPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);

    // 使用防抖函数来减少API请求
    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            if (searchTerm.trim()) {
                handleSearch();
            } else {
                setSearchResults([]);
            }
        }, 500); // 500ms防抖延迟

        return () => clearTimeout(debounceTimer);
    }, [searchTerm]);

    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await fetchBooksByKeyword(page, size, searchTerm);
            console.log('搜索结果:', response);
            if (response && response.data.records) {
                setSearchResults(response.data.records);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('搜索出错:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
    };

    return (
        <Box sx={{ padding: '5px' }}>
            <Grid container spacing={2}>
                <Grid item xs={3} sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                    <Paper elevation={3} sx={{
                        padding: '10px',
                        mb: 2,
                        mt:4,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px'
                    }}>
                        <TextField
                            variant="outlined"
                            placeholder="搜索书籍、作者或关键词..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                endAdornment: loading && (
                                    <InputAdornment position="end">
                                        <CircularProgress size={20} />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                    '& fieldset': {
                                        borderColor: 'rgba(0,0,0,0.12)',
                                    },
                                    '&:hover fieldset': {
                                        borderColor: 'rgba(0,0,0,0.24)',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#6078ea',
                                        boxShadow: '0 0 0 2px rgba(96,120,234,0.2)',
                                    },
                                },
                            }}
                        />
                    </Paper>
                    <Paper elevation={3} sx={{
                        padding: '15px',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        height: searchResults.length > 0 ? 'auto' : '60vh',
                        minHeight: '60vh'
                    }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CircularProgress />
                            </Box>
                        ) : searchResults.length > 0 ? (
                            <>
                                <Typography variant="h6" sx={{ mb: 2, borderBottom: '2px solid #f0f0f0', pb: 1 }}>
                                    搜索结果
                                </Typography>
                                {searchResults.map((result) => (
                                    <Box
                                        key={result.id}
                                        sx={{
                                            padding: '12px',
                                            margin: '8px 0',
                                            backgroundColor: selectedItem?.id === result.id ? 'rgba(96,120,234,0.1)' : '#fff',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            border: '1px solid #f0f0f0',
                                            transition: 'all 0.2s ease',
                                            '&:hover': {
                                                backgroundColor: 'rgba(96,120,234,0.05)',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                                            }
                                        }}
                                        onClick={() => handleItemClick(result)}
                                    >
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {result.title || '无标题'}
                                        </Typography>
                                        {result.author && (
                                            <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                                                作者: {result.author}
                                            </Typography>
                                        )}
                                    </Box>
                                ))}
                            </>
                        ) : (
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%',
                                textAlign: 'center'
                            }}>
                                <SearchIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#666' }}>
                                    开始您的搜索
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#999', mt: 1, maxWidth: '240px' }}>
                                    在上方输入框中输入关键词，搜索您想要查找的书籍、文献或资料
                                </Typography>
                            </Box>
                        )}
                    </Paper>
                </Grid>

                <Grid item xs={9}>
                    {selectedItem ? (
                        <BookDetail selectedBook={selectedItem} />
                    ) : (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '73vh',
                            backgroundColor: 'rgba(250,250,250,0.8)',
                            borderRadius: '12px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                        }}>
                            <img
                                src="/images/book-illustration.png"
                                alt="书籍插图"
                                style={{
                                    width: '200px',
                                    height: 'auto',
                                    opacity: 0.7,
                                    marginBottom: '16px'
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            <Typography variant="h5" sx={{ color: '#555', fontWeight: '500', mb: 2 }}>
                                欢迎使用文献搜索系统
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#777', textAlign: 'center', maxWidth: '600px' }}>
                                请在左侧搜索栏输入关键词进行搜索，然后点击搜索结果查看详细信息。
                            </Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default SearchPage;
