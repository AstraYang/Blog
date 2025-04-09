package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("menu_items")
public class MenuItem {
    @TableId(value = "menu_id")
    private Long id;
    private String menuItem;
    private boolean status; // 0: 不可编辑, 1: 可编辑
    private boolean deleted; // 0: 可见, 1: 不可见
}
