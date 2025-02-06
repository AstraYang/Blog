package fun.struct.myblog.vo;

import lombok.Data;

@Data
public class LoginResponseVO {
    private  Integer id;
    private String username;
    private String nickName;
    private String email;
    private String avatar;

}
