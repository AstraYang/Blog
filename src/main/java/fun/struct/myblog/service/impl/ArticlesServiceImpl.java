package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.ArticleQueryDTO;
import fun.struct.myblog.dto.ArticlesDTO;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.ArticlesMapper;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.ArticlesService;
import fun.struct.myblog.vo.ArticleDataVo;
import fun.struct.myblog.vo.ArticleManagementListVO;
import fun.struct.myblog.vo.ArticleVO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ArticlesServiceImpl extends ServiceImpl<ArticlesMapper, Articles> implements ArticlesService {

    @Resource
    private  ArticlesMapper articlesMapper;

    @Resource
    private UserMapper userMapper;
    @Override
    public Page<ArticleManagementListVO> searchArticlesWithPage(String keyword, int current, int size, Integer uId) {
        Page<ArticleManagementListVO> page = new Page<>(current, size);


        // 创建查询条件
        LambdaQueryWrapper<Articles> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Articles::isStatus, 1); // 只查询状态为 1 的文章
        queryWrapper.eq(Articles::isDeleted, 0);
        if (StringUtils.hasText(keyword)) {
            queryWrapper.and(wrapper -> wrapper
                    .like(Articles::getTitle, keyword)
                    .or()
                    .like(Articles::getSummary, keyword));
        }

        // 校验用户权限
        if (uId != null) {
            User user = userMapper.selectById(uId);
            if (user != null) {
                if (!"ADMIN".equalsIgnoreCase(user.getAuthority())) {
                    queryWrapper.eq(Articles::getAuthor, uId);
                }
            }
        }

        // 执行查询并返回结果
        return articlesMapper.selectArticlesWithUserInfo(page, queryWrapper);
    }

    @Override
    public int addArticle(ArticlesDTO articlesDto) {
        Articles articles = convertToEntity(articlesDto, true);
        articlesMapper.insert(articles);
      return articles.getId();
    }

    @Override
    public boolean updateArticle(Integer id, ArticlesDTO articlesDto) {
       Articles articles = convertToEntity(articlesDto, false);
       articles.setId(id);
        articles.setViews(articlesMapper.selectById(id).getViews());

        return articlesMapper.updateById(articles) > 0;
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
    public ArticleVO selectArticleDetail(Integer articleId) {
        UpdateWrapper<Articles> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("articles_id", articleId) // 这里假设文章的 ID 字段为 id
                .setSql("views = views + 1"); // 使用 setSql 来执行自增操作

        // 执行更新操作
        articlesMapper.update(null, updateWrapper);
        return articlesMapper.selectArticleDetail(articleId);
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
    public boolean updateArticleStatus(Integer articleId, boolean Status) {
        UpdateWrapper<Articles> updateWrapper = new UpdateWrapper<>();
        updateWrapper.eq("articles_id", articleId) // 设置更新条件
                .set("is_status", Status);
        return articlesMapper.update(null, updateWrapper) > 0;
    }


    private Articles convertToEntity(ArticlesDTO articlesDto, boolean isNew) {
        Articles articles = new Articles();

        // 通用字段
        articles.setTitle(articlesDto.getTitle());
        articles.setCategoryId(articlesDto.getCategoryId());
        articles.setSummary(articlesDto.getSummary());
        articles.setContent(articlesDto.getContent());
        articles.setCoverImage(articlesDto.getCoverImage());
        articles.setAuthor(articlesDto.getAuthor());
        articles.setStatus(articlesDto.isStatus());
        articles.setComment(articlesDto.isComment());
        articles.setDeleted(articlesDto.isDeleted());
        if (isNew) {
            // 新增操作
            articles.setViews(0); // 初始化阅读量为 0
            articles.setCreatedAt(LocalDateTime.now()); // 设置创建时间
            articles.setUpdateAt(LocalDateTime.now());
        } else {
            // 更新操作
            // 获取数据库数据view
            articles.setUpdateAt(LocalDateTime.now()); // 设置更新时间
        }

        return articles;
    }

}
