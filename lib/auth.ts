import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { onboardUser } from "@/db/user";
import { generateIdFromEmail } from "./utils";
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
    session({ session }) {
      const id = generateIdFromEmail(session.user.email);

      session.user.id = id;
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + "/";
    },
  },
});
