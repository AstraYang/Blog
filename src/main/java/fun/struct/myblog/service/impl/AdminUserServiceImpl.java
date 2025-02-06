package fun.struct.myblog.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.entity.AdminUser;
import fun.struct.myblog.mapper.AdminUserMapper;
import fun.struct.myblog.service.AdminUserService;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;

@Service
public class AdminUserServiceImpl extends ServiceImpl<AdminUserMapper, AdminUser> implements AdminUserService {
    @Override
    public AdminUser login(LoginDto loginDto) {
        // 将密码加密（采用 MD5 加密，实际项目中可以改为更强的加密算法）
//        String encryptedPassword = DigestUtils.md5DigestAsHex(password.getBytes());

        // 构造查询条件
        QueryWrapper<AdminUser> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_name", loginDto.getUsername()).eq("password", loginDto.getPassword());

        // 查找用户
        return this.getOne(queryWrapper);
    }
}
