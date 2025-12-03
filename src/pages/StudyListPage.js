import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import StudyDetailPage from "./StudyDetailPage";
import useAuthStore from "../store/authStore";

function StudyListPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStudy, setSelectedStudy] = useState(null);
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

  if (loading) {
    return (
      <div className="study-list-page">
        <p>로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="study-list-page">
      <img src={logo} className="page-logo" alt="logo" />
      <h1>스터디 목록</h1>
      {studies.length === 0 ? (
        <p>스터디가 없습니다.</p>
      ) : (
        <div className="studies-container">
          {studies.map((study) => (
            <div key={study.id} className="study-card">
              <h2>{study.name}</h2>
              <p>{study.description}</p>
              <button onClick={() => setSelectedStudy(study)}>입장</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default StudyListPage;
