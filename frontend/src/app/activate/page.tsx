"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivateScreen() {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Password rules: 8 chars, 1 uppercase, 1 special char
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pwdRegex.test(password)) {
      setError("Password must be 8+ chars, include 1 uppercase and 1 special character.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // On success, go to typing page
    router.push(`/typing`);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #a8c0ff 0%, #8ca6f8 50%, #3f2b96 100%)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: "20px",
      margin: 0
    }}>
      <div style={{
        background: "linear-gradient(to bottom, #e6f9cc, #d4f0b0)",
        border: "5px solid #6b4c9a",
        borderRadius: "25px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.4)",
        width: "100%",
        maxWidth: "600px",
        minHeight: "500px",
        padding: "25px",
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box"
      }}>
        
        {/* Top Bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ width: "30px" }}></div>
          <h1 style={{ color: "#6b4c9a", fontSize: "28px", fontWeight: "bold", display: "flex", alignItems: "center", gap: "10px", margin: 0, flex: 1, justifyContent: "center" }}>
            <span style={{ fontSize: "32px", background: "linear-gradient(to bottom right, #a855f7, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>◑</span>
            TypingMaster Pro
          </h1>
          <button onClick={() => router.push('/')} style={{ backgroundColor: "#a4c263", border: "1px solid #7d9b3d", color: "white", fontWeight: "bold", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "3px", cursor: "pointer" }}>✕</button>
        </div>

        {/* Content */}
        <div style={{ display: "flex", flex: 1, gap: "20px" }}>
          <div style={{ flex: 1, background: "#eaffd0", borderTop: "1px solid #d0e8b0", padding: "30px", display: "flex", flexDirection: "column", borderRadius: "10px" }}>
            <h2 style={{ fontSize: "24px", color: "#000", fontWeight: 600, marginBottom: "25px", textAlign: "center" }}>Activate & Setup Password</h2>
            
            <form onSubmit={handleActivate} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              
              {/* OTP Field */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ backgroundColor: "#4a86e8", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>➔</div>
                <label style={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}>OTP from Gmail</label>
              </div>
              <input
                type="text"
                style={{ width: "100%", padding: "8px", border: "2px solid #5b9bd5", background: "#fff", color: "#000", fontSize: "16px", fontWeight: 600, outline: "none", marginBottom: "15px", boxSizing: "border-box" }}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="e.g. 123456"
                required
              />

              {/* Password Field */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ backgroundColor: "#4a86e8", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>➔</div>
                <label style={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}>New Password</label>
              </div>
              <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%", padding: "8px 35px 8px 10px", border: "2px solid #5b9bd5", background: "#fff", color: "#000", fontSize: "16px", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#666" }}
                >
                  👁
                </button>
              </div>

              {/* Confirm Password */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <div style={{ backgroundColor: "#4a86e8", color: "white", borderRadius: "50%", width: "20px", height: "20px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "bold" }}>➔</div>
                <label style={{ fontWeight: "bold", color: "#000", fontSize: "16px" }}>Confirm Password</label>
              </div>
              <div style={{ position: "relative", width: "100%", marginBottom: "15px" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%", padding: "8px 35px 8px 10px", border: "2px solid #5b9bd5", background: "#fff", color: "#000", fontSize: "16px", fontWeight: 600, outline: "none", boxSizing: "border-box" }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
              
              {error && <div style={{ color: "#d32f2f", fontSize: "13px", marginBottom: "15px", fontWeight: "bold", background: "#ffe6e6", padding: "10px", borderRadius: "4px", border: "1px solid #ffcccc", textAlign: "center" }}>{error}</div>}

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "center", paddingTop: "20px" }}>
                <button type="submit" style={{ width: "100%", background: "linear-gradient(to bottom, #ffffff, #dce6f2)", border: "2px solid #8c9bb3", borderRadius: "5px", padding: "10px", fontSize: "18px", fontWeight: "bold", color: "#000", cursor: "pointer" }}>
                  Activate
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}