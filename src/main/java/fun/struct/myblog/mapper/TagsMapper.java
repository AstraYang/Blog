package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.Tags;
import fun.struct.myblog.sql.GenericSqlProvider;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

@Mapper
public interface TagsMapper extends BaseMapper<Tags> {

    @DeleteProvider(type = GenericSqlProvider.class, method = "deleteByIds")
    int deleteTagByIds(@Param("tableName") String tableName,
                              @Param("idColumn") String idColumn,
                              @Param("ids") List<Integer> ids);
}
