import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import useAuthStore from "../store/authStore";

// 사이트별 난이도 기준
const BAEKJOON_TIERS = [
  "Bronze",
  "Silver",
  "Gold",
  "Platinum",
  "Diamond",
  "Ruby",
];
const BAEKJOON_LEVELS = ["V", "IV", "III", "II", "I"];

const DIFFICULTY_CRITERIA = {
  백준: {
    tiers: BAEKJOON_TIERS,
    levels: BAEKJOON_LEVELS,
    vacationTiers: ["Gold", "Platinum", "Diamond", "Ruby"],
  },
  프로그래머스: {
    levels: [0, 1, 2, 3, 4, 5],
    vacationLevels: [3, 4, 5],
  },
  SWEA: {
    vacationLevels: [],
  },
};

function StudyDetailPage({ studyId, studyName, onBack }) {
  const [currentDate] = useState(new Date(2025, 11, 4));
  const [showModal, setShowModal] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const [solved, setSolved] = useState({});
  const [joinCode, setJoinCode] = useState("");
  const token = useAuthStore((state) => state.token);
  const [formData, setFormData] = useState({
    site: "백준",
    problemNumber: "",
    tier: "Bronze",
    level: "V",
    programmerLevel: "0",
  });

  useEffect(() => {
    fetchStudyDetail();
  }, [studyId]);

  const fetchStudyDetail = async () => {
    try {
      setLoading(true);
      // 인증 토큰이 없으면 API 호출하지 않음
      if (!token) {
        setError("로그인이 필요합니다. 로그인 후 다시 시도하세요.");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/study/${studyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setSolved(data.solved || {});
        setJoinCode(data.joinCode || "");
        setError("");
      } else {
        setError("스터디 정보를 불러올 수 없습니다");
      }
    } catch (error) {
      console.error("스터디 상세 조회 오류:", error);
      setError("서버에 연결할 수 없습니다");
    } finally {
      setLoading(false);
    }
  };

  // 더미 스터디원 데이터 - 월차 정보 추가
  const DUMMY_MEMBERS = [
    {
      id: 1,
      name: "김철수",
      color: "#FF6B6B",
      monthlyVacation: 3,
      vacationUsed: 1,
    },
    {
      id: 2,
      name: "이영희",
      color: "#4ECDC4",
      monthlyVacation: 5,
      vacationUsed: 0,
    },
    {
      id: 3,
      name: "박민준",
      color: "#45B7D1",
      monthlyVacation: 2,
      vacationUsed: 2,
    },
    {
      id: 4,
      name: "최수진",
      color: "#F7DC6F",
      monthlyVacation: 8,
      vacationUsed: 0,
    },
    {
      id: 5,
      name: "정준호",
      color: "#BB8FCE",
      monthlyVacation: 6,
      vacationUsed: 1,
    },
  ];

  // 더미 풀이 데이터
  const DUMMY_SOLVED = {
    "2025-12-01": [1, 3],
    "2025-12-02": [2, 4, 5],
    "2025-12-03": [1, 2, 3, 4],
    "2025-12-04": [1, 5],
  };

  // API에서 데이터를 받으면 사용, 아니면 더미 데이터 사용
  const displayMembers = members.length > 0 ? members : DUMMY_MEMBERS;
  const displaySolved = Object.keys(solved).length > 0 ? solved : DUMMY_SOLVED;

  // 달력 생성
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const isSolved = (day, memberId) => {
    if (!day) return false;
    const dateStr = `2025-12-${String(day).padStart(2, "0")}`;
    return displaySolved[dateStr]?.includes(memberId) || false;
  };

  // 스택 계산: 당일까지 풀지 않은 연속 일수
  const calculateStreak = (memberId) => {
    const today = currentDate.getDate();
    let streak = 0;

    // 어제부터 역순으로 확인
    for (let day = today - 1; day >= 1; day--) {
      if (!isSolved(day, memberId)) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // API에 보낼 데이터 준비
    const payload = {
      studyId,
      platform: formData.site,
      problemNumber: formData.problemNumber,
      tier: formData.site === "백준" ? formData.tier : undefined,
      level:
        formData.site === "백준" ? formData.level : formData.programmerLevel,
    };

    try {
      const response = await fetch("http://localhost:5000/api/problem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("문제 등록 성공:", data);
        // 스터디 정보 새로고침
        await fetchStudyDetail();
        setShowModal(false);
        setFormData({
          site: "백준",
          problemNumber: "",
          tier: "Bronze",
          level: "V",
          programmerLevel: "0",
        });
      } else {
        const errorData = await response.json();
        alert("문제 등록 실패: " + (errorData.error || "알 수 없는 오류"));
      }
    } catch (error) {
      console.error("문제 등록 오류:", error);
      alert("서버에 연결할 수 없습니다");
    }
  };

  const getVacationEarned = () => {
    if (formData.site === "백준") {
      const criteria = DIFFICULTY_CRITERIA.백준;
      return criteria.vacationTiers.includes(formData.tier) ? 1 : 0;
    }
    if (formData.site === "프로그래머스") {
      const criteria = DIFFICULTY_CRITERIA.프로그래머스;
      return criteria.vacationLevels.includes(Number(formData.programmerLevel))
        ? 1
        : 0;
    }
    return 0;
  };

  const handleWithdraw = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/study/${studyId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log("스터디 탈퇴 성공");
        setShowWithdrawConfirm(false);
        setShowMenuModal(false);
        onBack();
      } else {
        alert("탈퇴에 실패했습니다");
      }
    } catch (error) {
      console.error("탈퇴 오류:", error);
      alert("서버에 연결할 수 없습니다");
    }
  };

  return (
    <div className="study-detail-page">
      <div className="detail-header">
        <button className="back-button" onClick={onBack}>
          ← 돌아가기
        </button>
        <div className="header-title-section">
          <h1>{studyName || "스터디"}</h1>
          {joinCode && (
            <div
              className="join-code-display"
              onClick={() => {
                navigator.clipboard.writeText(joinCode);
                alert("가입코드가 복사되었습니다!");
              }}
              title="클릭하여 복사"
            >
              코드: {joinCode}
            </div>
          )}
        </div>
        <div className="header-buttons">
          <button
            className="register-button"
            onClick={() => setShowModal(true)}
          >
            + 문제 등록
          </button>
          <button
            className="hamburger-button"
            onClick={() => setShowMenuModal(!showMenuModal)}
          >
            ☰
          </button>
          {showMenuModal && (
            <div className="menu-dropdown">
              <button
                className="menu-item"
                onClick={() => setShowWithdrawConfirm(true)}
              >
                탈퇴하기
              </button>
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <p>로딩 중...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p className="error-message">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="detail-container">
          {/* 좌측: 스터디원 목록 */}
          <div className="members-section">
            <h2>스터디원</h2>
            <div className="members-list">
              {displayMembers.map((member) => {
                const remainingVacation =
                  member.monthlyVacation - member.vacationUsed;
                const isGreedy = member.monthlyVacation > 8;

                return (
                  <div key={member.id} className="member-item">
                    {isGreedy && <div className="greedy-badge">욕심쟁이~</div>}
                    <div
                      className="member-avatar"
                      style={{ backgroundColor: member.color }}
                    >
                      {member.name.charAt(0)}
                    </div>
                    <div className="member-info">
                      <span className="member-name">{member.name}</span>
                      <div className="member-vacation-info">
                        <span className="vacation-badge">
                          남은 월차: {remainingVacation}
                        </span>
                        <span className="vacation-count">
                          누적: {member.monthlyVacation}
                        </span>
                      </div>
                      {calculateStreak(member.id) > 0 && (
                        <span className="streak-warning">
                          {calculateStreak(member.id)} 스택
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 중앙: 달력 */}
          <div className="calendar-section">
            <h2>
              {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월 풀이
              현황
            </h2>
            <div className="calendar">
              <div className="calendar-header">
                <div className="weekday">일</div>
                <div className="weekday">월</div>
                <div className="weekday">화</div>
                <div className="weekday">수</div>
                <div className="weekday">목</div>
                <div className="weekday">금</div>
                <div className="weekday">토</div>
              </div>
              <div className="calendar-body">
                {days.map((day, index) => (
                  <div key={index} className="calendar-day">
                    {day && (
                      <>
                        <div className="day-number">{day}</div>
                        <div className="day-solvers">
                          {displayMembers.map((member) => (
                            <div
                              key={member.id}
                              className={`solver-dot ${
                                isSolved(day, member.id) ? "solved" : "unsolved"
                              }`}
                              style={{
                                backgroundColor: isSolved(day, member.id)
                                  ? member.color
                                  : "#e0e0e0",
                              }}
                              title={`${member.name} - ${
                                isSolved(day, member.id) ? "풀음" : "안 풀음"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 범례 */}
            <div className="calendar-legend">
              <h3>범례</h3>
              <div className="legend-items">
                {displayMembers.map((member) => (
                  <div key={member.id} className="legend-item">
                    <div
                      className="legend-color"
                      style={{ backgroundColor: member.color }}
                    />
                    <span>{member.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 문제 등록 모달 */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>문제 등록</h2>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="problem-form">
              <div className="form-group">
                <label>사이트 선택</label>
                <select
                  value={formData.site}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      site: e.target.value,
                      difficulty: "",
                    })
                  }
                >
                  <option value="백준">백준</option>
                  <option value="프로그래머스">프로그래머스</option>
                  <option value="SWEA">SWEA (삼성)</option>
                </select>
              </div>

              <div className="form-group">
                <label>문제 번호</label>
                <input
                  type="text"
                  placeholder="예: 12345"
                  value={formData.problemNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      problemNumber: e.target.value,
                    })
                  }
                  required
                />
              </div>

              {/* 백준 난이도 선택 */}
              {formData.site === "백준" && (
                <>
                  <div className="form-group">
                    <label>티어 선택</label>
                    <select
                      value={formData.tier}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          tier: e.target.value,
                        })
                      }
                      required
                    >
                      {DIFFICULTY_CRITERIA.백준.tiers.map((tier) => (
                        <option key={tier} value={tier}>
                          {tier}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>레벨 선택</label>
                    <select
                      value={formData.level}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          level: e.target.value,
                        })
                      }
                      required
                    >
                      {DIFFICULTY_CRITERIA.백준.levels.map((lv) => (
                        <option key={lv} value={lv}>
                          {lv}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* 프로그래머스 레벨 선택 */}
              {formData.site === "프로그래머스" && (
                <div className="form-group">
                  <label>레벨 선택</label>
                  <select
                    value={formData.programmerLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        programmerLevel: e.target.value,
                      })
                    }
                    required
                  >
                    {DIFFICULTY_CRITERIA.프로그래머스.levels.map((lv) => (
                      <option key={lv} value={lv}>
                        Level {lv}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* SWEA 레벨 선택 */}
              {formData.site === "SWEA" && (
                <div className="form-group">
                  <label>난이도 (D로 시작하는 난이도)</label>
                  <input
                    type="text"
                    placeholder="예: D5, D4, D3, D2, D1"
                    value={formData.programmerLevel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        programmerLevel: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              )}

              {getVacationEarned() > 0 && (
                <div className="vacation-info">
                  <p>🎉 월차 {getVacationEarned()}개 적립 예상!</p>
                </div>
              )}

              {formData.site === "SWEA" && (
                <div className="no-vacation-info">
                  <p>ℹ️ SWEA는 월차 적립 대상이 아닙니다.</p>
                </div>
              )}

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
                <button type="submit" className="submit-button">
                  등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 탈퇴 확인 모달 */}
      {showWithdrawConfirm && (
        <div
          className="modal-overlay"
          onClick={() => setShowWithdrawConfirm(false)}
        >
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-header">
              <p>정말로 탈퇴하시겠어요?</p>
            </div>
            <div className="confirm-buttons">
              <button
                className="confirm-no"
                onClick={() => setShowWithdrawConfirm(false)}
              >
                아니오
              </button>
              <button className="confirm-yes" onClick={handleWithdraw}>
                네
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StudyDetailPage;
