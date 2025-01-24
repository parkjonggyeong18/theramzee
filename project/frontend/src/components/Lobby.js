// Lobby.js
import React, { useState } from 'react';
import './Lobby.css';

const Lobby = () => {
 const [currentPage, setCurrentPage] = useState(1);
 const [showFriendList, setShowFriendList] = useState(false);
 const [showChat, setShowChat] = useState(false);
 const [selectedFriend, setSelectedFriend] = useState(null);

 const gameRooms = [
   { host: '사나이경환', title: '대현이만입장', capacity: '1/6' }
 ];

 const friends = [
   { id: 1, name: '이대현쟁쟁맨', online: true },
   { id: 2, name: '사나이경환', online: false }
 ];

 const handlePrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
 const handleNextPage = () => setCurrentPage(prev => Math.min(9, prev + 1));

 return (
   <div className="lobby-container">
     <div className="background-gif" />
     
     <div className="title">THE RAMZEE STORY</div>
     
     <div className="top-menu">
       <input type="text" placeholder="새로고침" className="search-input" />
       <button className="search-btn">검색</button>
     </div>

     <div className="menu-categories">
       <span>| 호스트 |</span>
       <span>| 방제목 |</span>
       <span>| 인원 |</span>
     </div>

     <div className="room-list">
       {gameRooms.map((room, index) => (
         <div key={index} className="room-card">
           <div className="room-info host">{room.host}</div>
           <div className="room-info title">{room.title}</div>
           <div className="room-info capacity">{room.capacity}</div>
         </div>
       ))}
       {[...Array(3)].map((_, i) => (
         <div key={`empty-${i}`} className="room-card empty" />
       ))}
     </div>

     <div className="pagination">
       <button onClick={handlePrevPage}>◀</button>
       <span>{currentPage}/9</span>
       <button onClick={handleNextPage}>▶</button>
     </div>

     <div className="friend-section">
       <div className="cam-box">
         <div className="video-placeholder"></div>
         <div className="cam-controls">
           <span>기무선진</span>
           <div>
             <button className="cam-btn">캡</button>
             <button className="cam-btn">오</button>
           </div>
         </div>
       </div>

       <div className="friend-list">
         <div className="friend-item">
           <span>이대현쟁쟁맨</span>
           <div className="friend-controls">
             <span className="online-status"></span>
             <button>따라가기</button>
             <button>삭제</button>
           </div>
         </div>
         <div className="friend-item">
           <span>사나이경환</span>
           <div className="friend-controls">
             <span className="offline-status"></span>
             <button>따라가기</button>
             <button>삭제</button>
           </div>
         </div>
       </div>
     </div>

     {showChat && (
       <div className="chat-window">
         <div className="chat-header">
           <span>이대현쟁쟁맨</span>
           <button onClick={() => setShowChat(false)}>X</button>
         </div>
         <input type="text" placeholder="hi" className="chat-input" />
       </div>
     )}
   </div>
 );
};

export default Lobby;