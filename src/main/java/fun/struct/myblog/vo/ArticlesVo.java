package fun.struct.myblog.vo;

import fun.struct.myblog.entity.Tags;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ArticlesVo {
    private Integer id;
    private String title;
    private String categoryName;
    private Tags tags;
    private String summary;
    private String content;
    private String coverImage;
    private int views;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private boolean is_status;
    private int is_comment;
    private boolean is_delete;
}
