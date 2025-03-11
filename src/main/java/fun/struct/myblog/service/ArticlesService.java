package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.ArticleQueryDTO;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.vo.ArticleDataVo;
import fun.struct.myblog.vo.ArticleManagementListVO;
import fun.struct.myblog.vo.ArticlesListVo;

import java.util.List;

public interface ArticlesService extends IService<Articles> {
    int addArticle(ArticlesDto articlesDto);
    int updateArticle(Integer id,ArticlesDto articlesDto);
    boolean deleteArticleByIds(List<Integer> articleIds);
    boolean updateArticleDelByIds(List<Integer> ids, boolean newDel);

    Page<ArticleManagementListVO> getPaginatedArticles(Page<ArticleManagementListVO> page, ArticleQueryDTO queryDTO);
    ArticleDataVo getArticle(Integer id);
    Page<ArticlesListVo> getArticlesPage(int page, int size, Integer categoryId);
}
