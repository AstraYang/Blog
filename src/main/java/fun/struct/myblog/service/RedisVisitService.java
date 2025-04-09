package fun.struct.myblog.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
public class RedisVisitService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String DAILY_VISITS_KEY = "daily_visits";
    private static final String UNIQUE_VISITORS_KEY = "unique_visitors";
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * 记录访问量
     */
    public void recordVisit(String userId) {
        String today = LocalDate.now().format(DATE_FORMAT);

        // 增加总访问量
        redisTemplate.opsForHash().increment(DAILY_VISITS_KEY, today, 1);

        // 记录唯一访问用户
        String uniqueVisitorKey = UNIQUE_VISITORS_KEY + ":" + today;
        if (userId != null && !userId.isEmpty()) {
            redisTemplate.opsForSet().add(uniqueVisitorKey, userId);
        } else {
            redisTemplate.opsForSet().add(uniqueVisitorKey, "guest"); // 记录游客
        }
    }



    /**
     * 获取指定日期的访问量
     */
    public Long getVisitCount(LocalDate date) {
        String dateStr = date.format(DATE_FORMAT);
        Object count = redisTemplate.opsForHash().get(DAILY_VISITS_KEY, dateStr);
        return count == null ? 0L : Long.parseLong(count.toString());
    }

    /**
     * 获取指定日期的唯一访客数
     */
    public Long getUniqueVisitorCount(LocalDate date) {
        String dateStr = date.format(DATE_FORMAT);
        Long size = redisTemplate.opsForSet().size(UNIQUE_VISITORS_KEY + ":" + dateStr);
        return size == null ? 0L : size;
    }

    /**
     * 清理Redis中的旧数据
     */
    public void clearOldData(LocalDate date) {
        String dateStr = date.format(DATE_FORMAT);
        redisTemplate.opsForHash().delete(DAILY_VISITS_KEY, dateStr);
        redisTemplate.delete(UNIQUE_VISITORS_KEY + ":" + dateStr);
    }
}
