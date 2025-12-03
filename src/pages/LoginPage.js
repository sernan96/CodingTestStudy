import React, { useState } from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../store/authStore";

function LoginPage({ onSwitchToSignUp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // API 호출 (필요에 따라 URL 수정)
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src={logo} className="page-logo" alt="logo" />
      <div className="login-container">
        <h1>로그인</h1>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
        <div className="auth-switch">
          <span>혹시 계정없냐?</span>
          <button
            type="button"
            className="switch-button"
            onClick={onSwitchToSignUp}
          >
            회원가입
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
