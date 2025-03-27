package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class UserUpdatePassDTO {
    private Integer id;
    private String password;
    private String newPassword;
}
