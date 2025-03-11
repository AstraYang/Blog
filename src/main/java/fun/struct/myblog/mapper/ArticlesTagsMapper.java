package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.ArticlesTags;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface ArticlesTagsMapper extends BaseMapper<ArticlesTags> {
    @Delete("delete from articles_tags where articles_tags_id = #{articleId}")
    void deleteArticleTags(Integer articleId);

    @Select("select tag_id from articles_tags where articles_id = #{articleId}")
    List<Integer> getArticleTags(Integer articleId);
}
