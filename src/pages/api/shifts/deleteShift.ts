import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

type DeleteShiftRequestBody = {
  id: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const body = _req.body as DeleteShiftRequestBody;
  const id: string = body.id;

  const { data, error } = await supabase.from("shifts").delete().eq("id", id);

  console.log(data, error);

  return res.status(200).json({ id, status: "Deleted" });
}
