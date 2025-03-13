package fun.struct.myblog.service;

import jakarta.mail.MessagingException;

public interface VerificationCodeService {

    boolean sendVerificationEmail(String to) throws MessagingException;
    boolean sendPasswordResetEmail(String to) throws MessagingException;
    boolean sendEmail(String to, String subject, String actionDescription) throws MessagingException;
    //boolean sendVerificationCode(String email);
    boolean verifyCode(String email, String code);
}
