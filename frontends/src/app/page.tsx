"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { validatePassword } from "@/lib/validators";

export default function LoginPage() {
  const [email, setEmail] = useState("sabir2014852@gmail.com");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      
      if (res.data.requiresActivation) {
        router.push(`/activate?email=${encodeURIComponent(email)}`);
      } else {
        localStorage.setItem("token", res.data.access_token);
        router.push("/welcome"); 
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[600px] min-h-[500px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-[25px] flex flex-col box-border">
        
        {/* Title Bar */}
        <div className="flex justify-between items-center mb-[20px]">
          <div className="w-[28px]"></div>
          <h1 className="text-[#6b4c9a] text-[30px] font-bold flex items-center justify-center gap-2 flex-1">
            <span className="text-[36px] bg-gradient-to-br from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">◑</span>
            TypingMaster Pro
          </h1>
          <button className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[28px] h-[28px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
        </div>

        {/* Main Content (Now Full Width) */}
        <div className="flex-1 bg-[#eaffd0] p-[30px] flex flex-col rounded-[10px]">
          <h2 className="text-[26px] text-black font-semibold mb-[25px] text-center">Welcome to TypingMaster</h2>
          
          <form onSubmit={handleLogin} className="flex flex-col flex-1">
            
            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
              <label className="font-bold text-black text-[18px]">Enter your Email</label>
            </div>
            <input
              type="email"
              className="w-full p-2 border-2 border-[#5b9bd5] bg-white text-black text-[18px] font-semibold outline-none mb-[20px] box-border"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="flex items-center gap-2.5 mb-2">
              <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
              <label className="font-bold text-black text-[18px]">Enter your Password</label>
            </div>
            
            <div className="relative w-full mb-[10px]">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 pr-10 border-2 border-[#5b9bd5] bg-white text-black text-[18px] font-semibold outline-none box-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer bg-transparent border-none text-[20px]"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>

            <p className="text-[14px] text-gray-600 mb-4 w-full">
              Must be 10+ chars, 1 uppercase, 1 special character.
            </p>

            {error && <div className="text-red-600 text-sm font-bold mb-4 text-center bg-red-50 p-2 rounded">{error}</div>}

            <div className="mt-auto flex justify-between items-center w-full pt-[10px]">
              <button 
                type="button" 
                onClick={() => router.push("/forgot-password")}
                className="text-[#4a69bd] font-bold text-[15px] hover:underline cursor-pointer bg-transparent border-none"
              >
                Forgot Password?
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-2 px-12 text-[18px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100 disabled:opacity-50"
              >
                {loading ? "Loading..." : "Enter"}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}