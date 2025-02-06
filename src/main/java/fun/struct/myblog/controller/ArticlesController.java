package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.mapper.ArticlesMapper;
import fun.struct.myblog.service.ArticlesService;
import fun.struct.myblog.service.ArticlesTagsService;
import fun.struct.myblog.vo.ArticlesListVo;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("admin/articles")
public class ArticlesController {

    @Resource
    private ArticlesService articlesService;
    @Resource
    private ArticlesMapper articlesMapper;
    @Resource
    private ArticlesTagsService articlesTagsService;

    @GetMapping("/articles")
    public Result getArticles(
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) Integer categoryId
    ) {
        List<String> conditions = new ArrayList<>();
        conditions.add("a.is_deleted = 0");
        if (categoryId != null) {
            conditions.add("a.category_id = " + categoryId);
        }
         // 拼接 WHERE 条件
        String whereClause = String.join(" AND ", conditions);
        Page<ArticlesListVo> articlesP = articlesMapper.selectArticlesPage(new Page<>(page, size), whereClause);
        System.out.println(articlesP);
        return Result.of(ResultCode.SUCCESS,articlesP);
    }

    @GetMapping("/article/{id}")
    public Result getArticle(@PathVariable("id") Integer id) {
        ArticlesVo articlesVo = articlesService.getArticle(id);
        if (articlesVo == null) {
            return Result.of(ResultCode.NOT_FOUND, "文章不存在");
        }
        return Result.of(ResultCode.SUCCESS,articlesVo);
    }

    @PostMapping("/add")
    public Result addArticle(@RequestBody ArticlesDto articlesDto) {
        Integer articleId =  articlesService.addArticle(articlesDto);
        articlesTagsService.addArticleTags(articleId, articlesDto.getTags());
        return Result.of(ResultCode.SUCCESS,"添加文章成功");
    }


    @PostMapping("/upDate/{id}")
    public Result upDateArticle(@RequestBody ArticlesDto articlesDto,@PathVariable("id") Integer id) {

        articlesTagsService.updateArticleTags(id, articlesDto.getTags());
        articlesService.updateArticle(id,articlesDto);
        return Result.of(ResultCode.SUCCESS,"修改文章成功");
    }

}
