import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

type CreateUserRequestBody = {
  email: string;
  name: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const body = _req.body as CreateUserRequestBody;
  const email: string = body.email;
  const name: string = body.name;

  await supabase.from("users").insert([{ email, name }]);

  return res.status(200).json({ email, name });
}
