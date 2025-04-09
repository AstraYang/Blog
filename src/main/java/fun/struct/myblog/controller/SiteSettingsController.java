package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.entity.SiteSettings;
import fun.struct.myblog.service.SiteSettingsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/settings")
public class SiteSettingsController {

    @Autowired
    private SiteSettingsService siteSettingsService;
    private static final Logger logger = LoggerFactory.getLogger(SiteSettingsController.class);

    @GetMapping("/get")
    public Result getAllSettings() {
        logger.info("获取所有设置");
        List<SiteSettings> settingsList = siteSettingsService.list();
        return Result.of(ResultCode.SUCCESS, settingsList);
    }

    @GetMapping("/{id}")
    public Result getSettingById(@PathVariable Long id) {
        SiteSettings settings = siteSettingsService.getById(id);
        return Result.of(ResultCode.SUCCESS, settings);
    }

    @PostMapping("/save")
    public Result createOrUpdateSetting(@RequestBody SiteSettings siteSettings) {
        System.out.println(siteSettings);
        siteSettingsService.saveOrUpdate(siteSettings);
        return Result.of(ResultCode.SUCCESS,"设置已保存！");
    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<String> deleteSetting(@PathVariable Long id) {
//        siteSettingsService.removeById(id);
//        return ResponseEntity.ok("设置已删除！");
//    }
}
