import logo from "./assets/logo.png";
import "./App.css";
import useAuthStore from "./store/authStore";
import LoginPage from "./pages/LoginPage";
import StudyListPage from "./pages/StudyListPage";

function App() {
  const token = useAuthStore((state) => state.token);

  return <div className="App">{token ? <StudyListPage /> : <LoginPage />}</div>;
}

export default App;
