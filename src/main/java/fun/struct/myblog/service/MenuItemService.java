package fun.struct.myblog.service;

import com.baomidou.mybatisplus.extension.service.IService;
import fun.struct.myblog.entity.MenuItem;

import java.util.List;

public interface MenuItemService extends IService<MenuItem> {
    List<MenuItem> getAllMenuItems();
    void updateDeletedStatus(Long id, boolean deleted);
}
