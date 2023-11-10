import type { DefaultSession } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma, Role } from "@flatwhite-team/prisma";
import NextAuth from "next-auth";
import type { KakaoProfile } from "next-auth/providers/kakao";
import KakaoProvider from "next-auth/providers/kakao";

import { env } from "./env.mjs";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

const useSecureCookies = env.AUTH_URL.startsWith("https://");
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const hostName = new URL(env.AUTH_URL).hostname;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
  update,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    KakaoProvider({
      clientId: process.env.AUTH_KAKAO_CLIENT_ID,
      clientSecret: process.env.AUTH_KAKAO_CLIENT_SECRET,
      profile(profile: KakaoProfile) {
        return {
          id: profile.id.toString(),
          name: profile.kakao_account?.name,
          email: profile.kakao_account?.email,
          emailVerified: profile.kakao_account?.is_email_verified,
          phoneNumber: profile.kakao_account?.phone_number,
          image: profile.properties?.profile_image,
          role: Role.STORE_MANAGER,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          ...user,
        },
      };
    },
    authorized: ({ auth }) => {
      return (
        auth?.user.role === Role.APP_ADMIN ||
        auth?.user.role === Role.STORE_MANAGER
      );
    },
  },
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        domain: "." + hostName,
        secure: useSecureCookies,
      },
    },
  },
});

export * from "next-auth/react";

export {
  signIn as signInClient,
  signOut as signOutClient,
} from "next-auth/react";
