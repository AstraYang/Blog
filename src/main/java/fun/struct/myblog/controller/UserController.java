package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.EmailCodeDTO;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.dto.SignUpDTO;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.UserService;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.service.VerificationCodeService;
import fun.struct.myblog.util.JwtUtils; // 使用JwtUtils
import fun.struct.myblog.vo.UserListVO;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/user")
public class UserController {

    @Resource
    private UserService userService;

    @Resource
    private JwtUtils jwtUtils; // 注入JwtUtils
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private VerificationCodeService verificationCodeService;

    @PostMapping("/login")
    public Result login(@RequestBody LoginDto loginDto) {
        System.out.println("登录信息:" + loginDto);
        User user = userService.login(loginDto);
        System.out.println("user = " + user);
        Assert.notNull(user, "用户名或密码错误，请重试！");

        // 创建claims，包含用户信息及权限
        HashMap<String, Object> claims = new HashMap<>();
        claims.put("id", user.getId());
        claims.put("username", user.getUserName());
        claims.put("nickName", user.getNickName());
        claims.put("email", user.getEmail());
        claims.put("avatar", user.getAvatar());
        claims.put("authorityString", user.getAuthority()); // 添加权限信息

        // 使用JwtUtils生成token
        System.out.println("token");

        String token = jwtUtils.getJwt(claims);
        System.out.println("token = " + token);

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
                    vo.setPermissions(user.getAuthority());
                    return vo;
                })
                .collect(Collectors.toList());
        return Result.of(ResultCode.SUCCESS, userListVO);
    }

    @PostMapping("/signup")
    public Result addUser(@RequestBody SignUpDTO signUpDTO) {
        System.out.println("注册信息:" + signUpDTO);
        User user = new User();
        User username = userMapper.selectOne(
                new QueryWrapper<User>().select("user_id AS id").eq("user_name", signUpDTO.getUsername())
        );
        User email = userMapper.selectOne(
                new QueryWrapper<User>().select("user_id AS id").eq("email", signUpDTO.getEmail())
        );
        System.out.println("username = " + username);
        System.out.println("email = " + email);
       if (username != null) {
            return Result.of(ResultCode.FAIL, "用户名已存在，请重试！");
        }else if(email != null){
            return Result.of(ResultCode.FAIL, "邮箱已存在，请重试！");
       }
        EmailCodeDTO emailCodeDTO = new EmailCodeDTO();
        emailCodeDTO.setEmail(signUpDTO.getEmail());
        emailCodeDTO.setCode(signUpDTO.getCode());
        emailCodeDTO.setType("signup");
        boolean isValid = verificationCodeService.verifyCode(emailCodeDTO);
        if (!isValid) {
            return Result.of(ResultCode.FAIL, "验证码错误，请重试！");
        }
        user.setUserName(signUpDTO.getUsername());
        user.setPassword(signUpDTO.getPassword());
        user.setNickName(signUpDTO.getUsername());
        user.setEmail(signUpDTO.getEmail());
        user.setAvatar("https://image.struct.fun/i/2025/03/15/172939.jpeg");
        user.setAuthority("USER");

        // 调用 Service 层的添加用户方法
        System.out.println("user = " + user);
        boolean success = userService.save(user);

        // 校验添加是否成功
        Assert.isTrue(success, "添加用户失败，请重试！");

        return Result.of(ResultCode.SUCCESS, "添加用户成功！");
    }
}
