package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentsVO {
    private Integer id;
    private Integer articlesId;
    private String  username;
    private String  email;
    private String  avatarUrl;
    private String  website;
    private String  content;
    private Integer parentId;
    private LocalDateTime createdAt;
    private Integer replyCount;
}
