package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.Category;

import java.util.List;

public interface CategoryService extends IService<Category> {
//    获取分类
    List<Category> getCategoryList();
    Category getCategory(Integer id);
}
