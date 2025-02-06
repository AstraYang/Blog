package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.service.TagsService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/tags")
public class TagsController {
    @Resource
    private TagsService tagsService;

    @GetMapping("/list")
    public Object getTagsList() {
        return Result.of(ResultCode.SUCCESS,tagsService.getTagsList());
    }

}

