package fun.struct.myblog.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 *  自定义用户权限不足的处理
 */
@Component
public class AuthAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException {
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        String value = new ObjectMapper().writeValueAsString(Result.of(ResultCode.FORBIDDEN,"权限不足！"));
        response.getWriter().write(value);
    }
}