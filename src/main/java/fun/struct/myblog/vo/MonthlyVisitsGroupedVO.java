package fun.struct.myblog.vo;

import lombok.Data;

import java.util.List;

@Data
public class MonthlyVisitsGroupedVO {
    private String month;
    private List<Integer> count;

}
