package fun.struct.myblog.vo;

import lombok.Data;

import java.util.List;

@Data

/*
* 文章更新数据VO
* */
public class ArticleDataVo {
    private Integer id;
    private String title;
    private Integer categoryId;
    private List<Integer> tags;
    private String summary;
    private String content;
    private String coverImage;
    private int author;
    private boolean status;
    private boolean comment;
    private boolean deleted;
}
