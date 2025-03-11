package fun.struct.myblog.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import fun.struct.myblog.dto.CommentDTO;
import fun.struct.myblog.entity.Comments;
import fun.struct.myblog.mapper.CommentsMapper;
import fun.struct.myblog.service.CommentsService;
import fun.struct.myblog.vo.CommentsVO;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;


@Service
public class CommentsServiceImpl extends ServiceImpl<CommentsMapper, Comments> implements CommentsService {

    @Resource
   CommentsMapper commentsMapper;
    @Override
    public boolean saveComment(CommentDTO commentDTO) {
        if (commentDTO == null) {
            return false;
        }
        // 生成 Gravatar URL
        String avatarUrl = generateGravatarUrl(commentDTO.getEmail());

        Comments comments = new Comments();
        comments.setArticlesId(commentDTO.getArticleId());
        comments.setUsername(commentDTO.getUsername());
        comments.setEmail(commentDTO.getEmail());
        comments.setAvatarUrl(avatarUrl);
        comments.setWebsite(commentDTO.getWebsite());
        comments.setContent(commentDTO.getContent());
        comments.setParentId(commentDTO.getParentId());
        comments.setCreatedAt(LocalDateTime.now());

        return save(comments);
    }



    @Override
    public Page<CommentsVO> getCommentPageById(int page, int size, Integer id) {
        Page<CommentsVO> commentsPage = new Page<>(page, size);

        return  commentsMapper.selectCommentsPage(commentsPage, id);
    }

    // 单独加载回复的方法

    @Override
    public Page<CommentsVO> getReplyPageById(int page, int size, Integer id) {
        Page<CommentsVO> commentsPage = new Page<>(page, size);

        return  commentsMapper.selectReplyPage(commentsPage, id);
    }

    /**
     * 根据 email 生成 Gravatar URL
     *
     * @param email 用户邮箱
     * @return Gravatar URL
     */
    private String generateGravatarUrl(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null; // 如果 email 为空，返回 null
        }

        // 将 email 转换为小写并去除前后空格
        String trimmedEmail = email.trim().toLowerCase();

        // 计算 MD5 哈希值
        String md5Hash = md5(trimmedEmail);

        // 拼接 Gravatar URL
        return String.format("https://www.gravatar.com/avatar/%s?d=identicon", md5Hash);
    }

    /**
     * 计算字符串的 MD5 哈希值
     *
     * @param input 输入字符串
     * @return MD5 哈希值
     */
    private String md5(String input) {
        try {
            // 获取 MD5 实例
            MessageDigest md = MessageDigest.getInstance("MD5");

            // 计算哈希值
            byte[] hashBytes = md.digest(input.getBytes(StandardCharsets.UTF_8));

            // 将字节数组转换为十六进制字符串
            StringBuilder hexString = new StringBuilder();
            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("MD5 algorithm not found", e);
        }
    }


}
