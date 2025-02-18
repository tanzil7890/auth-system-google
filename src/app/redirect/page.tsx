'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';

export default function Redirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleEditorRedirect = () => {
    window.location.href = 'https://outhad.com';
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center space-x-4 mb-4">
          {session.user.profile_picture_url && (
            <div className="relative">
              <div className="w-16 h-16 relative">
                <Image
                  src={session.user.profile_picture_url}
                  alt="Profile"
                  fill
                  className="rounded-full object-cover border-2 border-blue-500"
                  onError={(e) => {
                    // @ts-ignore
                    e.target.src = '/default-avatar.png';
                  }}
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          )}
          <div>
            <h2 className="text-xl font-semibold">
              {`${session.user.first_name || ''} ${session.user.last_name || ''}`}
            </h2>
            <p className="text-gray-600">{session.user.email}</p>
          </div>
        </div>
        <div className="border-t pt-4 mt-4">
          <p className="text-gray-700 mb-2">
            Subscription Status:{' '}
            <span className="font-semibold capitalize">
              {session.user.subscription_status || 'free'}
            </span>
          </p>
          <p className="text-gray-700 mb-4">
            Queue Position:{' '}
            <span className="font-semibold">
              {session.user.waitlistPosition || 0}
            </span>
          </p>
          <div className="space-y-3">
            <button
              onClick={handleEditorRedirect}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
            >
              <svg 
                className="w-5 h-5 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
                />
              </svg>
              Open AIDE Editor
            </button>
            <button
              onClick={() => signOut()}
              className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 