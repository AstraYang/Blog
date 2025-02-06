package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.ArticlesTags;
import fun.struct.myblog.mapper.ArticlesTagsMapper;
import fun.struct.myblog.service.ArticlesTagsService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArticlesTagsServiceImpl extends ServiceImpl<ArticlesTagsMapper, ArticlesTags> implements ArticlesTagsService {

    @Resource
    ArticlesTagsMapper articlesTagsMapper;
    @Override
    public void addArticleTags(Integer articleId, List<Integer> tags) {
        for (Integer tagId : tags) {
            ArticlesTags articlesTags = new ArticlesTags();
            articlesTags.setArticlesId(articleId);
            articlesTags.setTagId(tagId);
            this.save(articlesTags);
        }
    }

    @Override
    public void updateArticleTags(Integer articleId, List<Integer> tags) {
//        删除表列是articleId的所有记录
        articlesTagsMapper.deleteArticleTags(articleId);
        for (Integer tagId : tags) {
            ArticlesTags articlesTags = new ArticlesTags();
            articlesTags.setArticlesId(articleId);
            articlesTags.setTagId(tagId);
            this.updateById(articlesTags);
        }
    }

}
