package fun.struct.myblog.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.util.JwtUtils;
import fun.struct.myblog.util.SpringContextUtils;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.util.StringUtils;

import java.io.IOException;
import java.util.Collections;

/**
 * @Description: 自定义token验证过滤器，验证成功后将用户信息放入SecurityContext上下文
 */
public class JwtAuthenticationFilter extends BasicAuthenticationFilter {

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager) {
        super(authenticationManager);
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException {
        try {
            //获取请求头中的token
            String authorizationHeader = request.getHeader("Authorization");
            String jwtToken = null;
            if (StringUtils.hasLength(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
                jwtToken = authorizationHeader.substring(7); // 去掉 "Bearer " 前缀
            }
            if (request.getRequestURI().equals("/admin/user/login")) {
                // 如果是登录请求，直接放行，不进行 token 验证
                filterChain.doFilter(request, response);
                return;
            }
            if (request.getRequestURI().equals("/admin/user/signup")) {
                // 如果是登录请求，直接放行，不进行 token 验证
                filterChain.doFilter(request, response);
                return;
            }


            // 其他请求处理 token 验证逻辑
            if (!StringUtils.hasLength(jwtToken)) {
                filterChain.doFilter(request, response);
                return; // token 不存在，继续处理后续逻辑
            }

            //过滤器中无法初始化Bean组件，使用上下文获取
            JwtUtils jwtUtils = SpringContextUtils.getBean("jwtUtils");
            if (jwtUtils == null) {
                throw new RuntimeException();
            }

            //解析jwt令牌
            Claims claims;
            System.out.println("jwtToken = " + jwtToken);

            try {
                claims = jwtUtils.parseJwt(jwtToken);
            } catch (Exception ex) {
                throw new RuntimeException();
            }

            //获取用户信息
            String username = (String) claims.get("username"); //用户名
            String authorityString = (String) claims.get("authorityString"); //权限信息
            System.out.println("username = " + username);
            System.out.println("authorityString = " + authorityString);

            Authentication authentication = new UsernamePasswordAuthenticationToken(
                    username, null,
                    Collections.singleton(new SimpleGrantedAuthority(authorityString))
            );

            //将用户信息放入SecurityContext上下文
            SecurityContextHolder.getContext().setAuthentication(authentication);

            filterChain.doFilter(request, response);
        } catch (Exception ex) {
            //过滤器中抛出的异常无法被全局异常处理器捕获，直接返回错误结果
            response.setCharacterEncoding("utf-8");
            response.setContentType("application/json; charset=utf-8");
            String value = new ObjectMapper().writeValueAsString(Result.of(ResultCode.UNAUTHORIZED, "token已失效！"));
            response.getWriter().write(value);
        }
    }
}