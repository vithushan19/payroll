import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

type CreateShiftRequestBody = {
  userId: string;
  end_time: string;
  break_minutes: number;
  start_time: string;
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const body = _req.body as CreateShiftRequestBody;
  const userId: string = body.userId;
  const start_time: string = body.start_time;
  const end_time: string = body.end_time;
  const break_minutes: number = body.break_minutes;

  const { data, error } = await supabase
    .from("shifts")
    .insert([{ userId, start_time, break_minutes, end_time }]);

  console.log(data, error);

  return res
    .status(200)
    .json({ userId, start_time, break_minutes, end_time, status: "Created" });
}
