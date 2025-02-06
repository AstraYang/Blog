package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.vo.ArticlesListVo;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ArticlesMapper extends BaseMapper<Articles> {
    @Select("""
    SELECT
        a.articles_id AS id,
        a.title,
        c.category_name,
        GROUP_CONCAT(t.tag_name SEPARATOR ', ') AS tags,
        a.summary,
        a.cover_image AS image,
        a.views,
        a.created_at AS createAt
    FROM
        articles a
    INNER JOIN category c ON c.category_id = a.category_id
    LEFT JOIN articles_tags at ON at.articles_id = a.articles_id
    LEFT JOIN tags t ON t.tag_id = at.tag_id
    WHERE ${whereClause}
    GROUP BY a.articles_id -- 按文章分组
    ORDER BY a.update_at DESC
""")
    Page<ArticlesListVo> selectArticlesPage(Page<ArticlesListVo> page, @Param("whereClause") String whereClause);

}
