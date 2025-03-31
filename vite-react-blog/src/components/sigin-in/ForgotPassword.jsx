import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { sendResetEmail} from '../../api/email.js';
import {resetPassword} from "../../api/User.js";

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true); // 新增状态判断密码是否匹配

  // 处理倒计时
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // 发送验证码
  const handleSendCode = async (event) => {
    event.preventDefault();
    setSending(true);
    setMessage('');

    try {
      console.log('发送验证码:', email);
      const response = await sendResetEmail(email);
      console.log('发送验证码结果:', response);
      if (response.code === 200) {
        setCodeSent(true);
        setMessage('验证码已发送至您的邮箱。');
        setCountdown(60); // 设置倒计时为60秒
      } else {
        setMessage('发送验证码失败，请重试。');
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      setMessage('发送验证码失败，请重试。');
    } finally {
      setSending(false);
    }
  };

  // 验证验证码并继续
  const handleContinue = async (event) => {
    event.preventDefault();
    setMessage('');

    // 检查新密码和确认密码是否一致
    if (newPassword !== confirmPassword) {
      setMessage('新密码和确认密码不一致。');
      return;
    }

    const emailCode = {
      email,
      code,
      password:newPassword,
    };

    try {
      console.log('验证验证码:', emailCode);
      const response = await resetPassword(emailCode);
      console.log('验证验证码结果:', response);
      if (response.code === 200) {
        message.success('重置成功！'); // 提示用户重置成功
        handleClose(); // 关闭对话框
      } else {
        setMessage('重置失败，请检查验证码。');
      }
    } catch (error) {
      console.error('重置失败:', error);
      setMessage('重置失败，请检查验证码。');
    }
  };
  useEffect(() => {
    setPasswordsMatch(newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  return (
      <Dialog
          open={open}
          onClose={handleClose}
          PaperProps={{
            component: 'form',
            onSubmit: handleContinue,
            sx: { backgroundImage: 'none' },
          }}
      >
        <DialogTitle>重置密码</DialogTitle>
        <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            输入您账户的电子邮箱地址，我们将向您发送一个重置密码的邮件,填写验证码后完成重置。
          </DialogContentText>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OutlinedInput
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email address"
                placeholder="输入电子邮箱..."
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={handleSendCode}
                disabled={sending || countdown > 0}
            >
              {sending ? (
                  <CircularProgress size={20} sx={{ color: 'white' }} />
              ) : countdown > 0 ? (
                  `发送中...(${countdown})`
              ) : (
                  '发送'
              )}
            </Button>
          </Box>

          {codeSent && (
              <>
                <OutlinedInput
                    margin="dense"
                    id="code"
                    name="code"
                    label="Verification Code"
                    placeholder="输入验证码"
                    fullWidth
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <OutlinedInput
                    margin="dense"
                    id="newPassword"
                    name="newPassword"
                    label="新密码"
                    placeholder="输入新密码"
                    type="password"
                    fullWidth
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    sx={{ mt: 2 }}
                />
                <OutlinedInput
                    margin="dense"
                    id="confirmPassword"
                    name="confirmPassword"
                    label="确认新密码"
                    placeholder="确认新密码"
                    type="password"
                    fullWidth
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mt: 2 }}
                />
                {/* 提示用户新密码和确认密码是否一致 */}
                {!passwordsMatch && (
                    <DialogContentText color="error">新密码和确认密码不一致。</DialogContentText>
                )}
              </>
          )}
          {message && <DialogContentText color="error">{message}</DialogContentText>}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>返回</Button>
          <Button variant="contained" type="submit" disabled={!passwordsMatch}>
            提交
          </Button>
        </DialogActions>
      </Dialog>
  );
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default ForgotPassword;
