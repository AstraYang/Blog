package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.SiteSettings;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SiteSettingsMapper extends BaseMapper<SiteSettings> {
}
