package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.entity.MenuItem;
import fun.struct.myblog.mapper.MenuItemMapper;
import fun.struct.myblog.service.MenuItemService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuItemServiceImpl extends ServiceImpl<MenuItemMapper, MenuItem> implements MenuItemService {

    @Override
    public List<MenuItem> getAllMenuItems() {
        QueryWrapper<MenuItem> queryWrapper = new QueryWrapper<>();
        queryWrapper.orderByAsc("id");
        return this.list(queryWrapper);
    }

    @Override
    public void updateDeletedStatus(Long id, boolean deleted) {
        MenuItem menuItem = getById(id);
        if (menuItem != null) {
            menuItem.setDeleted(deleted);
            updateById(menuItem);
        }
    }
}
