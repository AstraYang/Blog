package fun.struct.myblog.dto;

import lombok.Data;

import java.util.List;

@Data

public class UserUpdateStatusByIdsDTO {
    private List<Integer> Ids;
    private boolean newStatus;
}
