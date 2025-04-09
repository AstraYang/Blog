package fun.struct.myblog.controller;


import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.entity.DailyVisit;
import fun.struct.myblog.service.RedisVisitService;
import fun.struct.myblog.service.VisitStatService;
import fun.struct.myblog.vo.MonthlyVisitsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class VisitController {

    private final RedisVisitService redisVisitService;
    private final VisitStatService visitStatService;

    /**
     * 记录访问 (仅用于测试,在拦截器或过滤器中调用)
     */
    @GetMapping("/record")
    public String recordVisit(@RequestParam(required = false) String userId) {
        redisVisitService.recordVisit(userId);
        return "访问已记录";
    }

    /**
     * 获取最近30天的访问数据
     */
    @GetMapping("/last30days")
    public List<DailyVisit> getLast30DaysData() {
        return visitStatService.getLast30DaysData();
    }

    /**
     * 手动触发数据同步 (仅用于测试)
     */
    @PostMapping("/sync")
    public String manualSync() {
        visitStatService.syncVisitsToDB(java.time.LocalDate.now());
        return "同步成功";
    }

    @GetMapping("/daily-visits")
    public Result getDailyVisits() {
        return Result.of(ResultCode.SUCCESS,visitStatService.getGroupedMonthlyVisits());
    }


}
