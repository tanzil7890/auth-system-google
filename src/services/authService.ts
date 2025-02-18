export interface AuthSession {
    accessToken: string;
    refreshToken: string;
    user: {
        id: string;
        email: string;
        subscription: {
            status: string;
        }
    }
}

export class AuthService {
    private static instance: AuthService;
    private authServerBase = 'http://localhost:4000';
    private websiteBase = 'http://localhost:3000';

    private constructor() {}

    static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    async createSession(): Promise<AuthSession> {
        const state = crypto.randomUUID();
        
        // Initialize auth flow
        const response = await fetch(`${this.authServerBase}/v1/auth/initialize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state })
        });
        
        const { authUrl } = await response.json();
        
        // Open auth window
        const authWindow = window.open(authUrl, 'auth', 'width=800,height=600');
        
        return new Promise((resolve, reject) => {
            const checkStatus = async () => {
                try {
                    const statusResponse = await fetch(
                        `${this.authServerBase}/v1/auth/editor/status?state=${state}`
                    );
                    const status = await statusResponse.json();
                    
                    if (status.status === 'authenticated') {
                        authWindow?.close();
                        resolve(status);
                    } else {
                        setTimeout(checkStatus, 1000);
                    }
                } catch (error) {
                    authWindow?.close();
                    reject(error);
                }
            };
            
            checkStatus();
        });
    }

    async refreshTokens(refreshToken: string): Promise<AuthSession> {
        // Implement token refresh logic
        throw new Error('Not implemented');
    }
} 