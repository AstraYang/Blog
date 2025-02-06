package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.ArticlesTags;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ArticlesTagsMapper extends BaseMapper<ArticlesTags> {
    @Delete("delete from articles_tags where articles_tags_id = #{articleId}")
    public void deleteArticleTags(Integer articleId);
}
