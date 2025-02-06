package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.vo.ArticlesListVo;
import fun.struct.myblog.vo.ArticlesVo;

public interface ArticlesService extends IService<Articles> {
    int addArticle(ArticlesDto articlesDto);
    int updateArticle(Integer id,ArticlesDto articlesDto);
    void deleteArticle(Integer id);
    ArticlesVo getArticle(Integer id);
    Page<ArticlesListVo> getArticlesPage(int page, int size, Integer categoryId);
}
