package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.MindMapDTO;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.entity.Books;
import fun.struct.myblog.entity.MindMap;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.MindMapMapper;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.MindMapService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class MindMapServiceImpl extends ServiceImpl<MindMapMapper, MindMap> implements MindMapService {

    @Resource
    private MindMapMapper mindMapMapper;

    @Resource
    private UserMapper userMapper;
    @Override
    public Page<MindMap> getPaginatedMindMaps(int page, int size) {
        Page<MindMap> mindMapPage = new Page<>(page, size);
        QueryWrapper<MindMap> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByDesc("COALESCE(updated_at, created_at)");

        return mindMapMapper.selectPage(mindMapPage, queryWrapper);
    }

    @Override
    public Page<MindMap> getPaginatedMindMapsP(Integer uId, int page, int size) {
        User user = userMapper.selectById(uId);
        Page<MindMap> mindMapPage = new Page<>(page, size);
        if (user != null){
            QueryWrapper<MindMap> queryWrapper = new QueryWrapper<>();
            if ("ADMIN".equalsIgnoreCase(user.getAuthority())){
                queryWrapper.orderByDesc("COALESCE(updated_at, created_at)");

            }else {
                queryWrapper.eq("author", uId);
            }
            return mindMapMapper.selectPage(mindMapPage, queryWrapper);
        }
        return null;
    }


    @Override
    public Page<MindMap> searchMindMapPage(String keyword, int current, int size, Integer uId) {
        Page<MindMap> page = new Page<>(current, size);
        LambdaQueryWrapper<MindMap> queryWrapper = new LambdaQueryWrapper<>();
        if (uId != null) {
            User user = userMapper.selectById(uId);
            if (user != null) {
                if (!"ADMIN".equalsIgnoreCase(user.getAuthority())) {
                    queryWrapper.eq(MindMap::getAuthor, uId);
                }
            }
        }
        queryWrapper.and(wrapper -> wrapper
                        .like(StringUtils.hasText(keyword), MindMap::getTitle, keyword)
                        .or()
                        .like(StringUtils.hasText(keyword), MindMap::getSummary, keyword)
                )
                .orderByDesc(MindMap::getCreatedAt);

        return page(page, queryWrapper);
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
