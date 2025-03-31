package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.MindMapDTO;
import fun.struct.myblog.entity.MindMap;

import java.util.List;

public interface MindMapService extends IService<MindMap> {
    Page<MindMap> getPaginatedMindMaps(int page, int size);
    int updateMindMap(Integer id, MindMapDTO mindMapDTO);
    boolean deleteMindMapByIds(List<Integer> ids);

}
