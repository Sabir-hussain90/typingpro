"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function TypingTestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paragraphId = searchParams.get("id");
  const durationParam = searchParams.get("time") || "2";
  const initialTime = parseInt(durationParam) * 60;
  
  const [targetText, setTargetText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [fullTypedText, setFullTypedText] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const currentWordRef = useRef<HTMLSpanElement>(null);
  const typingBoxRef = useRef<HTMLDivElement>(null);

  // Fetch Paragraph
  useEffect(() => {
    const fetchParagraph = async () => {
      if (!paragraphId) {
        setError("No paragraph selected.");
        setLoading(false);
        return;
      }
      try {
        const res = await api.get(`/typing/paragraphs/${paragraphId}`);
        setTargetText(res.data.content);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load paragraph.");
      } finally {
        setLoading(false);
      }
    };
    fetchParagraph();
  }, [paragraphId]);

  const targetWords = targetText.split(" ");

  useEffect(() => {
    if (inputRef.current && !loading) inputRef.current.focus();
  }, [loading]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      calculateAndFinish();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  // Auto-scroll top text
  useEffect(() => {
    if (currentWordRef.current) {
      currentWordRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [typedText]);

  // Auto-scroll bottom typing box
  useEffect(() => {
    if (typingBoxRef.current) {
      typingBoxRef.current.scrollTop = typingBoxRef.current.scrollHeight;
    }
  }, [typedText]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // 👇 Handle Typing and Loop the Paragraph
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isRunning) setIsRunning(true);
    const newVal = e.target.value;
    
    // If the typed text is longer than the target text, add it to fullTypedText and reset
    if (newVal.length > targetText.length) {
      setFullTypedText((prev) => prev + " " + newVal.substring(0, targetText.length)); 
      setTypedText(newVal.substring(targetText.length)); 
    } else {
      setTypedText(newVal);
    }
  };

  const calculateAndFinish = async () => {
    const timeElapsed = Math.max(initialTime - timeLeft, 1);
    const finalTypedText = fullTypedText + " " + typedText;

    try {
      if (paragraphId) {
        const res = await api.post("/typing/submit", {
          typedText: finalTypedText.trim(), 
          timeElapsedSeconds: timeElapsed,
          paragraphId: paragraphId,
        });

        const { result } = res.data;
        router.push(`/result?timeUsed=${timeElapsed}&gross=${result.grossWpm}&accuracy=${result.accuracy}&net=${result.netWpm}&passed=${result.passed}`);
        return;
      }
    } catch (err: any) {
      console.error("Failed to save result", err.response?.data || err.message);
    }

    router.push(`/result?timeUsed=${timeElapsed}&gross=0&accuracy=0&net=0&passed=false`);
  };

  if (loading) return <div className="text-white text-2xl min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-2xl min-h-screen flex items-center justify-center">{error}</div>;

  const currentTypedWords = typedText.split(" ");
  const currentWordIndex = currentTypedWords.length - 1;
  const progress = Math.max(0, Math.min(100, ((initialTime - timeLeft) / initialTime) * 100));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      
      <input
        ref={inputRef}
        type="text"
        value={typedText}
        onChange={handleTyping}
        className="absolute opacity-0 w-0 h-0"
        spellCheck="false"
      />

      <div 
        className="w-full max-w-[950px] h-[550px] bg-gradient-to-b from-[#e6f9cc] to-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] flex overflow-hidden box-border cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        
        <div className="flex-1 p-6 flex flex-col relative bg-[#eaffd0]">
          
          <div className="h-[280px] bg-white rounded-lg border-2 border-[#c2e59c] shadow-inner relative overflow-hidden flex flex-col mb-4">
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              <div className="text-[20px] leading-[1.6] font-serif flex flex-wrap gap-x-2 gap-y-1 pb-24">
                {targetWords.map((word, index) => {
                  let wordClass = "text-[#555]"; 
                  let isCurrent = false;

                  if (index < currentWordIndex) {
                    if (currentTypedWords[index].toLowerCase() === word.toLowerCase()) {
                      wordClass = "text-green-600";
                    } else {
                      wordClass = "text-red-500 bg-red-50";
                    }
                  } else if (index === currentWordIndex) {
                    wordClass = "bg-[#a6c8ff] text-black px-1 rounded-sm shadow-sm";
                    isCurrent = true;
                  }

                  return (
                    <span key={index} ref={isCurrent ? currentWordRef : null} className={wordClass}>
                      {word}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="h-[2px] bg-[#c2e59c] w-full"></div>
          </div>

          <div className="mt-auto border-t-2 border-[#c2e59c] pt-2">
            <div 
              ref={typingBoxRef}
              className="w-full h-[120px] bg-white rounded-lg border-2 border-[#c2e59c] p-4 shadow-sm overflow-y-auto custom-scrollbar"
            >
              {!typedText ? (
                <div className="text-[#7d9b3d] flex items-center gap-2 opacity-80 text-[18px]">
                  <span className="w-5 h-5 bg-[#a4c263] text-white rounded-full flex items-center justify-center text-[10px]">▶</span>
                  Type the above text here
                </div>
              ) : (
                 <div className="text-[18px] font-serif text-black w-full break-words leading-[1.6]">
                   {typedText}
                   <span className="animate-pulse border-l-2 border-black ml-0.5"></span>
                 </div>
              )}
            </div>
          </div>

        </div>

        <div className="w-[220px] bg-[#b5df8e] border-l-2 border-[#6b4c9a] flex flex-col p-6 relative">
          <button onClick={(e) => { e.stopPropagation(); router.push('/typing'); }} className="absolute top-3 right-3 bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[26px] h-[26px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
          
          <div className="mt-8">
            <h3 className="text-[18px] font-bold text-black m-0 mb-1">Time</h3>
            <div className="text-[36px] font-bold text-black font-mono">{formatTime(timeLeft)}</div>
          </div>

          <div className="flex justify-center mt-6 mb-auto">
            <div className="relative w-[100px] h-[70px] rounded-[50%] border-2 border-[#a4c263] bg-[#eaffd0] overflow-hidden">
               <div className="absolute bottom-0 left-0 w-full bg-[#4a6a1f] transition-all duration-1000 ease-linear" style={{ height: `${progress}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={(e) => { e.stopPropagation(); calculateAndFinish(); }} className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-1.5 text-[16px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100">Next</button>
            <button onClick={(e) => { e.stopPropagation(); router.push('/typing'); }} className="bg-gradient-to-b from-[#f4fbe8] to-[#d8ecc4] border-2 border-[#a4c263] rounded-[5px] py-1.5 text-[16px] font-bold text-[#4a69bd] cursor-pointer shadow-sm hover:from-[#e8f5d6]">Cancel</button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function LiveTypingTest() {
  return (
    <Suspense fallback={<div className="text-white text-2xl min-h-screen flex items-center justify-center">Loading...</div>}>
      <TypingTestContent />
    </Suspense>
  );
}