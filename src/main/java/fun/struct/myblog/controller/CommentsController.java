package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.CommentDTO;
import fun.struct.myblog.service.CommentsService;
import fun.struct.myblog.service.impl.CommentsServiceImpl;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/comments")
public class CommentsController {

    @Resource
    CommentsService commentsService;
    /*
    * 添加评论
    * 接收参数:articlesId, name, email, website, content, parentId, createdAt;
    * 请求方法:POST;
    * 返回结果:成功或失败;
    * URL:/comments/save;
    * */
    @PostMapping("/save")
    public Result saveComments(@RequestBody CommentDTO commentDTO){
        commentsService.saveComment(commentDTO);
        return Result.of(ResultCode.SUCCESS, "添加成功");
    }

    @GetMapping("/getComments/{articleId}")
    public Result getCommentById(
            @PathVariable ("articleId") Integer articleId,
            @RequestParam int page,
            @RequestParam int size
    ){
        return Result.of(ResultCode.SUCCESS, commentsService.getCommentPageById(page, size, articleId));
    }

    @GetMapping("/getReplies/{parentId}")
    public Result getRepliesByParentId(
            @PathVariable Integer parentId,
            @RequestParam int page,
            @RequestParam int size){
        return Result.of(ResultCode.SUCCESS, commentsService.getReplyPageById(page, size, parentId));
    }

}
