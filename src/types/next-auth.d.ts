import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email?: string | null;
      first_name?: string | null;
      last_name?: string | null;
      profile_picture_url?: string | null;
      subscription_status?: string;
      waitlistPosition?: number;
    }
  }
} 