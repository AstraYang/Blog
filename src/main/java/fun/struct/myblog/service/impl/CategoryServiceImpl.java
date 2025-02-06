package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.Category;
import fun.struct.myblog.mapper.CategoryMapper;
import fun.struct.myblog.service.CategoryService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Override
    public Category getCategory(Integer id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid category ID");
        }
        return getById(id);
    }

    @Override
    public List<Category> getCategoryList(){
        return this.list();
    }

}

