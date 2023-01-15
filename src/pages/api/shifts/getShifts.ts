import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

export type Shift = {
  start_time: string;
  end_time: string;
  break_minutes: number;
};

type ShiftsRequestBody = {
  userId: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<Shift[]>
) {
  const body = _req.body as ShiftsRequestBody;
  const userId: string = body.userId;
  const { data, error } = await supabase
    .from("shifts")
    .select("*")
    .eq("userId", userId);

  const shifts: Shift[] = data as Shift[];
  return res.status(200).json(shifts ? shifts : []);
}
