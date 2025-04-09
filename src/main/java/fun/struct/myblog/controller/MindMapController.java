package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.MindMapDTO;
import fun.struct.myblog.entity.MindMap;
import fun.struct.myblog.service.MindMapService;
import jakarta.annotation.Resource;
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

    @GetMapping("/admin/list")
    public Result getMindMapManagementList(@RequestParam int page,
                                           @RequestParam int size,
                                           Integer uId){
        Page<MindMap> mindMapPage =mindMapService.getPaginatedMindMapsP(uId, page, size);

        return Result.of(ResultCode.SUCCESS,mindMapPage);
    }

    @GetMapping("/public/search/page")
    public Result searchMindMapWithPage(@RequestParam String keyword,
                                        @RequestParam(defaultValue = "1") int page,
                                        @RequestParam(defaultValue = "10") int size,
                                        @RequestParam(required = false) Integer uId){
        Page<MindMap> mindMapPage = mindMapService.searchMindMapPage(keyword, page, size, uId);

        return Result.of(ResultCode.SUCCESS,mindMapPage);
    }

    @GetMapping("/public/getMindMapById/{id}")
    public Result getMindMapById(@PathVariable("id") Integer id){
        MindMap mindMap = mindMapService.getById(id);
        return Result.of(ResultCode.SUCCESS,mindMap);
    }
    @PostMapping("/add")
    public Result addMindMap(@RequestBody MindMapDTO mindMapDTO){
        final String mindMapJson = "{\"nodes\":[{\"id\":\"1\",\"type\":\"base\",\"position\":{\"x\":250,\"y\":100},\"data\":{\"iconType\":\"l1\",\"text\":\"应用层\",\"id\":\"node1\",\"type\":\"primary\"},\"measured\":{\"width\":95,\"height\":32}},{\"id\":\"2\",\"type\":\"base\",\"position\":{\"x\":250,\"y\":200},\"data\":{\"iconType\":\"l2\",\"text\":\"服务层\",\"id\":\"node2\"},\"measured\":{\"width\":95,\"height\":32}},{\"id\":\"3\",\"type\":\"base\",\"position\":{\"x\":250,\"y\":300},\"data\":{\"iconType\":\"l3\",\"text\":\"数据层\",\"id\":\"node3\",\"link\":\"https://example.com\"},\"measured\":{\"width\":95,\"height\":32}}],\"edges\":[{\"id\":\"e1-2\",\"source\":\"1\",\"target\":\"2\",\"type\":\"custom\",\"data\":{\"label\":\"连接\",\"showLabel\":true}},{\"id\":\"e2-3\",\"source\":\"2\",\"target\":\"3\",\"type\":\"custom\",\"data\":{\"label\":\"持续升级\",\"showLabel\":true}}]}";
        MindMap mindMap = new MindMap();
        mindMap.setTitle(mindMapDTO.getTitle());
        mindMap.setSummary(mindMapDTO.getSummary());

        // 设置数据，如果没有提供则使用默认值
        mindMap.setData((!Objects.equals(mindMapDTO.getData(), null) ? mindMapDTO.getData() : mindMapJson));
        mindMap.setAuthor(mindMapDTO.getAuthor());
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
        int update = mindMapService.updateMindMap(id,mindMapDTO);
        if (update == 0) {
            return Result.of(ResultCode.FAIL, "修改Map失败");
        }
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
