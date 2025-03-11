package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.Tags;

import java.util.List;

public interface TagsService extends IService<Tags> {
    List<Tags> getTagsList();
    List<Tags> getTagsList(Integer id);
    boolean deleteTagByIds(List<Integer> tagIds);
}
