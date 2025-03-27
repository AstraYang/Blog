package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.Category;
import fun.struct.myblog.sql.GenericSqlProvider;
import fun.struct.myblog.vo.CategoryListVo;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface CategoryMapper extends BaseMapper<Category> {

    @Select("""
    SELECT
        c.category_id AS id, c.category_name, c.created_at, COUNT(a.articles_id) AS count
    FROM
        category AS c LEFT JOIN articles AS a ON a.category_id = c.category_id AND a.is_deleted = 0
    GROUP BY
        c.category_id, c.category_name, c.created_at;
    """)
    List<CategoryListVo> getCategoryListVo();

    @DeleteProvider(type = GenericSqlProvider.class, method = "deleteByIds")
    int deleteCategoriesByIds(@Param("tableName") String tableName,
                                   @Param("idColumn") String idColumn,
                                   @Param("ids") List<Integer> ids);


}
