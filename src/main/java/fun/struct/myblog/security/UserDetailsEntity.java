package fun.struct.myblog.security;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

//@Description: SpringSecurity用户实体类
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsEntity implements UserDetails {

    private String username;
    private String password;
    private String authority;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {

        return Collections.singletonList(() -> authority);
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "UserDetailsEntity{" +
                "username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", authorities=" + authority +
                '}';
    }
}