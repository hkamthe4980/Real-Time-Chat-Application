
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const navLink = (path, label) => {
    const isActive = pathname === path;
    return (
      <Link
        href={path}
        className={`px-3 py-2 rounded-md font-medium transition ${
          isActive ? "text-indigo-600 bg-indigo-50" : "text-gray-700 hover:text-indigo-600"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <nav className="bg-white shadow-sm py-3 px-6 flex justify-between items-center fixed top-0 w-full z-10">
      <h1
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => router.push("/chat")}
      >
        LLM Assistant 
      </h1>

      <div className="flex space-x-6 items-center">
        {isLoggedIn && (
          <>
            {navLink("/chat", "Chat")}
            {navLink("/analytics", "Analytics")}
          
          </>
        )}

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}

