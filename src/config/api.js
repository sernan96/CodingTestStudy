// ===================================================
// 프론트엔드 API 유틸리티 (환경설정 기반)
// ===================================================

import config from "../config/env";

/**
 * API 요청 유틸리티
 */
export const apiClient = {
  /**
   * GET 요청
   */
  get: async (endpoint, options = {}) => {
    const url = config.getApiUrl(endpoint);
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // 토큰이 있으면 인증 헤더 추가
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      Object.assign(headers, config.getAuthHeader(token));
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
        ...options,
      });

      return handleResponse(response);
    } catch (error) {
      throw new Error(`API 요청 실패: ${error.message}`);
    }
  },

  /**
   * POST 요청
   */
  post: async (endpoint, data = {}, options = {}) => {
    const url = config.getApiUrl(endpoint);
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // 토큰이 있으면 인증 헤더 추가
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      Object.assign(headers, config.getAuthHeader(token));
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
        ...options,
      });

      return handleResponse(response);
    } catch (error) {
      throw new Error(`API 요청 실패: ${error.message}`);
    }
  },

  /**
   * DELETE 요청
   */
  delete: async (endpoint, options = {}) => {
    const url = config.getApiUrl(endpoint);
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // 토큰이 있으면 인증 헤더 추가
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      Object.assign(headers, config.getAuthHeader(token));
    }

    try {
      const response = await fetch(url, {
        method: "DELETE",
        headers,
        ...options,
      });

      return handleResponse(response);
    } catch (error) {
      throw new Error(`API 요청 실패: ${error.message}`);
    }
  },
};

/**
 * 응답 처리 헬퍼
 */
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const error = new Error(
      errorData.message || `HTTP ${response.status} 오류`
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  return response.json();
};

/**
 * 인증 API
 */
export const authAPI = {
  login: (email, password) =>
    apiClient.post(config.api.endpoints.auth.login, {
      email,
      password,
    }),

  signup: (email, password, name) =>
    apiClient.post(config.api.endpoints.auth.signup, {
      email,
      password,
      name,
    }),
};

/**
 * 스터디 API
 */
export const studyAPI = {
  getList: () => apiClient.get(config.api.endpoints.study.list),

  getDetail: (studyId) =>
    apiClient.get(`${config.api.endpoints.study.detail}/${studyId}`),

  create: (name, maxMembers) =>
    apiClient.post(config.api.endpoints.study.create, {
      name,
      maxMembers,
    }),

  join: (joinCode) =>
    apiClient.post(config.api.endpoints.study.join, {
      joinCode,
    }),

  withdraw: (studyId) =>
    apiClient.delete(`${config.api.endpoints.study.withdraw}/${studyId}`),
};

/**
 * 문제 API
 */
export const problemAPI = {
  register: (studyId, platform, problemNumber, tier, level, targetDate) =>
    apiClient.post(config.api.endpoints.problem.register, {
      studyId,
      platform,
      problemNumber,
      tier,
      level,
      targetDate,
    }),

  useVacation: (studyId, targetDate) =>
    apiClient.post(config.api.endpoints.problem.vacationUse, {
      studyId,
      targetDate,
    }),
};
