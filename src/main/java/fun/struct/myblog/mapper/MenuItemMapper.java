package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.MenuItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface MenuItemMapper extends BaseMapper<MenuItem> {
}