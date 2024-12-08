import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { onboardUser } from "@/lib/db/user";
import { generateIdFromEmail } from "./utils";
import GitHub from "next-auth/providers/github";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account }) {
      console.log("User signed in:", user);
      await onboardUser(user);
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        const id = generateIdFromEmail(user.email || '');
        token.id = id;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      return session;
    },
     
    async redirect({ url, baseUrl }) {
      return baseUrl + "/";
    },
  },
});

