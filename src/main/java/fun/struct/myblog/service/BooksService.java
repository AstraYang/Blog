package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.UploadBookDTO;
import fun.struct.myblog.entity.Books;
import fun.struct.myblog.vo.BooksDataVO;

import java.util.List;


public interface BooksService extends IService<Books> {

    boolean saveBook(UploadBookDTO uploadBookDTO);
    Page<Books> getBooksListByUserId(int page, int size, Integer uId);
    Page<Books> searchBooksWithPage(String keyword, int current, int size);
}
