package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("site_settings")
public class SiteSettings {

    @TableId(value = "site_id", type = IdType.AUTO)
    private Long id;

    private String siteName;
    private String siteDescription;
    private Boolean allowRegistration;
    private String favicon;
    private String logo;
    private LocalDate siteStartDate;
    private String linkItems;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}