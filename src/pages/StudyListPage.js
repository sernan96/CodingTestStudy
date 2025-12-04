import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import StudyDetailPage from "./StudyDetailPage";
import useAuthStore from "../store/authStore";
import config from "../config/env";

export const StudyListPage = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createMaxMembers, setCreateMaxMembers] = useState(3);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [showCreateSuccess, setShowCreateSuccess] = useState(false);
  const [createdStudyData, setCreatedStudyData] = useState(null);
  const token = useAuthStore((state) => state.token);

  const handleLogout = async () => {
    if (!window.confirm("로그아웃하시겠습니까?")) return;

    // 먼저 서버에 폐기 요청
    try {
      const tokenVal =
        useAuthStore.getState()?.token || localStorage.getItem("token");
      if (tokenVal) {
        const url = config.getApiUrl("/api/auth/logout");
        await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenVal}`,
          },
        });
      }
    } catch (err) {
      // 실패해도 클라이언트에서 토큰 제거
      console.error("서버 로그아웃 요청 실패:", err);
    }

    try {
      const store = useAuthStore.getState();
      if (store && typeof store.clearToken === "function") {
        store.clearToken();
      } else if (store && typeof store.logout === "function") {
        store.logout();
      } else if (store && typeof store.setToken === "function") {
        store.setToken(null);
      } else {
        localStorage.removeItem("token");
      }
    } catch (e) {
      localStorage.removeItem("token");
    }

    window.location.href = "/";
  };

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) {
        setError("로그인이 필요합니다");
        setLoading(false);
        return;
      }
      const url = config.getApiUrl(config.api.endpoints.study.list);
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStudies(data.studies);
        setError("");
      } else {
        setError("스터디 목록을 불러올 수 없습니다");
      }
    } catch (error) {
      console.error("스터디 목록 조회 오류:", error);
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinStudy = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      setJoinError("가입코드를 입력해주세요");
      return;
    }

    try {
      setJoinLoading(true);
      const currentToken = token || localStorage.getItem("token");
      if (!currentToken) {
        setJoinError("로그인이 필요합니다");
        setJoinLoading(false);
        return;
      }

      const url = config.getApiUrl(config.api.endpoints.study.join);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({ joinCode: joinCode.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`${data.study.name}에 가입했습니다!`);
        setJoinCode("");
        setJoinError("");
        setShowJoinModal(false);
        // 목록 새로고침
        await fetchStudies();
      } else {
        const errorData = await response.json();
        setJoinError(errorData.message || "가입에 실패했습니다");
      }
    } catch (error) {
      console.error("가입 오류:", error);
      setJoinError("서버에 연결할 수 없습니다");
    } finally {
      setJoinLoading(false);
    }
  };

  const handleCreateStudy = async (e) => {
    e.preventDefault();
    if (!createName.trim()) {
      setCreateError("스터디명을 입력해주세요");
      return;
    }
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      setCreateError("로그인이 필요합니다");
      return;
    }
    try {
      setCreateLoading(true);
      const url = config.getApiUrl(config.api.endpoints.study.create);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          name: createName.trim(),
          maxMembers: createMaxMembers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // show nicer success modal
        setCreatedStudyData(data.study || null);
        setShowCreateSuccess(true);
        setCreateName("");
        setCreateMaxMembers(3);
        setCreateError("");
        setShowCreateModal(false);
        // 목록 새로고침
        await fetchStudies();
      } else {
        const errorData = await response.json();
        setCreateError(errorData.message || "스터디 생성에 실패했습니다");
      }
    } catch (error) {
      console.error("스터디 생성 오류:", error);
      setCreateError("서버에 연결할 수 없습니다");
    } finally {
      setCreateLoading(false);
    }
  };

  if (selectedStudy) {
    return (
      <StudyDetailPage
        studyId={selectedStudy.id}
        studyName={selectedStudy.name}
        onBack={() => {
          setSelectedStudy(null);
          fetchStudies();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="study-list-page">
        <img src={logo} className="page-logo" alt="logo" />
        <h1>스터디 목록</h1>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-list-page">
        <img src={logo} className="page-logo" alt="logo" />
        <h1>스터디 목록</h1>
        <p style={{ color: "#e74c3c" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="study-list-page">
      <button
        className="floating-logout"
        onClick={handleLogout}
        aria-label="로그아웃"
      >
        로그아웃
      </button>
      <img src={logo} className="page-logo" alt="logo" />
      <div className="list-header">
        <h1>스터디 목록</h1>
        <div className="header-buttons">
          <button
            className="create-study-button"
            onClick={() => {
              setShowCreateModal(true);
              setCreateError("");
              setCreateName("");
              setCreateMaxMembers(3);
            }}
          >
            📌 스터디 생성
          </button>
          <button
            className="join-study-button"
            onClick={() => {
              setShowJoinModal(true);
              setJoinError("");
              setJoinCode("");
            }}
          >
            + 스터디 가입
          </button>
        </div>
      </div>

      {studies.length === 0 ? (
        <p>스터디가 없습니다.</p>
      ) : (
        <div className="studies-container">
          {studies.map((study) => (
            <div key={study.id} className="study-card">
              <h2>{study.name}</h2>
              <p className="study-code">
                코드: {study.joinCode.substring(0, 4)}...
              </p>
              <p>{study.description}</p>
              <div className="study-card-footer">
                <button onClick={() => setSelectedStudy(study)}>입장</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 가입 모달 */}
      {showJoinModal && (
        <div className="modal-overlay" onClick={() => setShowJoinModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>스터디 가입</h2>
              <button
                className="modal-close"
                onClick={() => setShowJoinModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinStudy} className="join-form">
              <div className="form-group">
                <label>가입 코드</label>
                <input
                  type="text"
                  placeholder="스터디 가입 코드를 입력하세요"
                  value={joinCode}
                  onChange={(e) => {
                    setJoinCode(e.target.value);
                    setJoinError("");
                  }}
                  required
                />
              </div>

              {joinError && (
                <div className="error-message" style={{ marginBottom: "15px" }}>
                  {joinError}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowJoinModal(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={joinLoading}
                >
                  {joinLoading ? "가입 중..." : "가입"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 생성 모달 */}
      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>스터디 생성</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudy} className="join-form">
              <div className="form-group">
                <label>스터디명</label>
                <input
                  type="text"
                  placeholder="스터디 이름을 입력하세요"
                  value={createName}
                  onChange={(e) => {
                    setCreateName(e.target.value);
                    setCreateError("");
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  최대 인원:{" "}
                  <span className="members-value">{createMaxMembers}명</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="6"
                  value={createMaxMembers}
                  onChange={(e) => {
                    setCreateMaxMembers(parseInt(e.target.value));
                    setCreateError("");
                  }}
                  className="members-slider"
                />
                <div className="slider-labels">
                  <span>1명</span>
                  <span>6명</span>
                </div>
              </div>

              {createError && (
                <div className="error-message" style={{ marginBottom: "15px" }}>
                  {createError}
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowCreateModal(false)}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  disabled={createLoading}
                  style={{ backgroundColor: "#27ae60" }}
                >
                  {createLoading ? "생성 중..." : "생성"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 생성 성공 모달 */}
      {showCreateSuccess && createdStudyData && (
        <div
          className="modal-overlay"
          onClick={() => setShowCreateSuccess(false)}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 500 }}
          >
            <div className="modal-header">
              <h2>스터디 생성 완료</h2>
              <button
                className="modal-close"
                onClick={() => setShowCreateSuccess(false)}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: 16 }}>
              <p>
                <strong>{createdStudyData.name}</strong> 스터디가
                생성되었습니다.
              </p>
              <p>가입 코드: {createdStudyData.joinCode}</p>
              <div style={{ textAlign: "right", marginTop: 12 }}>
                <button
                  className="submit-button"
                  onClick={() => setShowCreateSuccess(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
