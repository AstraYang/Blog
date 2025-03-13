package fun.struct.myblog.controller;

import fun.struct.myblog.service.VerificationCodeService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("email")
public class MailController {

    @Autowired
    private VerificationCodeService verificationCodeService;

    // 发送验证码
    @PostMapping("/send-code")
    public String sendCode(@RequestParam String email) throws MessagingException {
        verificationCodeService.sendVerificationEmail(email);
        return "验证码已发送到 " + email;
    }

    // 验证验证码
    @PostMapping("/verify-code")
    public String verifyCode(@RequestParam String email, @RequestParam String code) {
        boolean isValid = verificationCodeService.verifyCode(email, code);
        if (isValid) {
            return "验证码验证成功";
        } else {
            return "验证码无效或已过期";
        }
    }
}
