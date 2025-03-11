package fun.struct.myblog.vo;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CategoryListVo {
    private Integer id;
    private String categoryName;
    private LocalDateTime createdAt;
    private Integer count;
}
