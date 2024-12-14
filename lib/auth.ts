import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { onboardUser } from "@/lib/db/user";
import { generateIdFromEmail } from "./utils/utils";
import GitHub from "next-auth/providers/github";
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  callbacks: {
    async signIn({ user, account }) {
      console.log("User signed in:", user);
      try {
         await onboardUser(user);
        return true;
      } catch (error) {
        console.error("Error during onboarding:", error);
        return false;
      }
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

