import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

export const authOptions = {
  providers: [
    Google({
      clientId,
      clientSecret,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
};

export const auth = NextAuth(authOptions);
