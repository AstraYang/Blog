package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.io.IOException;

@RestController
@RequestMapping("/uploads")
public class UploadController {
    @Value("${app.remote.upload.url}")
    private String remoteUploadUrl; // 远程 API 地址

    @Value("${app.remote.upload.token}")
    private String uploadToken; // 上传所需的 token

    @PostMapping("/image")
    public Result uploadImage(@RequestParam("image") MultipartFile file) {
        System.out.println("url:" + remoteUploadUrl);
        System.out.println("token:" + uploadToken);

        if (file.isEmpty()) {
            return Result.of(ResultCode.FAIL, "图片上传失败，文件为空");
        }

        try {
            // 创建 RestTemplate 实例
            RestTemplate restTemplate = new RestTemplate();

            // 构造请求体
            MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
            body.add("image", new MultipartFileResource(file)); // 将 MultipartFile 包装为资源
            body.add("token", uploadToken); // 添加 token

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.MULTIPART_FORM_DATA); // 设置请求内容类型

            HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);

            // 调用远程 API
            ResponseEntity<String> responseEntity = restTemplate.exchange(
                    remoteUploadUrl, // API 地址
                    HttpMethod.POST, // HTTP 方法
                    requestEntity, // 请求实体
                    String.class // 响应类型
            );

            // 检查响应状态
            if (responseEntity.getStatusCode() == HttpStatus.OK) {
                System.out.println("远程 API 响应体：" + responseEntity.getBody());

                // 解析响应 JSON 并提取 url
                String responseBody = responseEntity.getBody();
                com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
                java.util.Map<String, Object> responseMap = objectMapper.readValue(responseBody, java.util.Map.class);

                // 检查 result 字段并提取 URL
                if ("success".equals(responseMap.get("result"))) {
                    String url = (String) responseMap.get("url");
                    return Result.of(ResultCode.SUCCESS, "图片上传成功", url); // 返回 URL
                } else {
                    String message = (String) responseMap.get("message");
                    return Result.of(ResultCode.FAIL, "图片上传失败：" + message);
                }

            } else {
                return Result.of(ResultCode.FAIL, "图片上传失败，远程服务器返回错误状态：" + responseEntity.getStatusCode());
            }

        } catch (IOException e) {
            e.printStackTrace();
            return Result.of(ResultCode.FAIL, "图片上传失败，服务器内部错误");
        } catch (Exception e) {
            e.printStackTrace();
            return Result.of(ResultCode.FAIL, "图片上传失败，远程服务器调用失败");
        }
    }

    /**
     * 自定义 MultipartFileResource 类，用于将 MultipartFile 转化为 RequestBody 所需的资源类型
     */
    private static class MultipartFileResource extends org.springframework.core.io.ByteArrayResource {
        private final MultipartFile file;

        public MultipartFileResource(MultipartFile file) throws IOException {
            super(file.getBytes());
            this.file = file;
        }

        @Override
        public String getFilename() {
            return this.file.getOriginalFilename(); // 返回文件原始名称
        }
    }
}
