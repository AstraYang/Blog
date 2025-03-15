package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class EmailCodeDTO {
    private String email;
    private String code;
    private String type;
}
