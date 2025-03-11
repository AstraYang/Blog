package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.MindMapDTO;
import fun.struct.myblog.entity.MindMap;
import fun.struct.myblog.mapper.MindMapMapper;
import fun.struct.myblog.service.MindMapService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class MindMapServiceImpl extends ServiceImpl<MindMapMapper, MindMap> implements MindMapService {

    @Resource
    private MindMapMapper mindMapMapper;
    @Override
    public Page<MindMap> getPaginatedMindMaps(int page, int size) {
        // 创建 Page 对象，指定当前页和每页大小
        Page<MindMap> mindMapPage = new Page<>(page, size);

        // 执行分页查询
        return mindMapMapper.selectPage(mindMapPage, null); // 第二个参数为查询条件，可以为 null
    }

    @Override
    public int updateMindMap(Integer id, MindMapDTO mindMapDTO) {
        MindMap mindMap = new MindMap();
        mindMap.setId(id);
        mindMap.setTitle(mindMapDTO.getTitle());
        mindMap.setSummary(mindMapDTO.getSummary());
        mindMap.setData((!Objects.equals(mindMapDTO.getData(), "") ? mindMapDTO.getData() : null));
        mindMap.setUpdatedAt(LocalDateTime.now());
        mindMapMapper.updateById(mindMap);
        return id;
    }

    @Override
    public boolean deleteMindMapByIds(List<Integer> ids) {
        int deletedRows = mindMapMapper.deleteMindMapByIds("mind_map", "mind_map_id",ids);
        return deletedRows > 0;
    }
}
