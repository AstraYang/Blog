package fun.struct.myblog.service;


import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.dto.LoginDTO;
import fun.struct.myblog.dto.UserUpdateDTO;
import fun.struct.myblog.entity.User;

import java.util.List;

public interface UserService extends IService<User> {
    User login(LoginDTO loginDto);

    User getByUserName(String username);

    boolean updateUser(UserUpdateDTO userUpdateDTO);

    boolean updatePassword(String fieldName, Object fieldValue, String newPassword);

    boolean updateEmail(String fieldName, Object fieldValue, String newEmail);

    boolean updateUserStatusByIds(List<Integer> ids, boolean newStatus);

}
