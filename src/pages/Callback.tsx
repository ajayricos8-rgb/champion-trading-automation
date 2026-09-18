// src/pages/Callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { oauthService } from '../services/oauth/oauthService';

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const authData = oauthService.handleCallback();

    if (authData) {
      console.log('✅ Logged in as:', authData.accountId);
      // Redirect to your app's main page
      navigate('/discover');
    } else {
      console.error('❌ No token received from Deriv');
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#555'
    }}>
      Authenticating with Deriv...
    </div>
  );
}