"use client";
import Image from "next/image";
import React, { useState } from "react";
import MenuIcon from "@mui/icons-material/Menu";

const Topbar = () => {
  const [Input, setInput] = useState<string>("");
  return (
    <div className="flex items-center justify-between gap-4 bg-black p-2">
      {/* left   */}
      <div className="flex items-center gap-4 bg-black p-2">
        <MenuIcon className="text-white" />
        <h1 className="text-2xl font-bold text-white">Streamify</h1>
        <input
          type="text"
          placeholder="Search..."
          className="ml-2 w-lg rounded-3xl border border-gray-600 bg-gray-800 p-2 pl-2 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={Input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>

      {/* right  */}

      <div className="flex items-center gap-4 bg-black p-2 text-white">
        <button className="cursor-pointer">Login/Signup</button>
        <Image
          src="https://static.vecteezy.com/system/resources/previews/006/732/119/non_2x/account-icon-sign-symbol-logo-design-free-vector.jpg"
          alt="User"
          width={32}
          height={32}
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Topbar;
