package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.UploadBookDTO;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.entity.Books;
import fun.struct.myblog.service.BooksService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/books")
public class BooksController {

    @Resource
    private BooksService booksService;

    @RequestMapping("/add")
    public Result addBook(@RequestBody UploadBookDTO uploadBookDTO){
        System.out.println(uploadBookDTO);
        boolean isSuccess = booksService.saveBook(uploadBookDTO);
        if (!isSuccess){
            System.out.println("上传失败");
            return Result.of(ResultCode.FAIL, "上传失败");
        }
        return Result.of(ResultCode.SUCCESS, "上传成功");
    }


    @GetMapping("/booksList")
    public Result getBooksList( @RequestParam int page,
                                @RequestParam int size,
                                @RequestParam int uId
    ){
        Page<Books> pageInfo = booksService.getBooksListByUserId(page, size, uId);
        return Result.of(ResultCode.SUCCESS, "获取成功", pageInfo);
    }

    @GetMapping("/public/search/page")
    public Result searchBooksWithPage(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Books> booksP = booksService.searchBooksWithPage(keyword, page, size);
        System.out.println(booksP);
        return Result.of(ResultCode.SUCCESS,booksP);
    }

    /*
    * 获取书籍数量
    * 收收参数:无;
    * 请求方法:GET;
    * 返回值:书籍数量;
    * URL:/books/count;
    * */
    @GetMapping("/count")
    public Result count(){
        long count = booksService.count();
        return Result.of(ResultCode.SUCCESS, "获取成功", count);
    }

    @DeleteMapping("/deleteBook/{bId}")
    public Result deleteBook(@PathVariable Integer bId){
        boolean isSuccess = booksService.removeById(bId);
        if (!isSuccess){
            return Result.of(ResultCode.FAIL, "删除失败");
        }
        return Result.of(ResultCode.SUCCESS, "删除成功");
    }
}
