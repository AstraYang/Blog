package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@TableName("comments")
public class Comments {
    @TableId(value = "comment_id", type = IdType.AUTO)
    private Integer id;

    @TableField
    private Integer articlesId;
    private String  username;
    private String  email;
    private String  avatarUrl;
    private String  website;
    private String  content;
    private Integer parentId;
    private LocalDateTime createdAt;
}
