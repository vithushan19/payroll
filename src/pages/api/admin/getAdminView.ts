import type { NextApiResponse, NextApiRequest } from "next";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "supabase-url",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "anon-key"
);

type UserData = {
  name: string;
  id: string;
};
export type Shift = {
  break_minutes: number;
  start_time: string;
  end_time: string;
  created_at: string;
  users: UserData;
};
export type AdminView = {
  shifts: Shift[];
  users: User[];
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse
) {
  const { data: shifts, error } = await supabase
    .from("shifts")
    .select(
      `
  break_minutes,
  start_time,
  end_time,
  created_at,
  users (
    name
    id
  )
`
    )
    .gt("start_time", "Jan 1, 2023");

  const { data: users, error: usersError } = await supabase
    .from("users")
    .select(
      `
  name,
  id,
`
    );

  return res.status(200).json({ data: "KK" });
}

type User = {
  users: UserData;
  created_at: string;
  end_time: string;
  start_time: string;
  break_minutes: number;
};
