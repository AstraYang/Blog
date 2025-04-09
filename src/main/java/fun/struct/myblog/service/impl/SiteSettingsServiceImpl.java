package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.SiteSettings;
import fun.struct.myblog.mapper.SiteSettingsMapper;
import fun.struct.myblog.service.SiteSettingsService;
import org.springframework.stereotype.Service;

@Service
public class SiteSettingsServiceImpl extends ServiceImpl<SiteSettingsMapper, SiteSettings> implements SiteSettingsService {
}
