package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;
@Data

/*
  文章阅读页面VO
 */
public class ArticleVO {
    private Integer id;
    private String title;
    private String content;
    private int views;
    private LocalDateTime updateAt;
    private boolean comment;
}
