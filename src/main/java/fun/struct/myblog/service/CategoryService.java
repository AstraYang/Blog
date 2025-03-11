package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.Category;
import fun.struct.myblog.vo.CategoryListVo;

import java.util.List;

public interface CategoryService extends IService<Category> {
//    获取分类
    List<CategoryListVo> getCategoryList();
    boolean deleteCategoriesByIds(List<Integer> categoryIds);
    Category getCategory(Integer id);
}
