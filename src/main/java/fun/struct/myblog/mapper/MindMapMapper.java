package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.MindMap;
import fun.struct.myblog.sql.GenericSqlProvider;
import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface MindMapMapper extends BaseMapper<MindMap> {
    @DeleteProvider(type = GenericSqlProvider.class, method = "deleteByIds")
    int deleteMindMapByIds(@Param("tableName") String tableName,
                       @Param("idColumn") String idColumn,
                       @Param("ids") List<Integer> ids);
}
