package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class ArticleStatusDTO {
    private Integer articleId;
    private boolean status;
}
