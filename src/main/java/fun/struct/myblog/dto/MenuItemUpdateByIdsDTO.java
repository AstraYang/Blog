package fun.struct.myblog.dto;

import lombok.Data;

import java.util.List;

@Data
public class MenuItemUpdateByIdsDTO {
    private List<Long> ids;
    private boolean status; // 0: 不可编辑, 1: 可编辑
    private boolean deleted; // 0: 可见, 1: 不可见
}
