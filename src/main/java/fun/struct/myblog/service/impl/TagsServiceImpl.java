package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.Tags;
import fun.struct.myblog.mapper.TagsMapper;
import fun.struct.myblog.service.TagsService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagsServiceImpl extends ServiceImpl<TagsMapper, Tags> implements TagsService {

    @Resource TagsMapper tagsMapper;
    public List<Tags> getTagsList(Integer id) {
        QueryWrapper<Tags> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("articles_id", id);
        return this.list(queryWrapper);
    }

    public List<Tags> getTagsList() {
        return this.list();
    }

    public boolean deleteTagByIds(List<Integer> tagIds) {
        int deletedRows = tagsMapper.deleteTagByIds("tags", "tag_id",tagIds);
        return deletedRows > 0;
    }
}
