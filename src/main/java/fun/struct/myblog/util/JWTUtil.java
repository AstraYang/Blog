package fun.struct.myblog.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;

import java.util.Calendar;
import java.util.Map;

public class JWTUtil {

    private static final String SIGNING_KEY = "XIAOSHUANG"; // Token 加密密钥

    /**
     * 生成 Token
     * @param claims 载荷信息
     * @param expirationDays 过期天数
     * @return 生成的 Token
     */
    public static String getToken(Map<String, String> claims, int expirationDays) {
        Calendar instance = Calendar.getInstance();
        instance.add(Calendar.DATE, expirationDays); // 可自定义过期时间

        // 创建 JWT builder
        JWTCreator.Builder builder = JWT.create();

        // 添加 claims
        claims.forEach(builder::withClaim);

        // 生成 Token
        return builder.withExpiresAt(instance.getTime()) // 指定令牌过期时间
                .sign(Algorithm.HMAC256(SIGNING_KEY)); // 签名
    }

    /**
     * 验证 Token 的合法性
     * @param token 要验证的 Token
     * @return 验证后的 DecodedJWT
     * @throws RuntimeException 当 Token 无效时抛出异常
     */
    public static DecodedJWT verify(String token) {
        return JWT.require(Algorithm.HMAC256(SIGNING_KEY)).build().verify(token);
    }

    /**
     * 获取 Token 信息
     *
     * @param token 要解析的 Token
     * @return DecodedJWT
     * @throws RuntimeException 当 Token 无效时抛出异常
     */
    public static Map<String, Claim> getTokenInfo(String token) {
        DecodedJWT decodedJWT = verify(token); // 验证 Token
        return decodedJWT.getClaims(); // 获取 Claim 信息
    }
}
