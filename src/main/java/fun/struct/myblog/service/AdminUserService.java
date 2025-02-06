package fun.struct.myblog.service;


import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.entity.AdminUser;

public interface AdminUserService extends IService<AdminUser> {
    AdminUser login(LoginDto loginDto);
}
