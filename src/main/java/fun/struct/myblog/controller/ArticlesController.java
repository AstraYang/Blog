package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.ArticleQueryDTO;
import fun.struct.myblog.dto.ArticlesUpdateByIdsDTO;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.dto.ArticleStatusDTO;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.mapper.ArticlesMapper;
import fun.struct.myblog.service.ArticlesService;
import fun.struct.myblog.service.ArticlesTagsService;
import fun.struct.myblog.vo.ArticleDataVo;
import fun.struct.myblog.vo.ArticleManagementListVO;
import fun.struct.myblog.vo.ArticleVO;
import fun.struct.myblog.vo.ArticlesListVo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("articles")
public class ArticlesController {

    @Resource
    private ArticlesService articlesService;
    @Resource
    private ArticlesMapper articlesMapper;
    @Resource
    private ArticlesTagsService articlesTagsService;


    // 获取公共文章列表
    @GetMapping("/public/articles")
    public Result getArticles(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) Integer categoryId
    ) {
        List<String> conditions = new ArrayList<>();
        conditions.add("a.is_deleted = 0 AND a.is_status = 1");
        if (categoryId != null) {
            conditions.add("a.category_id = " + categoryId);
        }
         // 拼接 WHERE 条件
        String whereClause = String.join(" AND ", conditions);
        Page<ArticlesListVo> articlesP = articlesMapper.selectArticlesPage(new Page<>(page, size), whereClause);
        System.out.println(articlesP);
        return Result.of(ResultCode.SUCCESS,articlesP);
    }

    /**
     * 带分页的模糊搜索
     */
    @GetMapping("/public/search/page")
    public Result searchArticlesWithPage(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<Articles> articlesP = articlesService.searchArticlesWithPage(keyword, page, size);
        System.out.println(articlesP);
        return Result.of(ResultCode.SUCCESS,articlesP);
    }



    // 获取admin文章管理列表
    @GetMapping("/articleList")
    public Result getArticleList(
            @RequestParam int page,
            @RequestParam int size,
            ArticleQueryDTO queryDTO) {
        Page<ArticleManagementListVO> articlesP = articlesService.getPaginatedArticles( new Page<>(page, size),queryDTO);
        return Result.of(ResultCode.SUCCESS,articlesP);
    }

    // 获取文章详情页数据
    @GetMapping("/public/{articleId}")
    public Result getArticle(@PathVariable("articleId") Integer articleId) {
        ArticleVO articleVO = articlesService.selectArticleDetail(articleId);
        return Result.of(ResultCode.SUCCESS, articleVO);
    }

    // 获取文章编辑页数据
    @GetMapping("/fetch/{articleId}")
    public Result fetchArticleById(@PathVariable("articleId") Integer articleId){
        ArticleDataVo articleDataVo = articlesService.getArticle(articleId);
        articleDataVo.setTags(articlesTagsService.getArticleTags(articleId));
        return Result.of(ResultCode.SUCCESS,articleDataVo);
    }

    // 添加文章
    @PostMapping("/add")
    public Result addArticle(@RequestBody ArticlesDto articlesDto) {
        Integer articleId =  articlesService.addArticle(articlesDto);
        articlesTagsService.addArticleTags(articleId, articlesDto.getTags());
        return Result.of(ResultCode.SUCCESS,"添加文章成功");
    }


    // 修改文章数据
    @PostMapping("/upDate/{articleId}")
    public Result upDateArticle(@RequestBody ArticlesDto articlesDto,@PathVariable("articleId") Integer articleId) {
        System.out.println("更新的数据："+articlesDto);
        articlesTagsService.updateArticleTags(articleId, articlesDto.getTags());
        boolean success = articlesService.updateArticle(articleId,articlesDto);
        if (!success) {
            return Result.of(ResultCode.FAIL, "修改文章失败");
        }
        return Result.of(ResultCode.SUCCESS,"修改文章成功");
    }

//    设置文章发布状态
    @PostMapping("/setStatus")
    public Result setStatus(@RequestBody ArticleStatusDTO ArticleStatusDTO) {
        System.out.println("更新的数据："+ArticleStatusDTO);
        boolean success = articlesService.updateArticleStatus(ArticleStatusDTO.getArticleId(), ArticleStatusDTO.isStatus());
        if (!success) {
            return Result.of(ResultCode.FAIL, "修改文章状态失败");
        }
        return Result.of(ResultCode.SUCCESS,"修改文章状态成功");
    }

    // 删除文（软删除)
    @DeleteMapping("/delete/soft")
    public Result deleteArticles(@RequestBody ArticlesUpdateByIdsDTO articlesUpdateByIdsDTO) {
        boolean success = articlesService.updateArticleDelByIds(articlesUpdateByIdsDTO.getIds(), articlesUpdateByIdsDTO.isDel());
        if (success) {
            System.out.println("删除成功:"+ articlesUpdateByIdsDTO.getIds());
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }

//    删除数据库记录
    @DeleteMapping("/delete/hard")
    public Result deleteArticles(@RequestBody List<Integer> articleIds) {
        if (articleIds == null || articleIds.isEmpty()) {
            return Result.of(ResultCode.FAIL, "分类 ID 列表不能为空");
        }
        boolean success = articlesService.deleteArticleByIds(articleIds);
        if (success) {
            System.out.println("删除成功:"+articleIds);
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }

}
