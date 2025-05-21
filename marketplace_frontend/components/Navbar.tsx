import Link from "next/link";
import React from "react";

function Navbar() {
  return (
    <div className="navbar bg-gray-200 shadow-sm text-gray-800">
      <div className="flex-1">
        <Link href={'/'} className="btn btn-ghost text-xl">Sachin96Boy MarketPlace</Link>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto bg-gray-100"
        />
        <div className="flex items-center justify-center gap-4 mx-2">
          <Link href={'/login'} className="btn btn-outline">Login</Link>
          <Link href={'/register'} className="btn btn-outline">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
