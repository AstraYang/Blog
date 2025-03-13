package fun.struct.myblog.util;

import fun.struct.myblog.security.JwtProperties;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

/**
 * @Description: 生成和解析jwt令牌
 * @Author: 翰戈.summer
 * @Date: 2023/11/16
 * @Param:
 * @Return:
 */
@Component
@RequiredArgsConstructor
public class JwtUtils {

    private final JwtProperties jwtProperties;

    /**
     * @Description: 生成令牌
     */
        public String getJwt(Map<String, Object> claims) {
        try {
            System.out.println("claims = " + claims);
            Key signingKey = Keys.hmacShaKeyFor(jwtProperties.getSigningKey().getBytes());
            Long expire = jwtProperties.getExpire();

            // 检查过期时间
            if (expire == null) {
                throw new IllegalStateException("JWT expiration time is not set in the configuration.");
            }

            return Jwts.builder()
                    .setClaims(claims) // 设置载荷内容
                    .signWith(signingKey) // 设置签名密钥
                    .setExpiration(new Date(System.currentTimeMillis() + expire * 1000)) // 设置有效时间，以秒为单位
                    .compact();
        } catch (Exception e) {
            // 记录异常并抛出
            System.err.println("Error generating JWT: " + e.getMessage());
            throw e; // 或者抛出自定义异常
        }
    }


    /**
     * @Description: 解析令牌
     */
    public Claims parseJwt(String jwt) {

        Key signingKey = Keys.hmacShaKeyFor(jwtProperties.getSigningKey().getBytes());

        return Jwts.parserBuilder()
                .setSigningKey(signingKey) // 指定签名密钥
                .build() // 构建解析器
                .parseClaimsJws(jwt) // 开始解析令牌
                .getBody();
    }
}