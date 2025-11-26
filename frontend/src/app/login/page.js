"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "../../utils/api";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
 
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    
    e.preventDefault();
    setError("");
    console.log("BASE URL:", process.env.NEXT_PUBLIC_API_URL);

    console.log("data email and password" , email ,password)
    console.log("apiRequest" , apiRequest)
    try {
      const res = await apiRequest("/auth/login", "POST", { email, password });
      localStorage.setItem("token", res.token);
      router.push("/conversations");
    } catch (err) {
      setError("Invalid credentials, please try again.");
    }
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
          Welcome Back 
        </h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded-lg"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}

        <p className="text-sm text-gray-500 mt-5 text-center">
          Don’t have an account?{" "}
          <a href="signup" className="text-indigo-600 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
