package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.CommentDTO;
import fun.struct.myblog.service.CommentsService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
        boolean success = commentsService.saveComment(commentDTO);
        if (!success) {
            return Result.of(ResultCode.FAIL, "添加失败");
        }
        return Result.of(ResultCode.SUCCESS, "添加成功");
    }

    /*
    * 获取所有评论
    * 接收参数:无;
    * 请求方法:GET;
    * 返回结果:成功或失败;
    * URL:/comments/getCommentList;
    * */
    @GetMapping("/getCommentList")
    public Result getCommentList(
            @RequestParam int page,
            @RequestParam int size
    ){
        return Result.of(ResultCode.SUCCESS, commentsService.getCommentListPage(page, size));
    }


    /*
    * 根据文章id获取评论
    * 接收参数:articleId, page, size;
    * 请求方法:GET;
    * 返回结果:成功或失败;
    * URL:/comments/public/getComments/{articleId};
    * */
    @GetMapping("/public/getComments/{articleId}")
    public Result getCommentById(
            @PathVariable ("articleId") Integer articleId,
            @RequestParam int page,
            @RequestParam int size
    ){
        return Result.of(ResultCode.SUCCESS, commentsService.getCommentPageById(page, size, articleId));
    }

    /*
    * 获取评论总数
    * 接收参数:无;
    * 请求方法:GET;
    * 返回结果:成功或失败,count;
    * URL:/comments/count;
    * */
    @GetMapping("/count")
    public Result count(){
        return Result.of(ResultCode.SUCCESS, commentsService.count());
    }

    /*
    * 根据评论id获取回复
    * 接收参数:parentId, page, size;
    * 请求方法:GET;
    * 返回结果:成功或失败;
    * URL:/comments/public/getReplies/{parentId};
    * */
    @GetMapping("/public/getReplies/{parentId}")
    public Result getRepliesByParentId(
            @PathVariable Integer parentId,
            @RequestParam int page,
            @RequestParam int size){
        return Result.of(ResultCode.SUCCESS, commentsService.getReplyPageById(page, size, parentId));
    }


    /*
    * 根据评论id删除评论
    * 接收参数:commentIds;
    * 请求方法:DELETE;
    * 返回结果:成功或失败;
    * URL:/comments/delete;
    * */
    @DeleteMapping("/delete")
    public Result deleteTags(@RequestBody List<Integer> commentIds) {
        System.out.println("删除评论:"+commentIds);
        if (commentIds == null || commentIds.isEmpty()) {
            return Result.of(ResultCode.FAIL, "分类 ID 列表不能为空");
        }
        boolean success = commentsService.deleteCommentByIds(commentIds);
        if (success) {
            System.out.println("删除成功:"+commentIds);
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }

}
