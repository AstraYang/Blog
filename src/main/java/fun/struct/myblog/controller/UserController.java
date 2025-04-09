package fun.struct.myblog.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.Assert;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.*;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.UserService;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.common.Result;
import fun.struct.myblog.service.VerificationCodeService;
import fun.struct.myblog.util.JwtUtils;
import fun.struct.myblog.vo.UserListVO;
import jakarta.annotation.Resource;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private JwtUtils jwtUtils;
    @Resource
    private UserMapper userMapper;
    @Resource
    private VerificationCodeService verificationCodeService;

    @PostMapping("/login")
    public Result login(@RequestBody LoginDTO loginDto) {
        System.out.println("登录信息:" + loginDto);
        User user = userService.login(loginDto);
        System.out.println("user = " + user);
        if(user == null){
            return Result.of(ResultCode.FAIL, "用户名或密码错误，请重试！");

        }
        // 密码正确，查看账户状态
        if (!user.isStatus()) {
            return Result.of(ResultCode.FAIL, "账号已被禁用，请联系管理员！");
        }
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
                    vo.setStatus(user.isStatus());
                    return vo;
                })
                .collect(Collectors.toList());
        return Result.of(ResultCode.SUCCESS, userListVO);
    }

    @PostMapping("/signup")
    public Result addUser(@RequestBody SignUpDTO signUpDTO) {
        User user = new User();
        User username = userMapper.selectOne(
                new QueryWrapper<User>().select("user_id AS id").eq("user_name", signUpDTO.getUsername())
        );
        User email = userMapper.selectOne(
                new QueryWrapper<User>().select("user_id AS id").eq("email", signUpDTO.getEmail())
        );
       if (username != null) {
            return Result.of(ResultCode.FAIL, "用户名已存在，请重试！");
        }else if(email != null){
            return Result.of(ResultCode.FAIL, "邮箱已存在，请重试！");
       }
        EmailCodeDTO emailCodeDTO = new EmailCodeDTO();
        emailCodeDTO.setEmail(signUpDTO.getEmail());
        emailCodeDTO.setCode(signUpDTO.getCode());
        boolean isValid = verificationCodeService.verifyCode(emailCodeDTO);
        if (!isValid) {
            return Result.of(ResultCode.FAIL, "验证码错误，请重试！");
        }
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        // 对新密码进行哈希处理
        String hashedPassword = passwordEncoder.encode(signUpDTO.getPassword());

        user.setUserName(signUpDTO.getUsername());
        user.setPassword(hashedPassword);
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


//    邮箱重置密码
    @PostMapping("/reset-password")
    public Result resetPassword(@RequestBody SignUpDTO signUpDTO) {
        EmailCodeDTO emailCodeDTO = new EmailCodeDTO();
        emailCodeDTO.setEmail(signUpDTO.getEmail());
        emailCodeDTO.setCode(signUpDTO.getCode());
        boolean isValid = verificationCodeService.verifyCode(emailCodeDTO);
        if (!isValid) {
            return Result.of(ResultCode.FAIL, "验证码错误，请重试！");
        }
       boolean success = userService.updatePassword("email", signUpDTO.getEmail(), signUpDTO.getPassword());
        if (success) {
            return Result.of(ResultCode.SUCCESS, "重置密码成功！");
        } else {
            return Result.of(ResultCode.FAIL, "重置密码失败，请重试！");
        }
    }

//    旧密码修改
    @PostMapping("/update-password")
    public Result updatePassword(@RequestBody UserUpdatePassDTO userUpdatePassDTO) {
        System.out.println("userUpdatePassDTO = " + userUpdatePassDTO);
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_id", userUpdatePassDTO.getId());

        User user = userService.getOne(queryWrapper);

        // 如果用户存在，验证密码
        if (user != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            // 比较输入的密码和存储的哈希密码
            if (passwordEncoder.matches(userUpdatePassDTO.getPassword(), user.getPassword())) {
                boolean success = userService.updatePassword("user_id", userUpdatePassDTO.getId(), userUpdatePassDTO.getNewPassword());
                if (success){
                    return Result.of(ResultCode.SUCCESS, "修改密码成功！");
                }else{
                    return Result.of(ResultCode.FAIL, "修改密码失败，请重试！");
                }
            }else{
                return Result.of(ResultCode.FAIL, "旧密码错误，请重试！");
            }
        }
        return Result.of(ResultCode.FAIL, "用户不存在，请重试！");
    }

    @PostMapping("/update-email")
    public Result updateEmail(@RequestBody EmailCodeDTO emailCodeDTO) {
        System.out.println("emailCodeDTO = " + emailCodeDTO);
        boolean isValid = verificationCodeService.verifyCode(emailCodeDTO);
        if (!isValid) {
            return Result.of(ResultCode.FAIL, "验证码错误，请重试！");
        }
        boolean success = userService.updateEmail("email", emailCodeDTO.getEmail(), emailCodeDTO.getNewEmail());
        if (success) {
            return Result.of(ResultCode.SUCCESS, "修改邮箱成功！");
        }else {
            return Result.of(ResultCode.FAIL, "修改邮箱失败，请重试！");
        }
    }

//修改用户信息
    @PostMapping("/updateUser")
    public Result upDateUser(@RequestBody UserUpdateDTO userUpdateDTO) {
        System.out.println("更新的数据："+userUpdateDTO);
        boolean success = userService.updateUser(userUpdateDTO);
        if (!success) {
            return Result.of(ResultCode.FAIL, "修改用户信息失败");
        }
        return Result.of(ResultCode.SUCCESS,"修改用户信息成功");
    }

    @PostMapping("/updateStatus")
    public Result userStatusByIds(@RequestBody UserUpdateStatusByIdsDTO userUpdateStatusByIdsDTO) {
        System.out.println("userUpdateStatusByIdsDTO = " + userUpdateStatusByIdsDTO);
        boolean success = userService.updateUserStatusByIds(userUpdateStatusByIdsDTO.getIds(), userUpdateStatusByIdsDTO.isNewStatus());
        if (success) {
            System.out.println("操作成功:"+userUpdateStatusByIdsDTO.getIds());
            return Result.of(ResultCode.SUCCESS, "操作成功");
        } else {
            return Result.of(ResultCode.FAIL, "操作失败");
        }
    }

    //统计用户数
    @GetMapping("/count")
    public Result count() {
        long count = userService.count();
        return Result.of(ResultCode.SUCCESS, count);
    }
}
