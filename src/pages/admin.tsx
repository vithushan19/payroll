/* eslint-disable @typescript-eslint/no-misused-promises */
import moment, { Moment } from "moment";
import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { HTMLInputTypeAttribute, useCallback, useEffect } from "react";
import { useState } from "react";
import DatePicker from "react-date-picker/dist/entry.nostyle";

import Datetime from "react-datetime";
import { AdminView, Shift } from "./api/admin/getAdminView";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const [data, setData] = useState<Shift[]>([]);
  const fetchData = async () => {
    const BASE_URL = process.env.NEXTAUTH_URL ?? "";

    const response = await fetch(`${BASE_URL}/api/admin/getAdminView`);
    const newData: AdminView = (await response.json()) as AdminView;

    setData(newData.shifts);
  };

  useEffect(() => {
    void fetchData();
  }, [session?.user?.id]);

  function getHours(shift: Shift) {
    const SECS_IN_A_MIN = 60;
    const MS_IN_A_SEC = 1000;
    const MIN_IN_HOUR = 60;
    const diff =
      moment(shift.end_time).diff(moment(shift.start_time)) /
      SECS_IN_A_MIN /
      MS_IN_A_SEC;
    const hours = (diff - shift.break_minutes) / MIN_IN_HOUR;
    const mins = (diff - shift.break_minutes) % MIN_IN_HOUR;

    return `${hours}:${mins.toString().padStart(2, "0")}`;
  }

  async function onDelete(shiftId: string) {
    const BASE_URL = process.env.NEXTAUTH_URL ?? "";
    await fetch(`${BASE_URL}/api/shifts/deleteShift`, {
      method: "POST",
      body: JSON.stringify({
        id: shiftId,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }).then((res) => fetchData());
  }
  const headers = [
    "Name",
    moment()
      .add(moment().day() - ((moment().day() + 6) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - ((moment().day() + 5) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - ((moment().day() + 4) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - ((moment().day() + 3) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - ((moment().day() + 2) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - ((moment().day() + 1) % 7), "d")
      .format("ddd MMM DD"),
    moment()
      .add(moment().day() - (moment().day() % 7), "d")
      .format("ddd MMM DD"),
  ];
  return (
    <>
      <Head>
        <title>Payroll App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            <span className="text-[hsl(280,100%,70%)]">Admin</span> Portal
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 md:gap-8">
            <div className="grid grid-cols-8 rounded-xl bg-purple-900 p-4 text-white">
              {headers.map((header, i) => (
                <p className="w-40 font-bold" key={i}>
                  {header}
                </p>
              ))}
            </div>

            {data.map((shift, i) => (
              <div
                key={i}
                className="grid grid-cols-8 rounded-xl bg-purple-700 p-4 text-white"
              >
                <p className="">{shift.users.name}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
                <p className="">{getHours(shift)}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
