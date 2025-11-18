"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ChatBox from "../../components/ChatBox";

export default function ChatPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/");
  }, [router]);

  return (
    <div className="pt-4">
      <ChatBox />
    </div>
  );
}
