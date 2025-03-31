package fun.struct.myblog.dto;

import lombok.Data;

@Data
public class UploadBookDTO {
    private String title;           // 书籍标题
    private String author;          // 作者
    private String coverImage;      // 封面
    private String description;     // 描述
    private String downloadUrl;     // 下载地址
    private String categories;      // 分类
    private Integer uploader;       // 上传者
}
