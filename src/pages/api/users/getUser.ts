import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

export type User = {
  name: string;
};

type UsersRequestBody = {
  email: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  const body = _req.body as UsersRequestBody;
  const email: string = body.email;
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email);

  const users: User[] = data as User[];
  return res.status(200).json(users ? users : []);
}
