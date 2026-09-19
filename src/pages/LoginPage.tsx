/**
 * @file: LoginPage.tsx
 * @description: Simple login page component that accepts any credentials
 *               and sets the authentication state without external validation.
 *
 * @components: LoginPage - Form with username and password fields
 * @dependencies:
 *   - React: useState for form state
 *   - antd: Form, Input, Button components for UI
 *   - useAuth: For authentication state management
 *   - useNavigate: For redirection after login
 * @usage:
 *   // In router configuration
 *   <Route path="/login" element={<LoginPage />} />
 *
 * @architecture: Presentational component with local form state
 * @relationships:
 *   - Used by: Router
 *   - Uses: AuthContext for authentication state
 * @dataFlow: Captures form input, updates auth state, redirects user
 */
import { useState, useEffect } from 'react';
import { Button, Typography, ConfigProvider, theme as antdTheme } from 'antd';
import { useTheme } from '../contexts/ThemeContext';
import { oauthService } from '../services/oauth/oauthService';
import logoSvg from '../assets/favicon.svg';
import '../styles/login.scss';

const { Title } = Typography;

export function LoginPage() {
  const [formVisible, setFormVisible] = useState(false);
  const { effectiveTheme } = useTheme();

  // Animation effect when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    oauthService.initiateLogin();
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: effectiveTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff' as string,
          borderRadius: 6,
        } as any,
      }}
    >
      <div className={`login-page ${effectiveTheme}`}>
        <div 
          className="login-container"
          style={{ 
            opacity: formVisible ? 1 : 0, 
            transform: formVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-in-out'
          }}
        >
          <div className="login-logo">
            <img src={logoSvg} alt="Champion Trading Logo" />
          </div>
          
          <Title level={2} className="login-title">
            Champion Trading
          </Title>
          
          <Button
            type="primary"
            onClick={handleLogin}
            className="login-button"
            block
            size="large"
          >
            Log in with Deriv
          </Button>
        </div>
      </div>
    </ConfigProvider>
  );
}
