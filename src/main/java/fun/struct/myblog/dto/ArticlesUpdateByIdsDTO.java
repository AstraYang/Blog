package fun.struct.myblog.dto;

import lombok.Data;

import java.util.List;

@Data
public class ArticlesUpdateByIdsDTO {
    private List<Integer> ids;
    private boolean del;
}
