"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setMessage("OTP sent to your Gmail! Redirecting...");
      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[600px] min-h-[450px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-[25px] flex flex-col relative box-border">
        
        <div className="flex justify-between items-center mb-5">
          <div className="w-[30px]"></div>
          <h1 className="text-[#6b4c9a] text-[28px] font-bold flex items-center justify-center gap-2.5 flex-1">
            <span className="text-[32px] bg-gradient-to-br from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">◑</span>
            TypingMaster Pro
          </h1>
          <button onClick={() => router.push("/")} className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[28px] h-[28px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
        </div>

        <div className="flex flex-1 gap-5">
          <div className="flex-1 bg-[#eaffd0] p-[30px] flex flex-col rounded-[10px]">
            <h2 className="text-[24px] text-black font-semibold mb-[20px] text-center">Forgot Password?</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[16px]">Enter your Email</label>
              </div>
              
              <input
                type="email"
                className="w-full p-2 border-2 border-[#5b9bd5] bg-white text-black text-[16px] font-semibold outline-none mb-4 box-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sabir@example.com"
                required
              />

              {error && <div className="text-red-600 text-sm font-bold mb-2 text-center bg-red-50 p-2 rounded">{error}</div>}
              {message && <div className="text-green-600 text-sm font-bold mb-2 text-center bg-green-50 p-2 rounded">{message}</div>}

              <div className="mt-auto flex justify-center pt-5">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-2 text-[18px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Reset OTP"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}