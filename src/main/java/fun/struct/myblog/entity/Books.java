package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Books {
    @TableId(value = "b_id", type = IdType.AUTO)
    private Integer id;             // 书籍id

    @TableField
    private String title;           // 书籍标题
    private String author;          // 作者
    private String coverImage;      // 封面
    private String description;     // 描述
    private String downloadUrl;     // 下载地址
    private String categories;      // 分类
    private Integer uploader;       // 上传者
    private LocalDateTime createdAt;// 创建时间
    private boolean deleted;        // 是否删除
}
