package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.UploadBookDTO;
import fun.struct.myblog.entity.Books;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.BooksMapper;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.BooksService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class BooksServiceImpl extends ServiceImpl<BooksMapper, Books> implements BooksService {
    private final UserMapper userMapper;
    private final BooksMapper booksMapper;

    public BooksServiceImpl(UserMapper userMapper, BooksMapper booksMapper) {
        this.userMapper = userMapper;
        this.booksMapper = booksMapper;
    }

    @Override
    public boolean saveBook(UploadBookDTO uploadBookDTO) {
        Books books = new Books();
        books.setTitle(uploadBookDTO.getTitle());
        books.setAuthor(uploadBookDTO.getAuthor());
        books.setCoverImage(uploadBookDTO.getCoverImage());
        books.setDescription(uploadBookDTO.getDescription());
        books.setDownloadUrl(uploadBookDTO.getDownloadUrl());
        books.setCategories(uploadBookDTO.getCategories());
        books.setUploader(uploadBookDTO.getUploader());
        books.setCreatedAt(LocalDateTime.now());
        books.setDeleted(false);
        return save(books);
    }

    @Override
    public Page<Books> getBooksListByUserId(int page, int size,Integer uId) {
        User user = userMapper.selectById(uId);
        Page<Books> pageInfo = new Page<>(page, size);
        if (user != null) {
            // 检查用户权限
            if ("ADMIN".equalsIgnoreCase(user.getAuthority())) {
                // 如果是ADMIN，查询所有书籍
                return booksMapper.selectPage(pageInfo, null);
            } else {
                // 如果不是ADMIN，查询该用户对应的书籍
                QueryWrapper<Books> queryWrapper = new QueryWrapper<>();
                queryWrapper.eq("uploader", uId); // 假设书籍表有 user_id 字段
                return booksMapper.selectPage(pageInfo, queryWrapper);
            }
        }

        return new Page<>(); // 如果用户不存在，返回空分页
    }



}
