"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Password validation (8 chars, 1 uppercase, 1 special char)
    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!pwdRegex.test(password)) {
      setError("Password must be 8+ chars, include 1 uppercase and 1 special character.");
      return;
    }

    setLoading(true);

    try {
      // Simulate backend connection and redirect to activation page
      setTimeout(() => {
        router.push(`/activate?email=${encodeURIComponent(email)}`);
      }, 1000);
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;700&display=swap');
          
          body {
            background: linear-gradient(135deg, #a8c0ff 0%, #3f2b96 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
          }

          .tm-window {
            background: linear-gradient(to bottom, #e6f9cc, #d4f0b0);
            border: 4px solid #6b4c9a;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            width: 100%;
            max-width: 420px; /* Made smaller */
            padding: 30px 25px;
            display: flex;
            flex-direction: column;
          }

          .tm-title {
            color: #6b4c9a;
            font-size: 26px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .tm-left {
            background: #ffffff;
            border-radius: 10px;
            padding: 25px;
            box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
          }

          .tm-heading {
            font-size: 20px;
            color: #333;
            margin-bottom: 20px;
            font-weight: 600;
            text-align: center;
          }

          .tm-label {
            font-weight: bold;
            color: #444;
            margin-bottom: 6px;
            display: block;
            font-size: 14px;
          }

          .tm-input {
            width: 100%;
            padding: 10px;
            border: 2px solid #5b9bd5;
            border-radius: 4px;
            font-size: 15px;
            margin-bottom: 15px;
            outline: none;
            box-sizing: border-box;
            transition: border-color 0.2s;
          }
          
          .tm-input:focus {
            border-color: #4a69bd;
          }

          .tm-btn {
            background: linear-gradient(to bottom, #a6c8ff, #789ce8);
            border: 2px solid #4a69bd;
            border-radius: 5px;
            padding: 10px 20px;
            font-size: 16px;
            font-weight: bold;
            color: white;
            cursor: pointer;
            transition: 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            width: 100%;
            margin-top: 10px;
          }

          .tm-btn:hover {
            background: linear-gradient(to bottom, #94b8ff, #668ce8);
          }
          
          .tm-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          .tm-error {
            color: #d32f2f;
            font-size: 13px;
            margin-bottom: 10px;
            font-weight: 500;
            text-align: center;
          }
          
          .tm-info {
            font-size: 13px;
            color: #666;
            margin-top: 5px;
            margin-bottom: 15px;
            text-align: center;
          }
          
          .tm-forgot {
            text-align: center;
            margin-top: 15px;
            font-size: 13px;
            color: #4a69bd;
            cursor: pointer;
          }
          
          .tm-forgot:hover {
            text-decoration: underline;
          }
        `}} />
      </head>
      <body>
        <div className="tm-window">
          <div className="tm-title">
            <span style={{ fontSize: "32px" }}>⌨️</span> TypingMaster Pro
          </div>

          <div className="tm-left">
            <h1 className="tm-heading">Login</h1>
            
            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column" }}>
              <label className="tm-label">Enter your Email</label>
              <input
                type="email"
                className="tm-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sabir@example.com"
                required
              />

              <label className="tm-label">Enter your Password</label>
              <input
                type="password"
                className="tm-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              
              {error && <div className="tm-error">{error}</div>}

              <div className="tm-info">
                New user? Log in to receive an activation OTP via Gmail.
              </div>

              <button type="submit" className="tm-btn" disabled={loading}>
                {loading ? "Loading..." : "Enter"}
              </button>
              
              <div 
                className="tm-forgot"
                onClick={() => router.push('/forgot-password')}
              >
                Forgot password?
              </div>
            </form>
          </div>
        </div>
      </body>
    </html>
  );
}