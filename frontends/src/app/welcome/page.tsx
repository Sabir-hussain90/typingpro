"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const [name, setName] = useState("Sabir Hussain");
  const router = useRouter();

  const handleEnter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Save the name to localStorage
    localStorage.setItem("userName", name.trim());

    router.push("/typing");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[800px] min-h-[550px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] p-[25px] flex flex-col relative box-border">
        
        <div className="flex justify-between items-center mb-5">
          <div className="w-[30px]"></div>
          <h1 className="text-[#6b4c9a] text-[32px] font-bold flex items-center justify-center gap-2.5 flex-1">
            <span className="text-[40px] bg-gradient-to-br from-[#a855f7] to-[#ec4899] bg-clip-text text-transparent">◑</span>
            TypingMaster Pro
          </h1>
          <button onClick={() => router.push("/")} className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[30px] h-[30px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
        </div>

        <div className="flex flex-1 gap-5">
          <div className="flex-1 bg-[#eaffd0] border-t border-[#d0e8b0] p-[30px] flex flex-col rounded-[10px]">
            <h2 className="text-[28px] text-black font-semibold mb-[30px]">Welcome to TypingMaster</h2>
            
            <form onSubmit={handleEnter} className="flex flex-col flex-1">
              <div className="flex items-center gap-2.5 mb-2.5">
                <div className="bg-[#4a86e8] text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] font-bold">➔</div>
                <label className="font-bold text-black text-[18px]">Enter your name</label>
              </div>
              
              <input
                type="text"
                className="w-[90%] p-2 border-2 border-[#5b9bd5] bg-white text-black text-[18px] font-semibold outline-none mb-1 box-border"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Type your name here..."
                required
              />
              
              <div className="w-[90%] h-[150px] border-2 border-[#5b9bd5] bg-white overflow-y-auto mb-[15px] box-border">
                <div className="p-2 text-[18px] text-black border-b border-gray-100">{name || "Type your name above..."}</div>
              </div>

              {/* 👇 Button completely removed from here */}

              <div className="mt-auto flex justify-end w-[90%] pt-5">
                <button type="submit" className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-2 px-10 text-[18px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100">
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}