"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Paragraph {
  id: string;
  title: string;
}

interface HistoryItem {
  id: string;
  wpm: number;
  netWpm: number;
  accuracy: number;
  createdAt: string;
  paragraph: { title: string };
  user?: { email: string }; // 👈 Added to show who took the test
}

export default function TypingSelectionPage() {
  const [mounted, setMounted] = useState(false);
  const [paragraphs, setParagraphs] = useState<Paragraph[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedParaId, setSelectedParaId] = useState("");
  const [duration, setDuration] = useState("2");
  const [loading, setLoading] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  const router = useRouter();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    checkAdmin();
    fetchData();
  }, []);

  const checkAdmin = () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload.role === "admin") setIsAdmin(true);
      } catch (e) {}
    }
  };

  const fetchData = async () => {
    try {
      const paraRes = await api.get("/typing/paragraphs");
      setParagraphs(paraRes.data);
      
      if (paraRes.data.length > 0 && !selectedParaId) {
        setSelectedParaId(paraRes.data[0].id);
      }

      try {
        const historyRes = await api.get("/users/history");
        setHistory(historyRes.data);
      } catch (historyErr) {
        setHistory([]);
      }
    } catch (err) {
      console.error("Failed to load data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    if (!selectedParaId) return alert("Please select a paragraph first.");
    router.push(`/test?id=${selectedParaId}&time=${duration}`);
  };

  const handleAddParagraph = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAdding(true);
    try {
      await api.post("/typing/paragraphs/add", { title: newTitle, content: newContent });
      setNewTitle("");
      setNewContent("");
      setShowAddForm(false);
      fetchData();
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add paragraph.");
    } finally {
      setAdding(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (paragraphs.length === 0) return;
    const currentIndex = paragraphs.findIndex(p => p.id === selectedParaId);

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % paragraphs.length;
      setSelectedParaId(paragraphs[nextIndex].id);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + paragraphs.length) % paragraphs.length;
      setSelectedParaId(paragraphs[prevIndex].id);
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleStartTest();
    }
  };

  useEffect(() => {
    if (selectedParaId && listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-id="${selectedParaId}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedParaId]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#a8c0ff] via-[#8ca6f8] to-[#3f2b96] p-5 font-sans">
      
      <div 
        className="flex w-full max-w-[1070px] min-h-[550px] bg-[#d4f0b0] border-[5px] border-[#6b4c9a] rounded-[25px] shadow-[0_10px_40px_rgba(0,0,0,0.4)] overflow-hidden box-border"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        
        <div className="flex-1 flex flex-col p-6 relative">
          
          <div className="flex justify-between items-center mb-6 border-b-2 border-[#c2e59c] pb-2">
            <h1 className="text-[32px] text-[#4a6a1f] font-normal m-0">Typing Test</h1>
            {isAdmin && <span className="bg-[#6b4c9a] text-white px-3 py-1 rounded text-sm font-bold">Admin Mode</span>}
          </div>

          <div className="flex flex-col flex-1">
            
            <div className="flex gap-4 mb-4">
              <div className="text-[50px] text-[#b5df8e] font-bold italic leading-none select-none">1</div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-[18px] font-bold text-black m-0">Test Text</h2>
                  {isAdmin && (
                    <button onClick={() => setShowAddForm(!showAddForm)} className="text-[#4a69bd] font-bold text-[14px] hover:underline cursor-pointer bg-transparent border-none">
                      {showAddForm ? "✖ Cancel" : "▶ Add"}
                    </button>
                  )}
                </div>

                {showAddForm && isAdmin && (
                  <div className="bg-white p-4 border-2 border-[#5b9bd5] mb-4 rounded shadow-sm">
                    <h3 className="font-bold text-[16px] mb-2 text-black">Add New Paragraph</h3>
                    <form onSubmit={handleAddParagraph} className="flex flex-col gap-2">
                      <input type="text" placeholder="Title" className="p-2 border border-gray-300 rounded text-black text-sm" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required />
                      <textarea placeholder="Paste the paragraph here..." className="p-2 border border-gray-300 rounded text-black text-sm h-[100px] resize-none" value={newContent} onChange={(e) => setNewContent(e.target.value)} required />
                      {addError && <p className="text-red-500 text-xs font-bold">{addError}</p>}
                      <button type="submit" disabled={adding} className="bg-[#a4c263] text-white font-bold py-1 px-4 rounded text-sm disabled:opacity-50">
                        {adding ? "Saving..." : "Save to Database"}
                      </button>
                    </form>
                  </div>
                )}
                
                <div 
                  ref={listRef}
                  className="w-full h-[160px] border-2 border-[#5b9bd5] bg-white overflow-y-auto outline-none custom-scrollbar"
                >
                  {loading ? (
                    <div className="p-2 text-gray-500 italic">Loading...</div>
                  ) : paragraphs.length === 0 ? (
                    <div className="p-2 text-red-500 italic">No paragraphs found.</div>
                  ) : (
                    paragraphs.map((para, index) => (
                      <div 
                        key={para.id} 
                        data-id={para.id}
                        onClick={() => setSelectedParaId(para.id)} 
                        className={`px-2 py-1 text-[16px] cursor-pointer select-none ${
                          selectedParaId === para.id ? "bg-[#000080] text-white" : "text-black hover:bg-gray-100"
                        }`}
                      >
                        {index + 1}. {para.title}
                      </div>
                    ))
                  )}
                </div>
                <div className="text-[14px] text-[#555] mt-1 pl-2 truncate">
                  {paragraphs.find(p => p.id === selectedParaId)?.title || "Select a paragraph"}
                </div>
              </div>
            </div>

            <div className="flex items-end gap-6 mb-6 mt-2">
              <div className="flex gap-4">
                <div className="text-[50px] text-[#b5df8e] font-bold italic leading-none select-none">2</div>
                <div>
                  <h2 className="text-[18px] font-bold text-black mb-1">Duration</h2>
                  <select className="w-[150px] p-1.5 border-2 border-[#5b9bd5] bg-white text-black text-[16px] outline-none" value={duration} onChange={(e) => setDuration(e.target.value)}>
                    <option value="1">1 min.</option>
                    <option value="2">2 min.</option>
                    <option value="3">3 min.</option>
                    <option value="5">5 min.</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="text-[50px] text-[#b5df8e] font-bold italic leading-none select-none">3</div>
                <button onClick={handleStartTest} disabled={loading || paragraphs.length === 0} className="bg-gradient-to-b from-white to-[#dce6f2] border-2 border-[#8c9bb3] rounded-[5px] py-1.5 px-8 text-[16px] font-bold text-black cursor-pointer shadow-sm hover:from-gray-100 disabled:opacity-50">
                  Start test
                </button>
              </div>
            </div>

            {/* 👇 Completed Tests Box with ALL tests */}
            <div className="bg-[#d4f0b0] border-t-2 border-[#c2e59c] -mx-6 -mb-6 p-4 mt-auto">
              <h3 className="text-[16px] font-bold text-black mb-2 m-0">Completed Tests (All Users)</h3>
              <div className="flex gap-4">
                <div className="w-full h-[100px] border-2 border-[#5b9bd5] bg-white overflow-y-auto">
                  {history.length === 0 ? (
                    <div className="p-2 text-gray-500 italic">No tests completed yet.</div>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="flex border-b border-gray-200 text-black text-[14px]">
                        <div className="w-[100px] px-2 py-1 border-r border-gray-200">
                          {formatDate(item.createdAt)}
                        </div>
                        <div className="px-2 py-1 truncate flex-1">
                          {/* 👇 Shows the user email if available */}
                          {item.user?.email ? `${item.user.email} - ` : ""}
                          {item.paragraph?.title || "Unknown"} 
                          <span className="font-bold ml-2 text-blue-700">
                            Net: {item.netWpm} WPM | {item.accuracy}%
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="w-[220px] bg-[#8b7bd8] flex flex-col p-4 gap-2 relative border-l-2 border-[#6b4c9a]">
          <div className="flex justify-end mb-2">
             <button onClick={() => router.push("/")} className="bg-[#a4c263] border border-[#7d9b3d] text-white font-bold w-[24px] h-[24px] flex items-center justify-center rounded-[3px] cursor-pointer">✕</button>
          </div>
          <button className="text-white text-left font-bold text-[16px] py-2 px-3 hover:bg-[#9d8fe5] rounded transition-colors flex items-center gap-2">
            <span>◀</span> Typing Test
          </button>
        </div>

      </div>
    </div>
  );
}