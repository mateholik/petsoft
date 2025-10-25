import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";

const config = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        //runs on LOGIN
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          console.log("No user found");
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.hashedPassword,
        );

        if (!passwordsMatch) {
          console.log("Invalid credentials");
          return null;
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: ({ request, auth }) => {
      //runs on every REQUEST with middlware
      const isTryingToAccessApp = request.nextUrl.pathname.includes("/app");

      const isLoggedIn = !!auth?.user;
      if (isTryingToAccessApp && isLoggedIn) {
        return true;
      }
      if (isTryingToAccessApp && !isLoggedIn) {
        return false;
      }

      if (!isTryingToAccessApp && isLoggedIn) {
        return Response.redirect(new URL("/app/dashboard", request.nextUrl));
      }

      if (!isTryingToAccessApp && !isLoggedIn) {
        return true;
      }

      return false;
    },
  },
} satisfies NextAuthConfig;

export const { auth, signIn, signOut } = NextAuth(config);
