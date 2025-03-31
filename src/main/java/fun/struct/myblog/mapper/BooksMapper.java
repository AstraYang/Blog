package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.Books;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BooksMapper extends BaseMapper<Books> {
}
