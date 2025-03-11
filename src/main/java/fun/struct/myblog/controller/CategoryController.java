package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.entity.Category;
import fun.struct.myblog.service.CategoryService;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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
    @PostMapping("/add")
    public Result addCategory(@RequestParam("categoryName") String categoryName) {
        Category category = new Category();
        category.setCategoryName(categoryName);
        category.setCreatedAt(LocalDateTime.now());
        categoryService.save(category);
        System.out.println("添加成功:"+category);
        return Result.of(ResultCode.SUCCESS,"添加成功");
    }

    @DeleteMapping("/delete")
    public Result deleteCategories(@RequestBody List<Integer> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return Result.of(ResultCode.FAIL, "分类 ID 列表不能为空");
        }
        boolean success = categoryService.deleteCategoriesByIds(categoryIds);
        if (success) {
            System.out.println("删除成功:"+categoryIds);
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }


}
