package fun.struct.myblog.config;

import fun.struct.myblog.security.AuthAccessDeniedHandler;
import fun.struct.myblog.security.AuthEntryPointHandler;
import fun.struct.myblog.security.JwtAuthenticationFilter;
import fun.struct.myblog.util.SpringContextUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserDetailsService userDetailsService;
    private final AuthAccessDeniedHandler authAccessDeniedHandler;
    private final AuthEntryPointHandler authEntryPointHandler;

    public SecurityConfig(UserDetailsService userDetailsService, AuthAccessDeniedHandler authAccessDeniedHandler, AuthEntryPointHandler authEntryPointHandler) {
        this.userDetailsService = userDetailsService;
        this.authAccessDeniedHandler = authAccessDeniedHandler;
        this.authEntryPointHandler = authEntryPointHandler;
    }

    @Bean
    public UserDetailsService userDetailsService() {
        return userDetailsService;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity.authorizeHttpRequests(authorizeHttpRequests -> authorizeHttpRequests
                .requestMatchers(HttpMethod.POST, "/admin/user/login").permitAll() // 登录放行
                .requestMatchers(HttpMethod.POST, "/wallpaper/**").permitAll() // 注册放行
                .requestMatchers(HttpMethod.GET, "/wallpaper/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/admin/user/forget-password").permitAll()
                .requestMatchers(HttpMethod.POST, "/admin/user/reset-password").permitAll()
                .requestMatchers(HttpMethod.GET, "/articles/public/**").permitAll() //文章公共接口
                .requestMatchers(HttpMethod.GET, "/category/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/comments/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/tags/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/map/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/email/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/email/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/books/public/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/settings/**").permitAll()
                .requestMatchers(HttpMethod.GET,"/menu-items/**").permitAll()


                .anyRequest().authenticated()
        );
        httpSecurity.authenticationProvider(authenticationProvider());

        // 禁用登录页面
        httpSecurity.formLogin(AbstractHttpConfigurer::disable);
        // 禁用登出页面
        httpSecurity.logout(AbstractHttpConfigurer::disable);
        // 禁用 session
        httpSecurity.sessionManagement(AbstractHttpConfigurer::disable);
        // 禁用 httpBasic
        httpSecurity.httpBasic(AbstractHttpConfigurer::disable);
        // 禁用 csrf 保护
        httpSecurity.csrf(AbstractHttpConfigurer::disable);

        // 通过上下文获取 AuthenticationManager
        AuthenticationManager authenticationManager = SpringContextUtils.getBean("authenticationManager");
        // 添加自定义 token 验证过滤器
        httpSecurity.addFilterBefore(new JwtAuthenticationFilter(authenticationManager), UsernamePasswordAuthenticationFilter.class);

        // 自定义处理器
        httpSecurity.exceptionHandling(exceptionHandling -> exceptionHandling
                .accessDeniedHandler(authAccessDeniedHandler) // 处理用户权限不足
                .authenticationEntryPoint(authEntryPointHandler) // 处理用户未登录（未携带 token）
        );
        httpSecurity.cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return httpSecurity.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173"));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        config.setAllowCredentials(true);
        source.registerCorsConfiguration("/**", config);
        return source;
    }

}
