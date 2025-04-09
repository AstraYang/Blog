package fun.struct.myblog.util;

import fun.struct.myblog.service.RedisVisitService;
import fun.struct.myblog.service.VisitStatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Slf4j
@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final VisitStatService visitStatService;
    private final RedisVisitService redisVisitService;

    /**
     * 每天凌晨1点将前一天的数据同步到数据库
     */
    @Scheduled(cron = "0 0 1 * * ?")
    public void syncDailyStats() {
        try {
            LocalDate yesterday = LocalDate.now().minusDays(1);
            log.info("开始同步访问数据到数据库: {}", yesterday);
            visitStatService.syncVisitsToDB(yesterday);
            log.info("访问数据同步完成");
        } catch (Exception e) {
            log.error("同步访问数据出错", e);
        }
    }

    /**
     * 每月1号凌晨2点执行旧数据清理
     */
    @Scheduled(cron = "0 0 2 1 * ?")
    public void cleanupOldData() {
        try {
            log.info("开始清理旧的访问数据");
            visitStatService.cleanupOldData();

            // 删除Redis中两个月前的数据
            LocalDate twoMonthsAgo = LocalDate.now().minusMonths(2);
            for (int i = 0; i < 31; i++) {
                LocalDate dateToDelete = twoMonthsAgo.plusDays(i);
                redisVisitService.clearOldData(dateToDelete);
            }

            log.info("旧数据清理完成");
        } catch (Exception e) {
            log.error("清理旧数据出错", e);
        }
    }
}
