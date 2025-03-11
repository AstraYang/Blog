package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.sql.GenericSqlProvider;
import fun.struct.myblog.vo.ArticleDataVo;
import fun.struct.myblog.vo.ArticleManagementListVO;
import fun.struct.myblog.vo.ArticleVO;
import fun.struct.myblog.vo.ArticlesListVo;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ArticlesMapper extends BaseMapper<Articles> {
    @Select("""
    SELECT
        a.articles_id AS id, a.title, c.category_name,GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS tags,
        a.summary, a.cover_image AS image, a.views, a.created_at AS createAt
    FROM articles a
    INNER JOIN category c ON c.category_id = a.category_id
    LEFT JOIN articles_tags at ON at.articles_id = a.articles_id
    LEFT JOIN tags t ON t.tag_id = at.tag_id
    WHERE ${whereClause}
    GROUP BY a.articles_id -- 按文章分组
    ORDER BY a.update_at DESC
""")
    Page<ArticlesListVo> selectArticlesPage(Page<ArticlesListVo> page, @Param("whereClause") String whereClause);


    @Select("""
    SELECT articles_id AS id, title, category_name, nick_name AS authorName, a.created_at AS createdAta,
           is_status AS status, a.is_comment AS comment, a.is_deleted AS deleted
    FROM articles a
    INNER JOIN category c ON c.category_id = a.category_id
    LEFT JOIN user  ON user_id = a.author
    WHERE  ${whereClause}
    ORDER BY a.update_at DESC
    """)
    Page<ArticleManagementListVO> selectArticleManagementPage(Page<ArticleManagementListVO> page, @Param("whereClause") String whereClause);

    @Select("""
    SELECT articles_id AS id, title, content, views, update_At, is_comment AS comment
    FROM articles
    WHERE articles_id = ${id}
    """)
    ArticleVO selectArticleDetail(@Param("id") Integer id);

    @Select("""
    SELECT articles_id AS id, title, category_id, summary, content, cover_image AS coverImage,
           is_status AS status, is_comment AS comment, is_deleted AS deleted
    FROM articles WHERE articles_id = ${id}
    """)
    ArticleDataVo selectArticleData(@Param("id") Integer id);

    @DeleteProvider(type = GenericSqlProvider.class, method = "deleteByIds")
    int deleteCategoriesByIds(@Param("tableName") String tableName,
                              @Param("idColumn") String idColumn,
                              @Param("ids") List<Integer> ids);
}
