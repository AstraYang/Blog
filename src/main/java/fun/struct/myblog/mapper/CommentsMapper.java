package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.entity.Comments;
import fun.struct.myblog.sql.GenericSqlProvider;
import fun.struct.myblog.vo.CommentManagementListVO;
import fun.struct.myblog.vo.CommentsVO;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface CommentsMapper extends BaseMapper<Comments> {

    @Select("""
    SELECT comment_id AS id, c.articles_id, title AS articlesTitle, username, email, avatar_url,  c.content, c.created_at
    FROM comments c, articles
    WHERE c.articles_id = articles.articles_id
""")
    Page<CommentManagementListVO> selectCommentManagementListPage(Page<CommentManagementListVO> page);

    @Select("""
    SELECT
        c.comment_id AS id, c.articles_id, c.username, c.email, c.avatar_url, c.website, c.content,
        c.parent_id, c.created_at, COALESCE(replyCount.replyCount, 0) AS replyCount
    FROM
        comments c
    LEFT JOIN (
        SELECT
            parent_id,
            COUNT(comment_id) AS replyCount
        FROM
            comments
        GROUP BY
            parent_id
    ) replyCount ON c.comment_id = replyCount.parent_id
    WHERE
        c.articles_id = #{articlesId} AND c.parent_id IS NULL
""")
    Page<CommentsVO> selectCommentsPage(Page<CommentsVO> page, @Param("articlesId") Integer articlesId);

    @Select("""
    SELECT  comment_id AS id, articles_id, username, email, avatar_url, website, content,parent_id, created_at
    FROM comments
    WHERE parent_id = #{parentId}
""")
    Page<CommentsVO> selectReplyPage(Page<CommentsVO> page, @Param("parentId") Integer parentId);


    @DeleteProvider(type = GenericSqlProvider.class, method = "deleteByIds")
    int deleteCommentByIds(@Param("tableName") String tableName,
                       @Param("idColumn") String idColumn,
                       @Param("ids") List<Integer> ids);




}
