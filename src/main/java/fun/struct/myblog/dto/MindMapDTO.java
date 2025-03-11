package fun.struct.myblog.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MindMapDTO {
    private String title;
    private String summary;
    private String data;

}
