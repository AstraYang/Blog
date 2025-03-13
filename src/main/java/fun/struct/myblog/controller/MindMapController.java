package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.ArticlesDto;
import fun.struct.myblog.dto.MindMapDTO;
import fun.struct.myblog.entity.MindMap;
import fun.struct.myblog.mapper.MindMapMapper;
import fun.struct.myblog.service.MindMapService;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/map")
public class MindMapController {

    @Resource
    private MindMapService mindMapService;

    @GetMapping("/public/list")
    public Result getMindMapList(@RequestParam int page,
                                 @RequestParam int size){
        Page<MindMap> mindMapPage =mindMapService.getPaginatedMindMaps(page,size);

        return Result.of(ResultCode.SUCCESS,mindMapPage);
    }

    @GetMapping("/public/getMindMapById/{id}")
    public Result getMindMapById(@PathVariable("id") Integer id){
        MindMap mindMap = mindMapService.getById(id);
        return Result.of(ResultCode.SUCCESS,mindMap);
    }
    @PostMapping("/add")
    public Result addMindMap(@RequestBody MindMapDTO mindMapDTO){
        final String mindMapJson = "{\"nodes\":[{\"id\":\"1\",\"data\":{\"url\":\"http://localhost:5173/article/49\",\"color\":\"#ffd700\",\"label\":\"根节点\"},\"type\":\"circle\",\"width\":100,\"height\":100,\"dragging\":false,\"position\":{\"x\":282.38298794860924,\"y\":178.1711630481342},\"selected\":true,\"positionAbsolute\":{\"x\":282.38298794860924,\"y\":178.1711630481342}}],\"edges\":[]}";

        MindMap mindMap = new MindMap();
        mindMap.setTitle(mindMapDTO.getTitle());
        mindMap.setSummary(mindMapDTO.getSummary());
        System.out.println("Map的数据："+mindMapDTO);

        // 设置数据，如果没有提供则使用默认值
        mindMap.setData((!Objects.equals(mindMapDTO.getData(), null) ? mindMapDTO.getData() : mindMapJson));
        mindMap.setCreatedAt(LocalDateTime.now());

        // 保存思维导图
        mindMapService.save(mindMap);

        // 获取新创建的ID
        Integer mindMapId = mindMap.getId();

        // 返回成功的结果，并包含新创建的ID
        return Result.of(ResultCode.SUCCESS, "添加成功", mindMapId);
    }



    @PostMapping("/update/{id}")
    public Result upDateMindMap(@RequestBody MindMapDTO mindMapDTO, @PathVariable("id") Integer id) {
        System.out.println("Map更新的数据："+mindMapDTO);
        mindMapService.updateMindMap(id,mindMapDTO);
        return Result.of(ResultCode.SUCCESS,"修改Map成功");
    }

    @DeleteMapping("/delete")
    public Result deleteTags(@RequestBody List<Integer> ids) {
        if (ids == null || ids.isEmpty()) {
            return Result.of(ResultCode.FAIL, "分类 ID 列表不能为空");
        }
        boolean success = mindMapService.deleteMindMapByIds(ids);
        if (success) {
            System.out.println("删除成功:"+ids);
            return Result.of(ResultCode.SUCCESS, "删除成功");
        } else {
            return Result.of(ResultCode.FAIL, "删除失败");
        }
    }


}
