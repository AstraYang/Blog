package fun.struct.myblog.service;


import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.LoginDto;
import fun.struct.myblog.entity.User;

public interface UserService extends IService<User> {
    User login(LoginDto loginDto);
}
