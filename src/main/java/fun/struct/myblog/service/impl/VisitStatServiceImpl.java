package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;

import fun.struct.myblog.entity.DailyVisit;
import fun.struct.myblog.mapper.DailyVisitMapper;
import fun.struct.myblog.service.RedisVisitService;
import fun.struct.myblog.service.VisitStatService;
import fun.struct.myblog.vo.MonthlyVisitsGroupedVO;
import fun.struct.myblog.vo.MonthlyVisitsVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VisitStatServiceImpl extends ServiceImpl<DailyVisitMapper, DailyVisit> implements VisitStatService {

    private final RedisVisitService redisVisitService;
    private final DailyVisitMapper dailyVisitMapper;

    /**
     * 同步Redis中的访问数据到数据库
     */
    @Override
    public void syncVisitsToDB(LocalDate date) {
        Long visitCount = redisVisitService.getVisitCount(date);
        Long uniqueVisitors = redisVisitService.getUniqueVisitorCount(date);

        if (visitCount <= 0) {
            return;
        }

        // 查询是否已存在该日期的记录
        System.out.println("visitCount = " + visitCount);
        System.out.println("uniqueVisitors = " + uniqueVisitors);
        LambdaQueryWrapper<DailyVisit> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(DailyVisit::getVisitDate, date);
        DailyVisit existingVisit = getOne(queryWrapper);

        if (existingVisit != null) {
            // 更新记录
            existingVisit.setVisitCount(visitCount);
            existingVisit.setUniqueVisitors(uniqueVisitors);
            updateById(existingVisit);
        } else {
            // 插入新记录
            DailyVisit newVisit = new DailyVisit();
            newVisit.setVisitDate(date);
            newVisit.setVisitCount(visitCount);
            newVisit.setUniqueVisitors(uniqueVisitors);
            save(newVisit);
        }
    }

    /**
     * 清理旧数据
     */
    @Override
    public void cleanupOldData() {
        // 保留当前月和上个月的数据，删除更早的数据
        LocalDate firstDayOfPrevMonth = LocalDate.now()
                .minusMonths(1)
                .with(TemporalAdjusters.firstDayOfMonth());

        baseMapper.deleteOlderThan(firstDayOfPrevMonth);
    }

    /**
     * 获取最近30天的访问数据
     */
    @Override
    public List<DailyVisit> getLast30DaysData() {
        LocalDate thirtyDaysAgo = LocalDate.now().minusDays(30);
        return baseMapper.findLast30Days(thirtyDaysAgo);
    }


    @Override
    public List<MonthlyVisitsGroupedVO> getGroupedMonthlyVisits() {
        List<MonthlyVisitsVO> visits = dailyVisitMapper.selectMonthVisits();
        Map<String, MonthlyVisitsGroupedVO> groupedData = new HashMap<>();

        for (MonthlyVisitsVO visit : visits) {
            String month = visit.getMonth();
            Integer count = visit.getCount();

            // 如果这个月的记录还没有创建，则创建一个新的
            if (!groupedData.containsKey(month)) {
                MonthlyVisitsGroupedVO groupedVO = new MonthlyVisitsGroupedVO();
                groupedVO.setMonth(month);
                groupedVO.setCount(new ArrayList<>());
                groupedData.put(month, groupedVO);
            }

            groupedData.get(month).getCount().add(count);
        }

        return new ArrayList<>(groupedData.values());
    }


}
