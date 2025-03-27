package fun.struct.myblog;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import fun.struct.myblog.entity.Articles;
import fun.struct.myblog.service.ArticlesService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertFalse;


@SpringBootTest
class MyBlogApplicationTests {

    @Autowired
    private ArticlesService articlesService;

    @Test
    void contextLoads() {
    }

    @Test
    void testSearchArticlesWithPage() {
        String keyword = "测试";
        int current = 1;
        int size = 5;

        Page<Articles> page = articlesService.searchArticlesWithPage(keyword, current, size);

        // 打印结果
        System.out.println("总记录数: " + page.getTotal());
        System.out.println("总页数: " + page.getPages());
        System.out.println("当前页: " + page.getCurrent());

        page.getRecords().forEach(System.out::println);

        // 验证结果
        assertFalse(page.getRecords().isEmpty(), "搜索结果不应为空");
    }

}
