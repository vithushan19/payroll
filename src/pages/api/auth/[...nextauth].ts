import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { SupabaseAdapter } from "@next-auth/supabase-adapter";
import { env } from "../../../env/server.mjs";
import { User } from "../users/getUser.js";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async signIn({ user }) {
      const BASE_URL = process.env.NEXTAUTH_URL ?? "";
      console.log("email", user.email);

      await fetch(`${BASE_URL}/api/users/getUser`, {
        method: "POST",
        body: JSON.stringify({ email: user.email }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((res) => res.json())
        .then(async (res: User[]) => {
          console.log("res", res);

          if (res && res.length > 0) {
            // user exists
          } else {
            // create user
            await fetch(`${BASE_URL}/api/users/createUser`, {
              method: "POST",
              body: JSON.stringify({
                name: user.name,
                email: user.email,
              }),
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
      return true;
    },
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
          .then((res: { id: string }[]) => {
            if (res && res.length > 0 && session.user) {
              const id = res[0]?.id ?? "";
              session.user.id = id;
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
