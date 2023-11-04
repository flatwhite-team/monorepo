import type { DefaultSession } from "@auth/core/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@flatwhite-team/prisma";
import NextAuth from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import NaverProvider from "next-auth/providers/naver";

export type { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

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
    }),
    NaverProvider({
      clientId: process.env.AUTH_NAVER_CLIENT_ID,
      clientSecret: process.env.AUTH_NAVER_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
  },
});

export * from "next-auth/react";

export {
  signIn as signInClient,
  signOut as signOutClient,
} from "next-auth/react";
