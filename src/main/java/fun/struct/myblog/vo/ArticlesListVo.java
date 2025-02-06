package fun.struct.myblog.vo;

import fun.struct.myblog.entity.Tags;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
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
