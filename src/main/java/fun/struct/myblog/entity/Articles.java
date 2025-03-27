package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Articles {
    @TableId(value = "articles_id", type = IdType.AUTO)
    private Integer id;

    @TableField
    private String title;
    private int categoryId;
    private String summary;
    private String content;
    private String coverImage;
    private int views;
    private LocalDateTime createdAt;
    private LocalDateTime updateAt;
    private int author;
    @TableField("is_status")
    private boolean status;
    @TableField("is_comment")
    private boolean comment;
    @TableField("is_deleted")
    private boolean deleted;


}
