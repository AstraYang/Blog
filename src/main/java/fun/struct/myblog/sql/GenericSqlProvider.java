package fun.struct.myblog.sql;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.jdbc.SQL;

import java.util.List;
import java.util.stream.Collectors;

public class GenericSqlProvider {

    public String deleteByIds(@Param("tableName") String tableName, @Param("idColumn") String idColumn, @Param("ids") List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("ID 列表不能为空");
        }

        // 动态拼接 SQL
        String idList = ids.stream()
                .map(String::valueOf)
                .collect(Collectors.joining(","));

        return new SQL() {{
            DELETE_FROM(tableName);
            WHERE(idColumn + " IN (" + idList + ")");
        }}.toString();
    }
}
