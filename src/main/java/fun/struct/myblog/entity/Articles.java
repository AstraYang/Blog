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
    private boolean is_status;
    private boolean is_comment;
    private boolean is_deleted;


}
