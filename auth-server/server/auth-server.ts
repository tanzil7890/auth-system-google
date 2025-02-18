import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 4000;

// In-memory store for auth states and tokens
const authStates = new Map<string, {
    accessToken?: string;
    refreshToken?: string;
    completed?: boolean;
    user?: {
        id: string;
        email: string;
        name: string;
        image: string;
        emailVerified: boolean;
        subscription?: {
            status: 'active' | 'inactive' | 'trial';
            plan: string;
            trialEnd?: string;
        }
    }
}>();

// Configure CORS to allow requests from your frontend
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    credentials: true
}));
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Initialize authentication
app.post('/v1/auth/initialize', (req, res) => {
    const { state, user } = req.body;
    console.log('Initializing auth state:', { state, user });
    
    if (!state) {
        return res.status(400).json({ error: 'State is required' });
    }

    // Create new auth state
    authStates.set(state, {
        completed: false,
        user: null
    });

    res.json({ success: true });
});

// Check authentication status
app.get('/v1/auth/editor/status', (req, res) => {
    const { state } = req.query;
    const authState = authStates.get(state as string);

    if (!authState) {
        return res.status(404).json({ error: 'State not found' });
    }

    if (authState.accessToken) {
        res.json({
            status: 'authenticated',
            user: authState.user,
            tokens: {
                accessToken: authState.accessToken,
                refreshToken: authState.refreshToken
            }
        });
    } else {
        res.json({ status: 'pending' });
    }
});

// Add this endpoint to check subscription status
app.get('/v1/auth/subscription/:state', (req, res) => {
    const { state } = req.params;
    const authState = authStates.get(state);

    if (!authState || !authState.completed) {
        return res.status(404).json({ error: 'Subscription not found' });
    }

    // Return subscription status
    res.json({
        status: authState.user?.subscription?.status || 'inactive',
        plan: authState.user?.subscription?.plan,
        trialEnd: authState.user?.subscription?.trialEnd
    });
});

// Complete authentication
app.post('/v1/auth/complete', (req, res) => {
    const { state, user } = req.body;
    const authState = authStates.get(state);

    if (!authState) {
        return res.status(404).json({ error: 'Auth state not found' });
    }

    // Update auth state with user and subscription info
    authState.completed = true;
    authState.user = {
        ...user,
        subscription: {
            status: 'trial',
            plan: 'pro',
            trialEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
        }
    };

    res.json({ success: true });
});

// Check completion status
app.get('/v1/auth/status/:state', (req, res) => {
    const { state } = req.params;
    const authState = authStates.get(state);

    if (!authState) {
        return res.status(404).json({ error: 'Auth state not found' });
    }

    res.json({
        completed: authState.completed || false,
        user: authState.user,
        subscription: authState.user?.subscription
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Auth server running on http://localhost:${PORT}`);
    console.log('Available endpoints:');
    console.log('- POST /v1/auth/initialize');
    console.log('- GET  /v1/auth/editor/status');
    console.log('- GET  /v1/auth/subscription/:state');
    console.log('- POST /v1/auth/complete');
    console.log('- GET  /v1/auth/status/:state');
    console.log('- GET  /health');
}); 