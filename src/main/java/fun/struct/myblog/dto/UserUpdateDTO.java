package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class UserUpdateDTO {
    private Integer id;
    private String nickName;
    private String avatar;
}
