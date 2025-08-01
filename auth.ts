import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { usersTable } from "@/db/schema";
import { db } from "@/db";
import { User } from "next-auth";
import { eq } from "drizzle-orm";


const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;

if (!clientId || !clientSecret) {
  throw new Error("Missing Google OAuth environment variables");
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId,
      clientSecret,
    }),
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks: {
    async signIn({ user }: { user: User }) {
      if (!user.email) {
        return false; 
      }
      
      const existingUser = (
        await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.email, user.email!))
      )[0];

       
       if (!existingUser) {
        await db.insert(usersTable).values({
          email: user.email!,
          name: user.name || "",
        });
      }

      return true; // Permite el inicio de sesión
    },
  },
};

export default NextAuth(authOptions);