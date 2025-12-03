import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import StudyDetailPage from "./StudyDetailPage";

const DUMMY_STUDIES = [
  {
    id: 1,
    name: "React 스터디",
    description: "React 심화 학습 및 프로젝트",
  },
  {
    id: 2,
    name: "JavaScript ES6+",
    description: "모던 JavaScript 문법 습득",
  },
  {
    id: 3,
    name: "Node.js 백엔드",
    description: "Express를 이용한 서버 개발",
  },
  {
    id: 4,
    name: "데이터베이스 설계",
    description: "SQL 및 NoSQL 학습",
  },
  {
    id: 5,
    name: "클라우드 컴퓨팅",
    description: "AWS 및 Azure 활용",
  },
];

function StudyListPage() {
  const [studies, setStudies] = useState(DUMMY_STUDIES);
  const [loading, setLoading] = useState(false);
  const [selectedStudy, setSelectedStudy] = useState(null);

  useEffect(() => {
    // 더미데이터 사용
  }, []);

  if (selectedStudy) {
    return (
      <StudyDetailPage
        studyId={selectedStudy.id}
        onBack={() => setSelectedStudy(null)}
      />
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
