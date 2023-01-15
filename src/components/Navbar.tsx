import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex bg-black text-white">
      <Link href={"/"}>
        <div className="transform p-4 transition-colors hover:bg-purple-800">
          Home
        </div>
      </Link>
      <Link href={"/shifts"}>
        <div className="transform p-4 transition-colors hover:bg-purple-800">
          Shifts
        </div>
      </Link>
      <Link href={"/admin"}>
        <div className="transform p-4 transition-colors hover:bg-purple-800">
          Admin
        </div>
      </Link>
    </div>
  );
}
