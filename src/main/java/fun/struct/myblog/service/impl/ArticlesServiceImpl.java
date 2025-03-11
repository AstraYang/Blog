package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.ArticleQueryDTO;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.mapper.ArticlesMapper;
import fun.struct.myblog.service.ArticlesService;
import fun.struct.myblog.vo.ArticleDataVo;
import fun.struct.myblog.vo.ArticleManagementListVO;
import fun.struct.myblog.vo.ArticlesListVo;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArticlesServiceImpl extends ServiceImpl<ArticlesMapper, Articles> implements ArticlesService {

    @Resource
    private  ArticlesMapper articlesMapper;
    @Override
    public int addArticle(ArticlesDto articlesDto) {
        Articles articles = convertToEntity(articlesDto, true);
        articlesMapper.insert(articles);
      return articles.getId();
    }

    @Override
    public int updateArticle(Integer id, ArticlesDto articlesDto) {
       Articles articles = convertToEntity(articlesDto, false);
       articles.setId(id);
       articlesMapper.updateById(articles);
       return id;
    }

    @Override
    public boolean deleteArticleByIds(List<Integer> articleIds) {
        int deletedRows = articlesMapper.deleteCategoriesByIds("articles", "articles_id",articleIds);
        return deletedRows > 0;
    }

    @Override
    public boolean updateArticleDelByIds(List<Integer> ids, boolean newDel) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("ID 列表不能为空");
        }

        UpdateWrapper<Articles> updateWrapper = new UpdateWrapper<>();
        updateWrapper.in("articles_id", ids); // 设置批量更新条件
        return articlesMapper.update(null, updateWrapper.set("is_deleted", newDel)) > 0;
    }

    @Override
    public Page<ArticleManagementListVO> getPaginatedArticles(Page<ArticleManagementListVO> page, ArticleQueryDTO queryDTO) {

        List<String> conditions = new ArrayList<>();
        conditions.add("a.is_deleted = 0");
        conditions.add("a.is_status = " + queryDTO.isPublishFilter());
        if (queryDTO.getUserFilter()!= 0) {
            conditions.add("author = " + queryDTO.getUserFilter());
        }

        String whereClause = String.join(" AND ", conditions);
        return articlesMapper.selectArticleManagementPage(page, whereClause);
    }

    @Override
    public ArticleDataVo getArticle(Integer id) {
        return articlesMapper.selectArticleData(id);
    }

    @Override
    public Page<ArticlesListVo> getArticlesPage(int page, int size, Integer categoryId) {
        return null;
    }

    private Articles convertToEntity(ArticlesDto articlesDto, boolean isNew) {
        Articles articles = new Articles();

        // 通用字段
        articles.setTitle(articlesDto.getTitle());
        articles.setCategoryId(articlesDto.getCategoryId());
        articles.setSummary(articlesDto.getSummary());
        articles.setContent(articlesDto.getContent());
        articles.setCoverImage(articlesDto.getCoverImage());
        articles.setAuthor(articlesDto.getAuthor());
        articles.set_status(articlesDto.isStatus());
        articles.set_comment(articlesDto.isComment());
        articles.set_deleted(articlesDto.isDeleted());

        if (isNew) {
            // 新增操作
            articles.setViews(0); // 初始化阅读量为 0
            articles.setCreatedAt(LocalDateTime.now()); // 设置创建时间
            articles.setUpdateAt(LocalDateTime.now());
        } else {
            // 更新操作
            articles.setUpdateAt(LocalDateTime.now()); // 设置更新时间
        }

        return articles;
    }

}
