"use client";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("sabir2014852@gmail.com");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Go directly to the welcome page
    window.location.href = "/welcome";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[850px] min-h-[550px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-[20px] flex flex-col box-border">
        
        {/* Title Bar */}
        <div className="flex justify-between items-center mb-[10px]">
          <div className="w-[30px]"></div>
          <h1 className="text-[#6b4c9a] text-[34px] font-bold flex items-center justify-center gap-3 flex-1">
            <span className="text-[42px] bg-gradient-to-br from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">◑</span>
            TypingMaster Pro
          </h1>
          <button className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[28px] h-[28px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 gap-[15px] pt-[10px]">
          
          {/* Left Form */}
          <div className="flex-[1.6] bg-[#eaffd0] border-t border-[#d0e8b0] p-[20px_30px] flex flex-col border-r border-[#c2e59c]">
            <h2 className="text-[28px] text-black font-semibold mb-[25px] mt-[10px]">Welcome to TypingMaster</h2>
            
            <form onSubmit={handleLogin} className="flex flex-col flex-1">
              
              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[18px]">Enter your Email</label>
              </div>
              <input
                type="email"
                className="w-[90%] p-1.5 border-2 border-[#5b9bd5] bg-white text-black text-[18px] font-semibold outline-none mb-[15px] box-border"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <div className="flex items-center gap-2.5 mb-2">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[18px]">Enter your Password</label>
              </div>
              <input
                type="password"
                className="w-[90%] p-1.5 border-2 border-[#5b9bd5] bg-white text-black text-[18px] font-semibold outline-none mb-[5px] box-border"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="mt-auto flex justify-end w-[90%] pt-[20px]">
                <button type="submit" className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-1.5 px-10 text-[18px] font-bold text-black cursor-pointer shadow-sm">
                  Enter
                </button>
              </div>
            </form>
          </div>

          {/* Right Info */}
          <div className="flex-1 pt-[20px] pr-[10px] text-black">
            <h3 className="font-bold text-[18px] mb-2 flex items-center gap-1.5">
              <span>🛡️</span> Trial Version
            </h3>
            <p className="text-[15px] leading-[1.3] font-medium m-0">
              You can complete the first two lessons of the Touch Typing course with this limited trial version. Get access to the rest of the lessons in minutes - just buy the full version online!
            </p>

            <div className="mt-[30px] flex flex-col gap-[10px]">
              <button type="button" className="bg-gradient-to-b from-[#f4fbe8] to-[#d8ecc4] border-2 border-[#a4c263] rounded-[5px] py-1.5 px-2.5 text-left font-bold text-[#4a69bd] text-[15px] cursor-pointer flex items-center gap-2">
                <span className="text-black text-[12px]">▶</span> More information
              </button>
              <button type="button" className="bg-gradient-to-b from-[#f4fbe8] to-[#d8ecc4] border-2 border-[#a4c263] rounded-[5px] py-1.5 px-2.5 text-left font-bold text-[#4a69bd] text-[15px] cursor-pointer flex items-center gap-2">
                <span className="text-black text-[12px]">▶</span> Enter license...
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}