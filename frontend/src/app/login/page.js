
//* vaish
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../utils/api";
import Link from "next/link";
import Image from "next/image";


export default function LoginPage() {
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {

    e.preventDefault();
    setError("");
    console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);

    console.log("data email and password", email, password)
    console.log("apiRequest", apiRequest)
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      // router.push("/mobile");
      router.push("/conversations");
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };
  return (
    <div className="min-h-screen w-full bg-gray-200 flex items-center justify-center">

      {/* Main Card */}
      <div className="h-screen w-full max-w-sm bg-white shadow-xl flex flex-col overflow-hidden">

        {/* TOP SECTION */}
        <div className="flex-[1.8] bg-black flex flex-col items-center justify-center relative">

          <Image
            // src="/image_logo.png"
            src="/logo.jpeg"
            alt="Logo"
            width={80}
            height={80}
            className="rounded-full shadow-md object-contain"
          />

          <h1 className="text-white text-xl font-semibold mt-3">Welcome Back</h1>

          <div className="absolute bottom-0 left-0 w-full h-12 bg-white rounded-t-[100%]"></div>
        </div>


        {/* FORM SECTION */}
        <div className="flex-[2] px-6 pt-14 pb-8 bg-white">

          <form onSubmit={handleLogin} className="space-y-5 w-full">

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-600 outline-none dark:text-black"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-gray-600 outline-none dark:text-black"
              required
            />

            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-full shadow-md hover:bg-gray-700 transition"
            >
              Login
            </button>
          </form>

          {error && (
            <p className="text-red-500 mt-4 text-center text-sm">{error}</p>
          )}

          <p className="text-sm text-black mt-6 text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-gray-600 font-medium hover:text-gray-900">
              Sign up
            </a>
          </p>

        </div>
      </div>
    </div>
  );
}
