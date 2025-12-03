import "./App.css";
import { useState } from "react";
import useAuthStore from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import StudyListPage from "./pages/StudyListPage";

function App() {
  const token = useAuthStore((state) => state.token) || null;
  const [isSignUp, setIsSignUp] = useState(false);

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
