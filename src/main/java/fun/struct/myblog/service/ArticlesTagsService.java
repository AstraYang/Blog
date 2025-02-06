package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.ArticlesTags;

import java.util.List;

public interface ArticlesTagsService extends IService<ArticlesTags> {
    public void addArticleTags(Integer articleId, List<Integer> tags);
    public void updateArticleTags(Integer articleId, List<Integer> tags);
}
