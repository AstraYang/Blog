package fun.struct.myblog.dto;
import lombok.Data;

import java.util.List;

@Data
public class ArticlesDto {
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
