package fun.struct.myblog.controller;


import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/wallpaper")
public class WallpaperProxyController {

    private static final String BASE_URL = "http://wallpaper.apc.360.cn/index.php";

    @Resource
    private RestTemplate restTemplate;

    @Cacheable("categories")
    @GetMapping("/categories")
    public ResponseEntity<String> getAllCategories() {
        String url = BASE_URL + "?c=WallPaperAndroid&a=getAllCategories";
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/byCategory")
    public ResponseEntity<String> getWallpapersByCategory(
            @RequestParam("cid") String cid,
            @RequestParam("start") int start,
            @RequestParam("count") int count) {
        String url = BASE_URL + "?c=WallPaperAndroid&a=getAppsByCategory" +
                "&cid=" + cid +
                "&start=" + start +
                "&count=" + count;
        String response = restTemplate.getForObject(url, String.class);
        return ResponseEntity.ok(response);
    }
}