package fun.struct.myblog.controller;

import fun.struct.myblog.common.Result;
import fun.struct.myblog.common.ResultCode;
import fun.struct.myblog.dto.EmailCodeDTO;
import fun.struct.myblog.service.VerificationCodeService;
import jakarta.annotation.Resource;
import jakarta.mail.MessagingException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("email")
public class MailController {

    @Resource
    private  VerificationCodeService verificationCodeService;

    // 发送注册验证码
    @GetMapping("/send-code")
    public Result sendCode(@RequestParam String email) throws MessagingException {
        boolean isSent = verificationCodeService.sendVerificationEmail(email);
        if (isSent) {
            return Result.of(ResultCode.SUCCESS, "验证码已发送到 " + email);
        } else {
            return Result.of(ResultCode.FAIL, "验证码发送失败");
        }
    }

    //发送重置密码验证码
    @GetMapping("/send-reset-code")
    public Result sendResetCode(@RequestParam String email) throws MessagingException {
        if (email == null){
            return Result.of(ResultCode.FAIL, "邮箱不能为空");
        }
        boolean isSent = verificationCodeService.sendPasswordResetEmail(email);
        if (isSent){
            return Result.of(ResultCode.SUCCESS, "验证码已发送到 " + email);
        } else {
            return Result.of(ResultCode.FAIL, "验证码发送失败");
        }
    }

    // 验证验证码
    @PostMapping("/verify-code")
    public Result verifyCode(@RequestBody EmailCodeDTO emailCodeDTO) {
        System.out.println("验证验证码:" + emailCodeDTO);
        boolean isValid = verificationCodeService.verifyCode(emailCodeDTO);
        if (isValid) {
            return Result.of(ResultCode.SUCCESS, "验证通过 ");
        } else {
            return Result.of(ResultCode.FAIL, "验证码错误或失效");
        }
    }
}
