package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class ArticleQueryDTO {
    private Integer userFilter; // "all" 或 "mine"
    private boolean publishFilter; // "yes" 或 "no"
}
