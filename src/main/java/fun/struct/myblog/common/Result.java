package fun.struct.myblog.common;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class Result {
    private Object data;      // 响应数据
    private String message;   // 响应消息
    private int code;         // 响应状态码

    /**
     * 通用静态方法构建 Result 对象
     * @param resultCode 枚举结果码
     * @param data 响应数据（可选）
     * @return Result
     */
    public static Result of(ResultCode resultCode, Object data) {
        Result result = new Result();
        result.setCode(resultCode.getCode());
        result.setMessage(resultCode.getMessage());
        result.setData(data);
        return result;
    }

    /**
     * 通用静态方法构建 Result 对象（无数据）
     * @param resultCode 枚举结果码
     * @return Result
     */
    public static Result of(ResultCode resultCode) {
        return of(resultCode, null); // 调用带数据的构造方法
    }

    /**
     * 自定义消息的 Result 构建方法
     * @param resultCode 枚举结果码
     * @param message 自定义消息
     * @return Result
     */
    public static Result of(ResultCode resultCode, String message) {
        Result result = new Result();
        result.setCode(resultCode.getCode());
        result.setMessage(message);
        return result;
    }

    /**
     * 通用静态方法构建 Result 对象
     * @param resultCode 枚举结果码
     * @param message 自定义消息
     * @param data 响应数据（可选）
     * @return Result
     */
    public static Result of(ResultCode resultCode, String message ,Object data) {
        Result result = of(resultCode, message);
        result.setData(data);
        return result;
    }

}
