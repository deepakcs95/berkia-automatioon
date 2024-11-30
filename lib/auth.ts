import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { onboardUser } from "@/db/user";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      await onboardUser(user);
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/";
    },
  },
});
