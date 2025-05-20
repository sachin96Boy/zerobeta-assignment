import React from "react";

function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Sachin96Boy MarketPlace</a>
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />
        <div className="flex items-center justify-center">
            <button className="btn btn-outline">Login</button>
            <button className="btn btn-outline">Register</button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
