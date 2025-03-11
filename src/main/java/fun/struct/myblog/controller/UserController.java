package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.core.toolkit.Assert;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.service.UserService;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.util.JWTUtil;
import fun.struct.myblog.vo.UserListVO;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/user")
public class UserController {

    @Resource
    private UserService userService;

    @PostMapping("/login")
    public Result login(@RequestBody LoginDto loginDto) {
        User user = userService.login(loginDto);
        Assert.notNull(user, "用户名或密码错误，请重试！");

        HashMap<String, String> claims = new HashMap<>();
        claims.put("id", user.getId().toString());
        claims.put("username", user.getUserName());
        claims.put("nickName", user.getNickName());
        claims.put("email", user.getEmail());
        claims.put("avatar", user.getAvatar());

        String token = JWTUtil.getToken(claims, 7); // 7天过期

        return Result.of(ResultCode.SUCCESS, token);
    }

    @GetMapping("/list")
    public Result getUserList() {
        List<User> users = userService.list();
        List<UserListVO> userListVO = users.stream()
                .map(user -> {
                    UserListVO vo = new UserListVO();
                    vo.setId(user.getId());
                    vo.setUsername(user.getUserName());
                    vo.setNickName(user.getNickName());
                    vo.setEmail(user.getEmail());
                    vo.setAvatar(user.getAvatar());
                    vo.setPermissions(user.getPermissions());
                    return vo;
                })
                .collect(Collectors.toList());
        return Result.of(ResultCode.SUCCESS, userListVO);
    }

//   添加用户
    @PostMapping("/add")
    public Result addUser(@RequestBody LoginDto loginDto) {
        User user = new User();
        user.setUserName(loginDto.getUsername());
        user.setPassword(loginDto.getPassword());

        // 调用 Service 层的添加用户方法
        boolean success = userService.save(user);

        // 校验添加是否成功
        Assert.isTrue(success, "添加用户失败，请重试！");

        return Result.of(ResultCode.SUCCESS,"添加用户成功！");
    }
}
