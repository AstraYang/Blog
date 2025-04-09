package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.DailyVisit;
import fun.struct.myblog.vo.MonthlyVisitsGroupedVO;
import fun.struct.myblog.vo.MonthlyVisitsVO;

import java.time.LocalDate;
import java.util.List;

public interface VisitStatService extends IService<DailyVisit> {

    void syncVisitsToDB(LocalDate date);

    void cleanupOldData();

    List<DailyVisit> getLast30DaysData();

    List<MonthlyVisitsGroupedVO> getGroupedMonthlyVisits();

}
