package fun.struct.myblog.interceptor;

import fun.struct.myblog.service.RedisVisitService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;


@Component
public class VisitInterceptor implements HandlerInterceptor {

    @Autowired
    private RedisVisitService redisVisitService;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        HttpSession session = request.getSession(); // 获取当前会话
        System.out.println("VisitInterceptor.preHandle:" + session);
        Boolean hasVisited = (Boolean) session.getAttribute("hasVisited");

        if (hasVisited == null || !hasVisited) {
        String userId = request.getRemoteUser(); // 获取登录用户ID，如果用户未登录，则为null
        redisVisitService.recordVisit(userId);
            session.setAttribute("hasVisited", true);
        }
        return true; // 继续处理请求
    }
}
