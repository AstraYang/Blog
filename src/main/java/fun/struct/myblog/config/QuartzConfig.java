package fun.struct.myblog.config;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

@Configuration
@EnableScheduling
public class QuartzConfig {
    // 基础配置，使用Spring的@Scheduled注解即可
}
