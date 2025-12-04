// ===================================================
// 프론트엔드 환경설정 관리 파일
// ===================================================

// 환경변수 접근 함수 (REACT_APP_ 접두사 자동 처리)
const getEnv = (key, defaultValue = "") => {
  const envKey = `REACT_APP_${key}`;
  return process.env[envKey] || defaultValue;
};

const config = {
  // API 설정
  api: {
    baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || "10000", 10),

    // 엔드포인트
    endpoints: {
      // Auth
      auth: {
        login: process.env.REACT_APP_AUTH_LOGIN || "/api/auth/login",
        signup: process.env.REACT_APP_AUTH_SIGNUP || "/api/auth/signup",
      },

      // Study
      study: {
        list: process.env.REACT_APP_STUDY_LIST || "/api/study/list",
        detail: process.env.REACT_APP_STUDY_DETAIL || "/api/study",
        create: process.env.REACT_APP_STUDY_CREATE || "/api/study",
        join: process.env.REACT_APP_STUDY_JOIN || "/api/study/join",
        withdraw: process.env.REACT_APP_STUDY_WITHDRAW || "/api/study",
      },

      // Problem
      problem: {
        register: process.env.REACT_APP_PROBLEM_REGISTER || "/api/problem",
        vacationUse:
          process.env.REACT_APP_PROBLEM_VACATION_USE ||
          "/api/problem/vacation/use",
      },
    },
  },

  // 인증 설정
  auth: {
    tokenKey: process.env.REACT_APP_TOKEN_KEY || "auth_token",
    headerKey: process.env.REACT_APP_AUTH_HEADER || "Authorization",
    tokenPrefix: process.env.REACT_APP_TOKEN_PREFIX || "Bearer",
  },

  // UI 설정
  ui: {
    vacation: {
      earlyMorningStart:
        parseInt(process.env.REACT_APP_VACATION_EARLY_MORNING_START || "0", 10),
      earlyMorningEnd:
        parseInt(process.env.REACT_APP_VACATION_EARLY_MORNING_END || "6", 10),
    },
    study: {
      maxMembers: parseInt(
        process.env.REACT_APP_MAX_STUDY_MEMBERS || "6",
        10
      ),
      defaultVacationDays: parseInt(
        process.env.REACT_APP_DEFAULT_VACATION_DAYS || "10",
        10
      ),
    },
  },

  // 환경 정보
  environment: {
    env: process.env.REACT_APP_ENV || "development",
    version: process.env.REACT_APP_VERSION || "1.0.0",
    isDevelopment:
      process.env.REACT_APP_ENV === "development" ||
      process.env.NODE_ENV === "development",
    isProduction:
      process.env.REACT_APP_ENV === "production" ||
      process.env.NODE_ENV === "production",
  },
};

// 헬퍼 함수: API URL 생성
config.getApiUrl = (path) => {
  const baseURL = config.api.baseURL;
  return `${baseURL}${path}`;
};

// 헬퍼 함수: 인증 헤더 생성
config.getAuthHeader = (token) => {
  return {
    [config.auth.headerKey]: `${config.auth.tokenPrefix} ${token}`,
  };
};

// 헬퍼 함수: 조기 아침 시간대 확인
config.isEarlyMorning = () => {
  const hour = new Date().getHours();
  return (
    hour >= config.ui.vacation.earlyMorningStart &&
    hour < config.ui.vacation.earlyMorningEnd
  );
};

// 개발 모드 로깅
if (config.environment.isDevelopment) {
  console.log("🔧 프론트엔드 환경설정 로드됨:", {
    API_URL: config.api.baseURL,
    ENV: config.environment.env,
    VERSION: config.environment.version,
  });
}

export default config;
