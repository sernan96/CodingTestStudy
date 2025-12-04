import "./App.css";
import { useState, useEffect } from "react";
import useAuthStore from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import { StudyListPage } from "./pages/StudyListPage";

function App() {
  const token = useAuthStore((state) => state.token);
  const initializeToken = useAuthStore((state) => state.initializeToken);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 앱 시작 시 저장된 토큰 복원
  useEffect(() => {
    initializeToken();
    setIsInitialized(true);
  }, [initializeToken]);

  if (!isInitialized) {
    return null; // 초기화 중
  }

  if (token) {
    return (
      <div className="App">
        <StudyListPage />
      </div>
    );
  }

  return (
    <div className="App">
      {isSignUp ? (
        <SignUpPage onSwitchToLogin={() => setIsSignUp(false)} />
      ) : (
        <LoginPage onSwitchToSignUp={() => setIsSignUp(true)} />
      )}
    </div>
  );
}

export default App;
