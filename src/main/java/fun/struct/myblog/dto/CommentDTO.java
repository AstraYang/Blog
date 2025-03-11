package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private Integer articleId;
    private String  username;
    private String  email;
    private String  website;
    private String  content;
    private Integer parentId;
}
