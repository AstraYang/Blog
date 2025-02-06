package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.core.toolkit.Assert;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.service.AdminUserService;
import fun.struct.myblog.entity.AdminUser;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.vo.LoginResponseVO;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/user")
public class AdminUserController {

    @Resource
    private AdminUserService adminUserService;

    @PostMapping("/login")
    public Result login(@RequestBody LoginDto loginDto, HttpSession session) {
        // 调用 Service 层的登录方法
        AdminUser adminUser = adminUserService.login(loginDto);
        LoginResponseVO loginResponseVO = new LoginResponseVO();
        loginResponseVO.setId(adminUser.getId());
        loginResponseVO.setUsername(adminUser.getUserName());
        loginResponseVO.setNickName(adminUser.getNickName());
        loginResponseVO.setEmail(adminUser.getEmail());
        loginResponseVO.setAvatar(adminUser.getAvatar());

        // 校验用户是否存在
        Assert.notNull(adminUser, "用户名或密码错误，请重试！");
        session.setAttribute("User", loginResponseVO);
        System.out.println("login Session ID: " + session.getId());
        System.out.println("login User in Session: " + session.getAttribute("User"));


        return Result.of(ResultCode.SUCCESS, loginResponseVO);
    }

    @GetMapping("/logout")
    public Result logout(HttpSession session) {
        // 移除用户会话
        session.removeAttribute("User");

        return Result.of(ResultCode.SUCCESS,"退出成功！");
    }

    @GetMapping("/current")
    public Result getCurrentUser(HttpSession session) {
        System.out.println("current Session ID: " + session.getId());
        System.out.println("current User in Session: " + session.getAttribute("User"));

        // 获取当前用户信息
        LoginResponseVO loginResponseVO = (LoginResponseVO) session.getAttribute("User");

        if (loginResponseVO == null) {
            return Result.of(ResultCode.FAIL,"未登录");
        }

        return Result.of(ResultCode.SUCCESS,loginResponseVO);
    }


//   添加用户
    @PostMapping("/add")
    public Result addUser(@RequestBody AdminUser adminUser) {
        // 调用 Service 层的添加用户方法
        boolean success = adminUserService.save(adminUser);

        // 校验添加是否成功
        Assert.isTrue(success, "添加用户失败，请重试！");

        return Result.of(ResultCode.SUCCESS,"添加用户成功！");
    }
}
