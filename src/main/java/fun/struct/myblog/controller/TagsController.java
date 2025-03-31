package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.entity.Tags;
import fun.struct.myblog.service.TagsService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/tags")
public class TagsController {
    @Resource
    private TagsService tagsService;

    @GetMapping("/list")
    public Object getTagsList() {
        return Result.of(ResultCode.SUCCESS,tagsService.getTagsList());
    }

    @PostMapping("/add")
    public Result addCategory(@RequestParam("tagName") String tagName) {
        Tags tags = new Tags();
        tags.setTagName(tagName);
        tags.setCreatedAt(LocalDateTime.now());
        tagsService.save(tags);
        System.out.println("添加成功:"+tags);
        return Result.of(ResultCode.SUCCESS,"添加成功");
    }

    @DeleteMapping("/delete")
    public Result deleteTags(@RequestBody List<Integer> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return Result.of(ResultCode.FAIL, "分类 ID 列表不能为空");
        }
        boolean success = tagsService.deleteTagByIds(tagIds);
        if (success) {
            System.out.println("删除成功:"+tagIds);
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }

}

