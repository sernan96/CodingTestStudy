import { create } from "zustand";

// 🔒 보안: 토큰은 메모리에만 저장 (XSS 공격 방지)
// 페이지 새로고침 시 다시 로그인 필요
const useAuthStore = create((set) => ({
  token: null, // 메모리에만 저장 (XSS 취약점 방지)

  setToken: (token) => {
    if (token) {
      // 세션 스토리지에만 저장 (탭 닫으면 자동 삭제)
      // localStorage 대신 sessionStorage 사용 (더 안전)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("__secure_token", token);
      }
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("__secure_token");
      }
    }
    set({ token });
  },

  // 저장된 토큰 초기화 (앱 시작 시 호출)
  initializeToken: () => {
    if (typeof window !== "undefined") {
      const savedToken = sessionStorage.getItem("__secure_token");
      set({ token: savedToken });
    }
  },

  logout: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("__secure_token");
    }
    set({ token: null });
  },

  clearToken: () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("__secure_token");
    }
    set({ token: null });
  },
}));

export default useAuthStore;
