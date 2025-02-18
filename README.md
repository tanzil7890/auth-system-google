# Auth System 2

A modern authentication and subscription management system built with Next.js, integrating with Google OAuth and a custom subscription service.

## Overview

This project provides a complete authentication and subscription management solution with two main components:

1. **Authentication Frontend** (Port 3000)
   - Handles user authentication through Google OAuth
   - Manages user sessions
   - Provides a seamless authentication flow
   - Integrates with subscription service

2. **Subscription Backend** (Port 4000)
   - Manages subscription states
   - Handles subscription validation
   - Provides subscription status endpoints
   - Maintains user subscription data

## Features

- **Google OAuth Integration**
  - Secure authentication using Google credentials
  - Email verification
  - Profile information sync

- **Subscription Management**
  - Trial subscription handling
  - Subscription status tracking
  - Real-time subscription validation

- **Session Management**
  - Secure session handling
  - Token-based authentication
  - Session persistence

- **API Integration**
  - RESTful API endpoints
  - Subscription status checks
  - Authentication state management

## Technical Stack

- **Frontend**
  - Next.js 15+
  - NextAuth.js for authentication
  - TailwindCSS for styling
  - TypeScript for type safety

- **Backend**
  - Node.js
  - Express
  - TypeScript
  - In-memory state management

## Architecture

The system follows a microservices architecture with two main services:

1. **Auth System (Port 3000)**
   - Handles user authentication
   - Manages user sessions
   - Integrates with Google OAuth
   - Communicates with subscription service

2. **Auth Server (Port 4000)**
   - Manages subscription states
   - Validates authentication
   - Provides subscription endpoints
   - Maintains user data

## API Endpoints

### Auth System (3000)
- `/api/auth/[...nextauth]` - NextAuth.js authentication endpoints
- `/authenticate` - Authentication handling page
- `/redirect` - OAuth redirect handler

### Auth Server (4000)
- `POST /v1/auth/initialize` - Initialize authentication state
- `GET /v1/auth/editor/status` - Get editor authentication status
- `GET /v1/auth/subscription/:state` - Get subscription status
- `POST /v1/auth/complete` - Complete authentication process
- `GET /v1/auth/status/:state` - Get authentication status
- `GET /health` - Health check endpoint

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret
   GOOGLE_ID=your-google-client-id
   GOOGLE_SECRET=your-google-client-secret
   ```

4. Run the development servers:
   ```bash
   # Terminal 1 - Auth System
   npm run dev

   # Terminal 2 - Auth Server
   cd auth-server
   npm run dev
   ```

5. Access the application at `http://localhost:3000`

## Flow

1. User initiates authentication
2. Google OAuth handles user verification
3. User data is captured and stored
4. Subscription status is created/updated
5. User session is established
6. Subscription status can be queried

## Security

- OAuth 2.0 protocol for authentication
- Secure session management
- CSRF protection
- Environment variable protection
- Type-safe implementations

## License

MIT License - See LICENSE file for details
