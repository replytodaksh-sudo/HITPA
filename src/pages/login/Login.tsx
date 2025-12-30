import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Refresh,
  Email,
  Lock,
} from '@mui/icons-material';
import { encryptionService } from '../../utils/encryption.service';
import type { LoginRequest } from '../../types/auth.types';
import { loginService } from '../../services/login.service';
import { sessionService } from '../../utils/session.service';
import { userService } from '../../services/user.service';
import { notificationService } from '../../utils/notification.service';
import { message } from '../../constants/messages';

const Login: React.FC = () => {
  // Form states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Captcha states
  const [captchaText, setCaptchaText] = useState('');
  const [captchaCode, setCaptchaCode] = useState('');
  const [isCaptchaValid, setIsCaptchaValid] = useState(false);
  const [isCaptchaDirty, setIsCaptchaDirty] = useState(false);
  
  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Forgot Password Modal
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  
  // Reset Password Modal
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();

  // Generate Captcha
  const createCaptcha = () => {
    const charsArray = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*';
    const lengthOtp = 6;
    const captcha: string[] = [];
    
    for (let i = 0; i < lengthOtp; i++) {
      const index = Math.floor(Math.random() * charsArray.length);
      if (captcha.indexOf(charsArray[index]) === -1) {
        captcha.push(charsArray[index]);
      } else {
        i--;
      }
    }
    
    const code = captcha.join('');
    setCaptchaCode(code);
    
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'grey';
        ctx.font = '25px Georgia';
        ctx.strokeStyle = '#667EEA';
        ctx.strokeText(code, 10, 30);
      }
    }
    
    setCaptchaText('');
    setIsCaptchaDirty(false);
    setIsCaptchaValid(false);
  };

  useEffect(() => {
    createCaptcha();
  }, []);

  // Validate Captcha
  useEffect(() => {
    if (captchaText === captchaCode && captchaText !== '') {
      setIsCaptchaValid(true);
    } else {
      setIsCaptchaValid(false);
    }
  }, [captchaText, captchaCode]);

  // Handle Login
  const handleLogin = async () => {
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }
    
    if (!isCaptchaValid) {
      setError('Please enter valid captcha');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // Encrypt password
      const encryptedPassword = encryptionService.encryptJAVA(password);
      
      const requestModel: LoginRequest = {
        userName: username,
        password: "U2FsdGVkX18sGEBtH5B93brCMz/uxM12sXKNs+ZwN8E="
        // password: encryptedPassword,
      };
      
      const response = await loginService.login(requestModel);
      console.log("23456", response)
      if (response.statusCode == 0 && response.payload?.accessToken) {
        // Store session
        sessionService.storeSession(response.payload.accessToken);
        
        // Decode token and store user info
        const decodedValue:any = sessionService.decodeToken(response.payload.accessToken);
        console.log("decodedValue",decodedValue)
        if (decodedValue) {
          sessionService.storeOther('userCode', decodedValue.userCode);
          sessionService.storeOther('name', decodedValue.name);
          sessionService.storeOther('sessionId', decodedValue.sessionId);
        }
        
        // Navigate to dashboard
        window.location.href= "/admin/dashboard"
        navigate('/admin/dashboard');
      } else if (response.statusCode === 4006) {
        // Session already active
        const result = await notificationService.showAlertConfirm(
          response.message + ' Do you want to logout?'
        );
        
        if (result === 'Ok') {
          await loginService.sessionOut(requestModel.userName);
          setUsername('');
          setPassword('');
          createCaptcha();
        }
      } else {
        notificationService.showAlertSuccess(message.authFailure);
        createCaptcha();
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Authentication failed. Please try again.');
      createCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!forgotUsername) {
      notificationService.showAlertError('Please enter username');
      return;
    }
    
    try {
      const response:any = await userService.forgotPassword(forgotUsername);
      if (response.statusCode === 0) {
        notificationService.showAlertSuccess(response.message);
        setForgotPasswordOpen(false);
        setForgotUsername('');
      } else {
        notificationService.showAlertError(response.message);
      }
    } catch (error) {
      notificationService.showAlertError('Failed to send password reset');
    }
  };

  // Handle Verify Password
  const handleVerifyPassword = async () => {
    if (!resetUsername) {
      notificationService.showAlertError('Please enter username');
      return;
    }
    
    try {
      const response:any = await userService.verifyPassword(resetUsername);
      if (response.statusCode === 0) {
        setShowPasswordBox(true);
      } else {
        notificationService.showAlertError(response.message);
      }
    } catch (error) {
      notificationService.showAlertError('Verification failed');
    }
  };

  // Handle Reset Password
  const handleResetPassword = async () => {
    if (!newPassword) {
      notificationService.showAlertError('Please enter new password');
      return;
    }
    
    try {
      const response:any = await userService.resetPassword(resetUsername, newPassword);
      if (response.statusCode === 0) {
        notificationService.showAlertSuccess(response.message);
        setResetPasswordOpen(false);
        setResetUsername('');
        setNewPassword('');
        setShowPasswordBox(false);
      } else {
        notificationService.showAlertError(response.message);
      }
    } catch (error) {
      notificationService.showAlertError('Reset password failed');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && isCaptchaValid && !isLoading) {
      handleLogin();
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          top: '-250px',
          right: '-250px',
          animation: 'float 6s ease-in-out infinite',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%',
          bottom: '-150px',
          left: '-150px',
          animation: 'float 8s ease-in-out infinite',
        },
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Logo */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box
            component="img"
            src="/assets/images/logo.png"
            alt="Logo"
            sx={{
              maxWidth: '200px',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))',
              mb: 2,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </Box>

        <Paper
          elevation={24}
          sx={{
            p: 4,
            borderRadius: 4,
            backdropFilter: 'blur(10px)',
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
            }}
          >
            Health Investigation System
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Username Field */}
          <TextField
            fullWidth
            label="Username"
            type="email"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Password Field */}
          <TextField
            fullWidth
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            autoComplete="off"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 3 }}
          />

          {/* Captcha Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <canvas
                ref={canvasRef}
                width={150}
                height={50}
                style={{
                  border: '2px solid #E2E8F0',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                }}
              />
              <IconButton
                onClick={createCaptcha}
                color="primary"
                title="Refresh Captcha"
                sx={{
                  background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764BA2 0%, #667EEA 100%)',
                  },
                }}
              >
                <Refresh />
              </IconButton>
            </Box>

            <TextField
              fullWidth
              label="Enter Captcha"
              placeholder="Enter the code shown above"
              value={captchaText}
              onChange={(e) => {
                setCaptchaText(e.target.value);
                setIsCaptchaDirty(true);
              }}
              onKeyPress={handleKeyPress}
              error={!isCaptchaValid && isCaptchaDirty}
              helperText={
                !isCaptchaValid && isCaptchaDirty
                  ? 'Please enter a valid captcha code'
                  : ''
              }
            />
          </Box>

          {/* Forgot Password Link */}
          <Box sx={{ textAlign: 'right', mb: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 600,
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => setForgotPasswordOpen(true)}
            >
              Forgot Password?
            </Typography>
          </Box>

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={isLoading || !isCaptchaValid}
            sx={{
              py: 1.5,
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #764BA2 0%, #667EEA 100%)',
              },
              '&:disabled': {
                background: '#CBD5E1',
                color: '#64748B',
              },
            }}
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Loading...
              </>
            ) : (
              'Login'
            )}
          </Button>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          align="center"
          sx={{
            mt: 3,
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          © 2021 General Insurance Company Limited | All Rights Reserved.
        </Typography>
      </Container>

      {/* Forgot Password Modal */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={() => {
          setForgotPasswordOpen(false);
          setForgotUsername('');
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Forgot Password
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <TextField
            autoFocus
            fullWidth
            label="Username"
            placeholder="Enter your username"
            value={forgotUsername}
            onChange={(e) => setForgotUsername(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setForgotPasswordOpen(false);
              setForgotUsername('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleForgotPassword}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            }}
          >
            Send Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog
        open={resetPasswordOpen}
        onClose={() => {
          setResetPasswordOpen(false);
          setResetUsername('');
          setNewPassword('');
          setShowPasswordBox(false);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle
          sx={{
            background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            color: 'white',
            fontWeight: 600,
          }}
        >
          Reset Password
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <TextField
              fullWidth
              label="Username"
              placeholder="Enter your username"
              value={resetUsername}
              onChange={(e) => setResetUsername(e.target.value)}
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              onClick={handleVerifyPassword}
              sx={{
                mt: 0.5,
                background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
              }}
            >
              Verify
            </Button>
          </Box>

          {showPasswordBox && (
            <TextField
              fullWidth
              label="New Password"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={() => {
              setResetPasswordOpen(false);
              setResetUsername('');
              setNewPassword('');
              setShowPasswordBox(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleResetPassword}
            disabled={!showPasswordBox}
            sx={{
              background: 'linear-gradient(180deg, #4A7FC1 0%, #2E5A96 100%)',
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;