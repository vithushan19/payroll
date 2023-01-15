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
  userId: string;
  created_at: string;
  users: UserData;
};
export type AdminView = {
  userShifts: UserWithShifts[];
};

export type UserWithShifts = UserData & {
  shifts: Shift[];
};

export default async function handler(
  _req: NextApiRequest,
  res: NextApiResponse<AdminView>
) {
  const { data: shiftData, error } = await supabase
    .from("shifts")
    .select(
      `
  break_minutes,
  start_time,
  end_time,
  created_at,
  userId,
  users (
    name,
    id
  )
`
    )
    .gt("start_time", "Jan 1, 2023");
  const shifts = shiftData as Shift[];

  const { data, error: usersError } = await supabase.from("users").select(
    `
  name,
  id
`
  );
  const users = data as UserData[];

  const userShifts = users?.map((user) => {
    const shiftsForUser: Shift[] =
      shifts?.filter((shift) => shift.userId === user.id) ?? [];
    const userWithShifts: UserWithShifts = { ...user, shifts: shiftsForUser };
    return userWithShifts;
  });

  return res.status(200).json({ userShifts });
}
