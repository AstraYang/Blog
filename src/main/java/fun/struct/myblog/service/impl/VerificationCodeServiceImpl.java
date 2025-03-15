package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import fun.struct.myblog.dto.EmailCodeDTO;
import fun.struct.myblog.entity.User;
import fun.struct.myblog.mapper.UserMapper;
import fun.struct.myblog.service.VerificationCodeService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public  class VerificationCodeServiceImpl implements VerificationCodeService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String from;

    private final Random random = new Random();

    /**
     * 发送邮箱验证码
     *
     * @param to 收件人邮箱
     */
    public boolean sendVerificationEmail(String to) throws MessagingException {
        return sendEmail(to,"账号注册请求", "注册账号");

    }

    /**
     * 发送密码重置邮件
     *
     * @param to 收件人邮箱
     */
    public boolean sendPasswordResetEmail(String to) throws MessagingException {
        return sendEmail(to,"密码重置请求", "重置密码");
    }

    @Override
    public boolean verifyCode(EmailCodeDTO emailCodeDTO) {
        String storedCode = redisTemplate.opsForValue().get(emailCodeDTO.getEmail());
        if(storedCode != null && storedCode.equals(emailCodeDTO.getCode())){
            if (emailCodeDTO.getType().equals("reset")){
                UpdateWrapper<User> updateWrapper = new UpdateWrapper<>();
                updateWrapper.eq("email", emailCodeDTO.getEmail()); // 更新条件
                updateWrapper.set("password", "111111"); // 更新字段
                userMapper.update(null, updateWrapper); // 第一个参数可以为 null

            }
            return true;

        }
        return false;
    }


    /**
     * 发送邮件的方法
     *
     * @param to 收件人邮箱
     * @param subject 邮件主题
     * @param actionDescription 行为描述
     */
    @Override
    public boolean sendEmail(String to, String subject, String actionDescription) throws MessagingException {
        if(to == null || to.isEmpty()){
            return false;
        }
        String code = String.valueOf(100000 + random.nextInt(900000)); // 生成六位随机验证码
        redisTemplate.opsForValue().set(to, code, 5, TimeUnit.MINUTES); // 设置有效期为5分钟

        // 创建MimeMessage对象
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // true表示需要支持html

        // 设置邮件的主题和发件人
        helper.setSubject(subject);


        helper.setFrom(from); // 发件邮箱地址
        helper.setTo(to); // 收件人邮箱

        // 邮件的HTML内容
        String emailContent = "<!DOCTYPE html>" +
                "<html lang=\"en\" xmlns:th=\"http://www.thymeleaf.org\">" +
                "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>" + subject + "</title>" +
                "<style>table{width:700px;margin:0 auto}#top{width:700px;" +
                "border-bottom:1px solid #ccc;margin:0 auto 30px}#top table{font:12px Tahoma,Arial,宋体;" +
                "height:40px}#content{width:680px;padding:0 10px;margin:0 auto}" +
                "#content_top{line-height:1.5;font-size:14px;margin-bottom:25px;color:#4d4d4d}" +
                "#content_top strong{display:block;margin-bottom:15px}#content_bottom{margin-bottom:30px}" +
                "#content_bottom small{display:block;margin-bottom:20px;font-size:12px;color:" +
                "#747474}#bottom{width:700px;margin:0 auto}#bottom div{padding:10px 10px 0;" +
                "border-top:1px solid #ccc;color:#747474;margin-bottom:20px;line-height:1.3em;" +
                "font-size:12px}#content_top strong span{font-size:18px;color:#ee002c}" +
                "#sign{text-align:right;font-size:18px;color:#17a7ac;font-weight:bold}" +
                "#verificationCode{height:100px;width:680px;text-align:center;margin:30px 0}" +
                ".button{color:#ffffff;width:92%;font-size:70px;border:none;padding:10px 30px;" +
                "background:#1f1f1f;text-align:center}</style>"+
                "</head>" +
                "<body>" +
                "<table>" +
                "<tbody>" +
                "<tr><td>" +
                "<div id=\"top\"><table><tbody><tr><td></td></tr></tbody></table></div>" +
                "<div id=\"content\"><div id=\"content_top\">" +
                "<strong>尊敬的用户，您好！</strong>" +
                "<strong>您正在进行<span>" + actionDescription + "</span>操作，请在验证码中输入以下验证码完成操作：</strong>" +
                "<div id=\"verificationCode\">" +
                "<button class=\"button\">" + code + "</button>" +
                "</div></div>" +
                "<div id=\"content_bottom\"><small>注意：此操作可能会修改您的密码、登录邮箱或绑定手机。如非本人操作，请及时登录并修改密码以保证帐户安全<br>" +
                "（工作人员不会向你索取此验证码，请勿泄漏！)</small></div>" +
                "</div><div id=\"bottom\"><div>" +
                "<p>此为系统邮件，请勿回复<br>请保管好您的邮箱，避免账号被他人盗用</p>" +
                "<p id=\"sign\">——Wisterain</p>" +
                "</div></div></td></tr>" +
                "</tbody></table>" +
                "</body></html>";

        // 设置邮件内容为HTML
        helper.setText(emailContent, true);

        // 发送邮件
        mailSender.send(message);
        return true;
    }
}
