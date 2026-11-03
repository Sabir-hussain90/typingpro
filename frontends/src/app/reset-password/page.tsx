"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Get email from URL query string
  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) setEmail(emailParam);
  }, [searchParams]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // 1. Validate Password
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/;
    if (!pwdRegex.test(password)) {
      setError("Password must be 10+ chars, include 1 uppercase and 1 special character.");
      return;
    }

    // 2. Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", { 
        email, 
        otp, 
        newPassword: password 
      });

      alert("Password reset successfully! Please login.");
      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Reset failed. Check your OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[600px] min-h-[550px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-[25px] flex flex-col relative box-border">
        
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
            <h2 className="text-[24px] text-black font-semibold mb-[20px] text-center">Reset Password</h2>
            
            <form onSubmit={handleReset} className="flex flex-col flex-1">
              
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[16px]">Email</label>
              </div>
              <input
                type="email"
                className="w-full p-2 border-2 border-[#5b9bd5] bg-gray-100 text-gray-600 text-[16px] font-semibold outline-none mb-3 box-border cursor-not-allowed"
                value={email}
                readOnly
              />

              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[16px]">Enter OTP</label>
              </div>
              <input
                type="text"
                className="w-full p-2 border-2 border-[#5b9bd5] bg-white text-black text-[16px] font-semibold outline-none mb-3 box-border"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                required
              />

              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[16px]">New Password</label>
              </div>
              <div className="relative w-full mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 pr-10 border-2 border-[#5b9bd5] bg-white text-black text-[16px] font-semibold outline-none box-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer bg-transparent border-none text-[16px]"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>

              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[16px]">Confirm Password</label>
              </div>
              <div className="relative w-full mb-3">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 pr-10 border-2 border-[#5b9bd5] bg-white text-black text-[16px] font-semibold outline-none box-border"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                />
              </div>

              <p className="text-[13px] text-gray-600 mb-2">
                Must be 10+ chars, 1 uppercase, 1 special character.
              </p>

              {error && <div className="text-red-600 text-sm font-bold mb-2 text-center bg-red-50 p-2 rounded">{error}</div>}

              <div className="mt-auto flex justify-center pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-2.5 text-[18px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100 disabled:opacity-50"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="text-white text-2xl min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}