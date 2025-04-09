package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.MenuItemUpdateByIdsDTO;
import fun.struct.myblog.entity.MenuItem;
import fun.struct.myblog.service.MenuItemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/menu-items")
public class MenuItemController {

    @Autowired
    private MenuItemService menuItemService;

    @GetMapping("/fetch")
    public Result getAllMenuItems() {
        List<MenuItem> menuItems = menuItemService.getAllMenuItems();
        return Result.of(ResultCode.SUCCESS, menuItems);
    }

    @PutMapping("/delete")
    public Result deleteMenuItems(@RequestBody MenuItemUpdateByIdsDTO menuItemUpdateByIdsDTO) {
        List<Long> menuItemIds = menuItemUpdateByIdsDTO.getIds();
        if (menuItemIds == null || menuItemIds.isEmpty()) {
            return Result.of(ResultCode.FAIL, "无效的菜单项 ID 列表");
        }
        for (Long id : menuItemIds) {
            MenuItem menuItem = menuItemService.getById(id);
            if (menuItem != null) {
                if (menuItem.isStatus()) {
                    menuItemService.updateDeletedStatus(id, menuItemUpdateByIdsDTO.isDeleted());
                } else {
                    return Result.of(ResultCode.FAIL, "操作不可修改项!");
                }
            } else {
                return Result.of(ResultCode.FAIL, "无效ID");
            }
        }
            return Result.of(ResultCode.SUCCESS, "操作成功");
    }


}
