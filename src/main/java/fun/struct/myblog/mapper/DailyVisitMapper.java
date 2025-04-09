package fun.struct.myblog.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import fun.struct.myblog.entity.DailyVisit;
import fun.struct.myblog.vo.MonthlyVisitsVO;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface DailyVisitMapper extends BaseMapper<DailyVisit> {

    @Select("SELECT * FROM daily_visits WHERE visit_date >= #{startDate} ORDER BY visit_date ASC")
    List<DailyVisit> findLast30Days(@Param("startDate") LocalDate startDate);

    @Delete("DELETE FROM daily_visits WHERE visit_date < #{date}")
    int deleteOlderThan(@Param("date") LocalDate date);


    @Select("""
    SELECT DATE_FORMAT(visit_date, '%m') AS month,visit_count AS count
    FROM daily_visits
    """)
    List<MonthlyVisitsVO> selectMonthVisits();
}