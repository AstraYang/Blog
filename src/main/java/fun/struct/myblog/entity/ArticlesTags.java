package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

@Data
public class ArticlesTags {
    @TableId(value = "articles_tags_id", type = IdType.AUTO)
    private Integer id;
    private Integer articlesId;
    private Integer tagId;
}
