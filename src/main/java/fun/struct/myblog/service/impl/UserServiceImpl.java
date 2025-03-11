package fun.struct.myblog.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.UserService;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    @Override
    public User login(LoginDto loginDto) {
        // 将密码加密（采用 MD5 加密，实际项目中可以改为更强的加密算法）
//        String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());

        // 构造查询条件
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_name", loginDto.getUsername()).eq("password", loginDto.getPassword());

        // 查找用户
        return this.getOne(queryWrapper);
    }
}
