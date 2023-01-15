import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { env } from "../../../env/server.mjs";
import { User } from "../users/getUser.js";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async session({ session }) {
      const BASE_URL = process.env.NEXTAUTH_URL ?? "";

      if (session.user) {
        await fetch(`${BASE_URL}/api/users/getUser`, {
          method: "POST",
          body: JSON.stringify({ email: session.user.email }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        })
          .then((res) => res.json())
          .then(async (res: { id: string }[]) => {
            if (res && res.length > 0 && session.user) {
              const id = res[0]?.id ?? "";
              session.user.id = id;
            } else {
              await fetch(`${BASE_URL}/api/users/createUser`, {
                method: "POST",
                body: JSON.stringify({
                  name: session.user?.name,
                  email: session.user?.email,
                }),
                headers: {
                  "Content-type": "application/json; charset=UTF-8",
                },
              });
            }
          });
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};

export default NextAuth(authOptions);
