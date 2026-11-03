"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const timeUsed = parseInt(searchParams.get("timeUsed") || "0");
  const grossWpm = searchParams.get("gross") || "0";
  const accuracy = parseInt(searchParams.get("accuracy") || "0");
  const netWpm = searchParams.get("net") || "0";

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s.toString().padStart(2, "0")} min.`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      <div className="w-full max-w-[850px] min-h-[550px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex flex-col relative overflow-hidden box-border">
        
        <div className="flex justify-between items-center p-6 pb-2">
          <h1 className="text-[34px] text-[#4a6a1f] font-normal m-0">Typing Test Results</h1>
          <button onClick={() => router.push('/typing')} className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[28px] h-[28px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
        </div>

        <div className="flex flex-1">
          <div className="flex-[1.6] p-6 flex flex-col">
            <div className="mb-6">
              <h2 className="text-[20px] font-bold text-black m-0">Test Completed</h2>
              <p className="text-[15px] text-black m-0 leading-[1.3] mt-1">
                Here are your performance scores. {accuracy >= 92 ? "Great job, you passed!" : "Keep practicing to reach 92% accuracy."}
              </p>
            </div>

            <hr className="border-[#c2e59c] my-2" />

            <div className="flex flex-col gap-3 my-4">
              <div className="flex">
                <span className="w-[140px] font-bold text-black text-[16px]">Time Used</span>
                <span className="text-black text-[16px]">{formatTime(timeUsed)}</span>
              </div>
              <div className="flex">
                <span className="w-[140px] font-bold text-black text-[16px]">Gross Speed</span>
                <span className="text-black text-[16px]">{grossWpm} wpm</span>
              </div>
              <div className="flex">
                <span className="w-[140px] font-bold text-black text-[16px]">Accuracy</span>
                <span className={`text-[16px] font-bold ${accuracy >= 92 ? "text-green-600" : "text-red-600"}`}>
                  {accuracy}%
                </span>
              </div>
              <div className="flex">
                <span className="w-[140px] font-bold text-black text-[16px]">Net Speed</span>
                <span className="text-black text-[16px]">{netWpm} wpm</span>
              </div>
            </div>

            <hr className="border-[#c2e59c] my-2" />

            {/* 👇 Buttons removed from here */}
            <div className="mt-auto flex flex-col gap-2 pt-4 w-[300px]">
            </div>
          </div>

          <div className="flex-1 bg-[#b5df8e] p-6 flex flex-col justify-end items-end relative border-l-2 border-[#c2e59c]">
            <div className="flex flex-col gap-3 w-full max-w-[200px]">
              <button onClick={() => router.push('/typing')} className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-2 text-[16px] font-bold text-[#4a69bd] cursor-pointer shadow-sm hover:from-gray-100">
                OK
              </button>
              <button className="bg-gradient-to-b from-[#f4fbe8] to-[#d8ecc4] border-2 border-[#a4c263] rounded-[5px] py-2 text-[16px] font-bold text-[#a4c263] cursor-not-allowed opacity-60" disabled>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResultScreen() {
  return (
    <Suspense fallback={<div className="text-white text-2xl min-h-screen flex items-center justify-center">Loading Results...</div>}>
      <ResultContent />
    </Suspense>
  );
}