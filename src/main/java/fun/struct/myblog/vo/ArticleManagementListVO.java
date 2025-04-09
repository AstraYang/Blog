package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data

/*
* 文章管理列表VO
* */
public class ArticleManagementListVO {
    private Integer id;
    private String title;
    private String summary;
    private String authorName;
    private String categoryName;
    private LocalDateTime createdAt;
    private boolean status;
    private boolean comment;
    private boolean deleted;
}
