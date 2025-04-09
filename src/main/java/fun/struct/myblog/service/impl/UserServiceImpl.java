package fun.struct.myblog.service.impl;


import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.LoginDTO;
import fun.struct.myblog.dto.UserUpdateDTO;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    @Autowired
    private UserMapper userMapper;
    @Override
    public User login(LoginDTO loginDto) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_name", loginDto.getUsername());

        // 查找用户
        User user = this.getOne(queryWrapper);

        // 如果用户存在，验证密码
        if (user != null) {
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
            // 比较输入的密码和存储的哈希密码
            if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
                // 密码正确，返回用户信息
                return user;
            }
        }

        // 用户不存在或密码错误
        return null;
    }

    @Override
    public User getByUserName(String username) {
        QueryWrapper<User> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("user_name", username);

        // 查找用户
        return this.getOne(queryWrapper);
    }


    //更新用户数据
    @Override
    public boolean updateUser(UserUpdateDTO userUpdateDTO) {
        if (userUpdateDTO != null) {
            User user = new User();
            user.setId(userUpdateDTO.getId());
            user.setNickName(userUpdateDTO.getNickName());
            user.setAvatar(userUpdateDTO.getAvatar());
            return this.updateById(user);
        }
        return false;
    }

    /**
     * 通用密码更新方法
     *
     * @param fieldName 用于查询用户的字段名称（如"id"、"username"、"email"）
     * @param fieldValue 字段值
     * @param newPassword 新密码（明文）
     * @return 更新成功返回true，否则返回false
     */
    public boolean updatePassword(String fieldName, Object fieldValue, String newPassword) {
        // 参数校验
        if (fieldName == null || fieldName.isEmpty()
                || fieldValue == null
                || newPassword == null || newPassword.isEmpty()) {
            return false;
        }

        try {
            // 创建 BCryptPasswordEncoder 实例
            BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

            // 对新密码进行哈希处理
            String hashedPassword = passwordEncoder.encode(newPassword);

            // 记录日志
           // logger.debug("更新用户密码，查询条件: {}={}", fieldName, fieldValue);

            // 构建更新条件
            UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq(fieldName, fieldValue);
            updateWrapper.set("password", hashedPassword);

            // 执行更新操作
            int affectedRows = userMapper.update(null, updateWrapper);

            // 返回更新结果
            return affectedRows > 0;
        } catch (Exception e) {
           // logger.error("密码更新失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean updateEmail(String fieldName, Object fieldValue, String newEmail){
        if (fieldName == null || fieldName.isEmpty()
                || fieldValue == null
                || newEmail == null || newEmail.isEmpty()) {
            return false;
        }
        try {

            // logger.debug("更新用户密码，查询条件: {}={}", fieldName, fieldValue);

            // 构建更新条件
            UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
            updateWrapper.eq(fieldName, fieldValue);
            updateWrapper.set("email", newEmail);

            // 执行更新操作
            int affectedRows = userMapper.update(null, updateWrapper);

            // 返回更新结果
            return affectedRows > 0;
        } catch (Exception e) {
            // logger.error("密码更新失败: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean updateUserStatusByIds(List<Integer> ids, boolean newStatus) {
        if (ids == null || ids.isEmpty()) {
            throw new IllegalArgumentException("ID 列表不能为空");
        }
        List<User> users = userMapper.selectByIds(ids);
        List<Integer> idsToUpdate = new ArrayList<>();

        for (User user : users) {
            if (!"ADMIN".equals(user.getAuthority())) {
                idsToUpdate.add(user.getId());
            }
        }
        if (idsToUpdate.isEmpty()) {
            // 如果没有可更新的用户，返回 false
            return false;
        }

        // 执行批量更新
        UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
        updateWrapper.in("user_id", idsToUpdate);
        return userMapper.update(null, updateWrapper.set("status", newStatus)) > 0;
    }



}
