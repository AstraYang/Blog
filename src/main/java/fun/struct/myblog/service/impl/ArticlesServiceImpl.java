package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.mapper.ArticlesMapper;
import fun.struct.myblog.service.ArticlesService;
import fun.struct.myblog.vo.ArticlesListVo;
import fun.struct.myblog.vo.ArticlesVo;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

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
    public void deleteArticle(Integer id) {

    }

    @Override
    public ArticlesVo getArticle(Integer id) {
        return null;
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
        articles.set_status(articlesDto.is_status());
        articles.set_comment(articlesDto.is_comment());
        articles.set_deleted(articlesDto.is_deleted());

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
