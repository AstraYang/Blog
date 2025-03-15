import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box'; // 导入 Box 组件
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { sendResetEmail, verifyCode } from '../../api/email.js';  // 根据实际路径引入API

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [message, setMessage] = useState('');

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
    console.log('验证验证码:', email, code)
    event.preventDefault();
    setMessage('');

  const emailCode = {
    email,
    code,
    type: 'reset',
  };

    try {
      console.log('验证验证码:', emailCode);
      const response = await verifyCode(emailCode);
      console.log('验证验证码结果:', response);
      if (response.code === 200) {
        alert('重置成功！'); // 提示用户重置成功
        handleClose(); // 关闭对话框
      } else {
        setMessage('重置失败，请检查验证码。');
      }
    } catch (error) {
      console.error('重置失败:', error);
      setMessage('重置失败，请检查验证码。');
    }
  };

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
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
        >
          <DialogContentText>
            Enter your account&apos;s email address, and we&apos;ll send you a link to
            reset your password.
          </DialogContentText>

          {/* 使用 Box 组件来放置输入框和按钮 */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <OutlinedInput
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email address"
                placeholder="Email address"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Button
                variant="contained"
                onClick={handleSendCode}
                disabled={sending || countdown > 0} // 在发送或倒计时期间禁用按钮
            >
              {sending ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
              ) : countdown > 0 ? (
                  `发送中...(${countdown})`
              ) : (
                  'SendCode'
              )}
            </Button>
          </Box>

          {codeSent && (
              <OutlinedInput
                  margin="dense"
                  id="code"
                  name="code"
                  label="Verification Code"
                  placeholder="Enter verification code"
                  fullWidth
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  sx={{ mt: 2 }} // 适当的间距
              />
          )}
          {message && <DialogContentText color="error">{message}</DialogContentText>}
        </DialogContent>
        <DialogActions sx={{ pb: 3, px: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" type="submit" >
            Continue
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
