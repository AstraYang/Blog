package fun.struct.myblog.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("user")
public class User {

    @TableId(value = "user_id", type = IdType.AUTO)
    private Integer id;

    @TableField
    private String userName;
    private String password;
    private String nickName;
    private String email;
    private String avatar;
    private String authority;
}
