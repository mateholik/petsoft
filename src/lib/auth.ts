import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./server-utils";
import { authSchema } from "./validations";

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

        const validatedFormDataObject = authSchema.safeParse(credentials);

        if (!validatedFormDataObject.success) {
          console.log("Invalid form data");
          return null;
        }

        const { email, password } = validatedFormDataObject.data;

        const user = await getUserByEmail(email);

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
    jwt: ({ token, user }) => {
      if (user) {
        //on sign in
        token.userId = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      if (session.user) {
        session.user.id = token.userId;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth(config);
