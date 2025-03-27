package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class UserUpdateEmailDTO {
    private String newEmail;
    private String code;
}
