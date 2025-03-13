package fun.struct.myblog.security;

import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * @Description: 用户登录
 * @Author: 翰戈.summer
 * @Date: 2023/11/16
 */
@Service
@RequiredArgsConstructor
public class UserLoginDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // 获取用户信息
        User user = userService.getByUserName(username);

        if (user == null) {
            throw new UsernameNotFoundException("用户未找到");
        }

        // 使用用户的单个权限创建 UserDetailsEntity
        return new UserDetailsEntity(user.getUserName(), user.getPassword(), user.getAuthority());
    }
}
