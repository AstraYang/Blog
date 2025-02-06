package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.Tags;
import fun.struct.myblog.mapper.TagsMapper;
import fun.struct.myblog.service.TagsService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagsServiceImpl extends ServiceImpl<TagsMapper, Tags> implements TagsService {
    public List<Tags> getTagsList(Integer id) {
        QueryWrapper<Tags> queryWrapper = new QueryWrapper<>();

        // 假设 Tags 表中有字段 articles_id，可以用来与文章关联
        queryWrapper.eq("articles_id", id);

        // 调用 baseMapper 提供的 selectList 方法查询数据
        return this.list(queryWrapper);
    }

    public List<Tags> getTagsList() {
        return this.list();
    }
}
