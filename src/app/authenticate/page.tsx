'use client';

import { signIn, useSession } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function Authenticate() {
  const searchParams = useSearchParams();
  const state = searchParams.get('state') || uuidv4();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize auth state
        await fetch('http://localhost:4000/v1/auth/initialize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ state }),
        });
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    if (!isProcessing && !session) {
      initializeAuth();
      signIn('google', {
        callbackUrl: `/authenticate?state=${state}`,
      });
    }
  }, [state, session, isProcessing]);

  useEffect(() => {
    const completeAuth = async () => {
      if (!session || !state || isProcessing) return;
      
      setIsProcessing(true);
      try {
        // Complete authentication with auth server
        const completeResponse = await fetch('http://localhost:4000/v1/auth/complete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            state,
            user: {
              id: session.user.id,
              email: session.user.email,
              name: session.user.name,
              image: session.user.image,
              emailVerified: session.user.emailVerified
            }
          })
        });

        if (!completeResponse.ok) {
          throw new Error('Failed to complete authentication');
        }

        // Get subscription status
        const subscriptionResponse = await fetch(`http://localhost:4000/v1/auth/subscription/${state}`);
        const subscription = await subscriptionResponse.json();

        if (subscription.status === 'active') {
          window.close();
        }
      } catch (error) {
        console.error('Auth completion failed:', error);
      } finally {
        setIsProcessing(false);
      }
    };

    completeAuth();
  }, [session, state, isProcessing]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">
          {status === 'loading' ? 'Loading...' : 'Authenticating...'}
        </h1>
        {session?.user?.name && (
          <p className="text-gray-600 mb-2">Welcome, {session.user.name}!</p>
        )}
      </div>
    </div>
  );
} 