import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      try {
        if (account?.provider === "google") {
          const names = profile?.name?.split(" ") || ["", ""];
          user.first_name = names[0];
          user.last_name = names.slice(1).join(" ");
          user.profile_picture_url = profile?.picture?.replace('=s96-c', '=s400-c') || profile?.image;
          user.email = profile?.email;
          user.subscription_status = "free";
          delete user.name;
          delete user.image;
        }
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, user }: any) {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          subscription_status: user.subscription_status,
          waitlistPosition: user.waitlistPosition,
          profile_picture_url: user.profile_picture_url
        }
      };
    },
    async redirect({ url, baseUrl }) {
      return `${baseUrl}/redirect`;
    },
  },
  pages: {
    signIn: "/authenticate",
  },
});

export { handler as GET, handler as POST };