package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MindMap {
    @TableId(value = "mind_map_id", type = IdType.AUTO)
    private Integer id;

    @TableField
    private String title;
    private String summary;
    private String data;
    private Integer author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

