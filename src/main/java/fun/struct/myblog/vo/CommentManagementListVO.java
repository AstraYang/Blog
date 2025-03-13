package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentManagementListVO {
    private Integer id;
    private Integer articlesId;
    private String  articlesTitle;
    private String  username;
    private String  email;
    private String  avatarUrl;
    private String  content;
    private LocalDateTime createdAt;
}
