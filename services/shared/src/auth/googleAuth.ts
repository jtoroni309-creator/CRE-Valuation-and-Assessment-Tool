/**
 * Google Cloud Identity Authentication Service
 * Handles authentication with Google Cloud Identity Platform (Firebase Auth)
 */

import { OAuth2Client } from 'google-auth-library';

export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  emailVerified: boolean;
  locale?: string;
  hd?: string; // Hosted domain (for workspace users)
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
  tokenType: string;
}

export interface DecodedToken {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
  hd?: string;
  iss: string;
  aud: string;
  exp: number;
  iat: number;
}

export interface AuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  allowedDomains?: string[]; // Restrict to specific workspace domains
}

/**
 * Google Cloud Identity Authentication Service
 */
export class GoogleAuthService {
  private client: OAuth2Client;
  private config: AuthConfig;

  constructor(config: AuthConfig) {
    this.config = config;
    this.client = new OAuth2Client(
      config.clientId,
      config.clientSecret,
      config.redirectUri
    );
  }

  /**
   * Generate OAuth2 authorization URL
   */
  getAuthorizationUrl(state?: string, scopes?: string[]): string {
    const defaultScopes = [
      'openid',
      'email',
      'profile',
    ];

    return this.client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes || defaultScopes,
      state,
      prompt: 'consent',
      include_granted_scopes: true,
    });
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(code: string): Promise<AuthTokens> {
    const { tokens } = await this.client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('Failed to obtain access token');
    }

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || undefined,
      idToken: tokens.id_token || undefined,
      expiresIn: tokens.expiry_date ? Math.floor((tokens.expiry_date - Date.now()) / 1000) : 3600,
      tokenType: 'Bearer',
    };
  }

  /**
   * Verify and decode ID token
   */
  async verifyIdToken(idToken: string): Promise<DecodedToken> {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: this.config.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new Error('Invalid token payload');
    }

    // Check for allowed domains if configured
    if (this.config.allowedDomains && this.config.allowedDomains.length > 0) {
      if (!payload.hd || !this.config.allowedDomains.includes(payload.hd)) {
        throw new Error(`Access restricted to domains: ${this.config.allowedDomains.join(', ')}`);
      }
    }

    return {
      sub: payload.sub!,
      email: payload.email!,
      name: payload.name!,
      picture: payload.picture,
      email_verified: payload.email_verified || false,
      hd: payload.hd,
      iss: payload.iss!,
      aud: payload.aud as string,
      exp: payload.exp!,
      iat: payload.iat!,
    };
  }

  /**
   * Get user info from access token
   */
  async getUserInfo(accessToken: string): Promise<GoogleUser> {
    this.client.setCredentials({ access_token: accessToken });

    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user info');
    }

    const data = await response.json();

    // Check for allowed domains if configured
    if (this.config.allowedDomains && this.config.allowedDomains.length > 0) {
      if (!data.hd || !this.config.allowedDomains.includes(data.hd)) {
        throw new Error(`Access restricted to domains: ${this.config.allowedDomains.join(', ')}`);
      }
    }

    return {
      id: data.sub,
      email: data.email,
      name: data.name,
      picture: data.picture,
      emailVerified: data.email_verified,
      locale: data.locale,
      hd: data.hd,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    this.client.setCredentials({ refresh_token: refreshToken });

    const { credentials } = await this.client.refreshAccessToken();

    if (!credentials.access_token) {
      throw new Error('Failed to refresh access token');
    }

    return {
      accessToken: credentials.access_token,
      refreshToken: credentials.refresh_token || refreshToken,
      idToken: credentials.id_token || undefined,
      expiresIn: credentials.expiry_date ? Math.floor((credentials.expiry_date - Date.now()) / 1000) : 3600,
      tokenType: 'Bearer',
    };
  }

  /**
   * Revoke tokens
   */
  async revokeToken(token: string): Promise<void> {
    await this.client.revokeToken(token);
  }

  /**
   * Verify access token
   */
  async verifyAccessToken(accessToken: string): Promise<boolean> {
    try {
      const response = await fetch(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${accessToken}`
      );

      if (!response.ok) {
        return false;
      }

      const data = await response.json();

      // Check if token is for our application
      if (data.aud !== this.config.clientId) {
        return false;
      }

      // Check if token is expired
      if (data.expires_in <= 0) {
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Express middleware for Google authentication
 */
export function createAuthMiddleware(authService: GoogleAuthService) {
  return async (req: any, res: any, next: any) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header' });
      }

      const [type, token] = authHeader.split(' ');

      if (type !== 'Bearer' || !token) {
        return res.status(401).json({ error: 'Invalid authorization format' });
      }

      // Try to verify as ID token first
      try {
        const decoded = await authService.verifyIdToken(token);
        req.user = {
          id: decoded.sub,
          email: decoded.email,
          name: decoded.name,
          picture: decoded.picture,
          emailVerified: decoded.email_verified,
          domain: decoded.hd,
        };
        return next();
      } catch {
        // If ID token verification fails, try as access token
        const isValid = await authService.verifyAccessToken(token);
        if (!isValid) {
          return res.status(401).json({ error: 'Invalid or expired token' });
        }

        const userInfo = await authService.getUserInfo(token);
        req.user = userInfo;
        return next();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({ error: 'Authentication failed' });
    }
  };
}

/**
 * Role-based access control middleware
 */
export function requireRoles(...roles: string[]) {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Check if user has required role (stored in user object or fetched from database)
    const userRoles = req.user.roles || [];
    const hasRole = roles.some(role => userRoles.includes(role));

    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}

/**
 * Create Google Auth service instance from environment variables
 */
export function createGoogleAuthFromEnv(): GoogleAuthService {
  const config: AuthConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    redirectUri: process.env.GOOGLE_REDIRECT_URI || `${process.env.APP_URL}/api/auth/callback`,
    allowedDomains: process.env.GOOGLE_ALLOWED_DOMAINS?.split(',').map(d => d.trim()),
  };

  if (!config.clientId || !config.clientSecret) {
    console.warn('Google Auth: Missing client credentials. Auth will not be available.');
  }

  return new GoogleAuthService(config);
}

export default GoogleAuthService;
