package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.entity.Category;
import fun.struct.myblog.service.CategoryService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/category")
public class CategoryController {

    @Resource
    private CategoryService categoryService;
    @GetMapping("/{id}")
    public Result getCategoryById(@PathVariable("id") Integer id) {
        System.out.println("id:"+id);
        Category category = categoryService.getCategory(id);
        if (category == null) {
            return Result.of(ResultCode.NOT_FOUND, "分类不存在");
        }
        return Result.of(ResultCode.SUCCESS,category);
    }

    @GetMapping("/list")
    public Result getCategoryList() {
        return Result.of(ResultCode.SUCCESS,categoryService.getCategoryList());
    }

}
