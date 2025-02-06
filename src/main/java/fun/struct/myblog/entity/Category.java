package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class Category {
    @TableId(value = "category_id", type = IdType.AUTO)
    private Integer id;

    private String categoryName;
    private String createdAt;
}
