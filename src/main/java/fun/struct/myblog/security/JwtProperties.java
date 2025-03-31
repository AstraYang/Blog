package fun.struct.myblog.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    private String signingKey; // 签名密钥
    private Long expire; // 过期时间（单位：毫秒）

}
