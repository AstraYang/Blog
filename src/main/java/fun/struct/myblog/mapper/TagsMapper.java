package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.Tags;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TagsMapper extends BaseMapper<Tags> {
}
