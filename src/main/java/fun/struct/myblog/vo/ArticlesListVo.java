package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data

/*
* 文章列表VO
* */
public class ArticlesListVo {
    private Integer id;
    private String title;
    private String categoryName;
    private String tags;
    private String summary;
    private String Image;
    private int views;
    private LocalDateTime createAt;
}
