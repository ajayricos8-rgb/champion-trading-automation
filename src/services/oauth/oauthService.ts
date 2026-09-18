// src/services/oauth/oauthService.ts

const APP_ID = import.meta.env.VITE_DERIV_APP_ID;
const REDIRECT_URI = import.meta.env.VITE_DERIV_REDIRECT_URI;
const OAUTH_URL = import.meta.env.VITE_DERIV_OAUTH_URL;

const STORAGE_KEY = 'deriv_auth';

export interface DerivAuthData {
  token: string;
  accountId: string;
  currency: string;
  loginTime: number;
}

class OAuthService {
  /**
   * Redirects the user to Deriv's OAuth login page.
   * After login, Deriv will redirect them back to REDIRECT_URI
   */
  public initiateLogin(): void {
    if (!APP_ID || !REDIRECT_URI) {
      console.error('Missing VITE_DERIV_APP_ID or VITE_DERIV_REDIRECT_URI');
      return;
    }

    const authUrl = `${OAUTH_URL}?app_id=${APP_ID}&l=en&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    window.location.href = authUrl;
  }

  /**
   * Called from the /callback page.
   * Deriv sends the token in URL params like: ?token1=abc&acct1=CR123&cur1=USD
   */
  public handleCallback(): DerivAuthData | null {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token1');
    const accountId = params.get('acct1');
    const currency = params.get('cur1') || 'USD';

    if (!token || !accountId) {
      return null;
    }

    const authData: DerivAuthData = {
      token,
      accountId,
      currency,
      loginTime: Date.now(),
    };

    // Persist so the user stays logged in after refresh
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));

    return authData;
  }

  /**
   * Returns the stored auth data, or null if not logged in.
   */
  public getAuthData(): DerivAuthData | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as DerivAuthData;
    } catch {
      return null;
    }
  }

  /**
   * Returns true if the user is currently logged in.
   */
  public isLoggedIn(): boolean {
    return this.getAuthData() !== null;
  }

  /**
   * Clears the auth data and redirects to the login page.
   */
  public logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    window.location.href = '/login';
  }
}

export const oauthService = new OAuthService();