// Lobby.js
import React, { useState } from 'react';
import './Lobby.css';

const Lobby = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(9, prev + 1));
  };

  const gameRooms = [
    { host: '사나이경환', title: '대현이만입장', capacity: '1/6' },
    // 추가 방 데이터
  ];

  return (
    <div className="lobby-container">
      <div className="background-gif"></div>
      <div className="header">
        <div className="nav">
          <button className="refresh-btn">새로고침</button>
          <button className="search-btn" onClick={() => setIsSearchOpen(!isSearchOpen)}>검색</button>
        </div>
        <div className="menu-categories">
          <span>| 호스트 |</span>
          <span>| 방제목 |</span>
          <span>| 인원 |</span>
        </div>
      </div>

      <div className="room-list">
        {gameRooms.map((room, index) => (
          <div key={index} className="room-card">
            <div className="room-info host">{room.host}</div>
            <div className="room-info title">{room.title}</div>
            <div className="room-info capacity">{room.capacity}</div>
          </div>
        ))}
        {/* 빈 방 슬롯 */}
        {[...Array(3)].map((_, i) => (
          <div key={`empty-${i}`} className="room-card empty"></div>
        ))}
      </div>

      <div className="pagination">
        <button onClick={handlePrevPage}>◀</button>
        <span>{currentPage}/9</span>
        <button onClick={handleNextPage}>▶</button>
      </div>
    </div>
  );
};

export default Lobby;