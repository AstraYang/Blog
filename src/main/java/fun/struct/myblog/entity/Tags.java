package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Tags {
    @TableId(value = "tag_id", type = IdType.AUTO)
    private Integer id;

    private String tagName;
    private LocalDateTime createdAt;
}
