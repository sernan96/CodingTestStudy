import { create } from "zustand";

const useAuthStore = create((set) => ({
  token: localStorage.getItem("token") || null,

  setToken: (token) => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
    set({ token });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  }, // logout 함수는 여기서 끝납니다.

  // clearToken은 logout 밖으로 나와야 합니다.
  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));

export default useAuthStore;
