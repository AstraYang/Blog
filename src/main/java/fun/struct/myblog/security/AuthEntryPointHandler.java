package fun.struct.myblog.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * @Description: 自定义用户未登录的处理（未携带token）
 */
@Component
public class AuthEntryPointHandler implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        String value = new ObjectMapper().writeValueAsString(Result.of(ResultCode.NOT_FOUND,"未携带token！"));
        response.getWriter().write(value);
    }
}