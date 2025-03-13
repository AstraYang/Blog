package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.CommentDTO;
import fun.struct.myblog.entity.Comments;
import fun.struct.myblog.vo.CommentManagementListVO;
import fun.struct.myblog.vo.CommentsVO;

import java.util.List;

public interface CommentsService extends IService<Comments> {
    boolean saveComment(CommentDTO commentDTO);
    Page<CommentManagementListVO> getCommentListPage(int page, int size);
    Page<CommentsVO> getCommentPageById(int page, int size, Integer id);
    Page<CommentsVO> getReplyPageById(int page, int size, Integer id);
    boolean deleteCommentByIds(List<Integer> commentIds);
}
