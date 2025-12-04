import React, { useState } from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../store/authStore";
import config from "../config/env";

function SignUpPage({ onSwitchToLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const setToken = useAuthStore((state) => state.setToken);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // 유효성 검사
    if (!email || !password || !passwordConfirm || !name) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const url = config.getApiUrl(config.api.endpoints.auth.signup);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        alert("회원가입이 완료되었습니다!");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <img src={logo} className="page-logo" alt="logo" />
      <div className="login-container">
        <h1>회원가입</h1>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "회원가입 중..." : "회원가입"}
          </button>
        </form>
        <div className="auth-switch">
          <span>이미 계정이 있으신가요?</span>
          <button
            type="button"
            className="switch-button"
            onClick={onSwitchToLogin}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
