import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import StudyDetailPage from "./StudyDetailPage";
import useAuthStore from "../store/authStore";

export const StudyListPage = () => {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinLoading, setJoinLoading] = useState(false);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/study/list");
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
      const response = await fetch("http://localhost:5000/api/study/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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

  if (selectedStudy) {
    return (
      <StudyDetailPage
        studyId={selectedStudy.id}
        studyName={selectedStudy.name}
        onBack={() => setSelectedStudy(null)}
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
      <img src={logo} className="page-logo" alt="logo" />
      <div className="list-header">
        <h1>스터디 목록</h1>
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

      {studies.length === 0 ? (
        <p>스터디가 없습니다.</p>
      ) : (
        <div className="studies-container">
          {studies.map((study) => (
            <div key={study.id} className="study-card">
              <h2>{study.name}</h2>
              <p className="study-code">코드: {study.joinCode}</p>
              <p>{study.description}</p>
              <div className="study-card-footer">
                <span className="member-count">인원: {study.memberCount}</span>
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
    </div>
  );
};
