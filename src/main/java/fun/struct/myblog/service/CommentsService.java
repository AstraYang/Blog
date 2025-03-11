package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.CommentDTO;
import fun.struct.myblog.entity.Comments;
import fun.struct.myblog.vo.CommentsVO;

public interface CommentsService extends IService<Comments> {
    boolean saveComment(CommentDTO commentDTO);
    Page<CommentsVO> getCommentPageById(int page, int size, Integer id);
    Page<CommentsVO> getReplyPageById(int page, int size, Integer id);
}
