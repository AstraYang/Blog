package fun.struct.myblog.vo;

import com.baomidou.mybatisplus.annotation.TableField;
import fun.struct.myblog.entity.Comments;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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
