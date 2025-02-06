import React, { useEffect, useState, useCallback } from 'react';
import { connectSocket, disconnectSocket, subscribeToTopic } from '../../api/stomp';
import { getGameInfo, startGame, handleEmergency, moveForest, 
  getUserAcorns, saveUserAcorns, getUserFatigue, chargeFatigue, 
  killUser, getMissionStatus, completeMission } from '../../api/gameService';

function GameStart() {
  const [roomId, setRoomId] = useState('');
  const [nicknames, setNicknames] = useState('');
  const [userNum, setUserNum] = useState('');
  const [newForest, setNewForest] = useState('');
  const [targetUserNum, setTargetUserNum] = useState('');
  const [myNum, setMyNum] = useState('');
  const [forestNum, setForestNum] = useState('');
  const [missionNum, setMissionNum] = useState('');

  const [gameInfo, setGameInfo] = useState(null);
  const [gameStart, setGameStart] = useState(null);
  const [emergencyStatus, setEmergencyStatus] = useState(null);
  const [moveStatus, setMoveStatus] = useState(null);
  const [acorns, setAcorns] = useState(null);
  const [savedAcorns, setSavedAcorns] = useState(null);
  const [fatigue, setFatigue] = useState(null);
  const [chargedFatigue, setChargedFatigue] = useState(null);
  const [killResult, setKillResult] = useState(null);
  const [missionStatus, setMissionStatus] = useState(null);
  const [completeMissionResult, setCompleteMissionResult] = useState(null);

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await connectSocket();
        setIsConnected(true);
      } catch (error) {
        console.error('Failed to connect:', error);
        setIsConnected(false);
      }
    };

    initializeSocket();

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    if (isConnected && roomId) {
      const gameInfoSubscription = subscribeToTopic(`/user/queue/game/${roomId}/info`, handleGameInfo);
      const gameStartSubscription = subscribeToTopic(`/topic/game/${roomId}/start`, handleGameStart);
      const emergencySubscription = subscribeToTopic(`/topic/game/${roomId}/emergency`, handleEmergencyResponse);
      const moveSubscription = subscribeToTopic(`/topic/game/${roomId}/move`, handleMoveResponse);
      const acornsSubscription = subscribeToTopic(`/user/queue/game/${roomId}/acorns`, handleAcornsResponse);
      const saveAcornsSubscription = subscribeToTopic(`/topic/game/${roomId}/save-acorns`, handleSaveAcornsResponse);
      const fatigueSubscription = subscribeToTopic(`/user/queue/game/${roomId}/fatigue`, handleFatigueResponse);
      const chargeFatigueSubscription = subscribeToTopic(`/topic/game/${roomId}/charge-fatigue`, handleChargeFatigueResponse);
      const killSubscription = subscribeToTopic(`/topic/game/${roomId}/kill`, handleKillResponse);
      const missionSubscription = subscribeToTopic(`/user/queue/game/${roomId}/mission`, handleMissionResponse);
      const completeMissionSubscription = subscribeToTopic(`/topic/game/${roomId}/complete-mission`, handleCompleteMissionResponse);

      return () => {
        if (gameInfoSubscription) gameInfoSubscription.unsubscribe();
        if (gameStartSubscription) gameStartSubscription.unsubscribe();
        if (emergencySubscription) emergencySubscription.unsubscribe();
        if (moveSubscription) moveSubscription.unsubscribe();
        if (acornsSubscription) acornsSubscription.unsubscribe();
        if (saveAcornsSubscription) saveAcornsSubscription.unsubscribe();
        if (fatigueSubscription) fatigueSubscription.unsubscribe();
        if (chargeFatigueSubscription) chargeFatigueSubscription.unsubscribe();
        if (killSubscription) killSubscription.unsubscribe();
        if (missionSubscription) missionSubscription.unsubscribe();
        if (completeMissionSubscription) completeMissionSubscription.unsubscribe();
      };
    }
  }, [isConnected, roomId]);

  const handleGameInfo = useCallback((response) => {
    console.log('Game Info:', response);
    setGameInfo(response.data);
  }, []);

  const handleGameStart = useCallback((response) => {
    console.log('Game Started:', response);
    setGameStart(response.data);
  }, []);

  const handleEmergencyResponse = useCallback((response) => {
    console.log('Emergency Response:', response);
    setEmergencyStatus(response.data);
  }, []);

  const handleMoveResponse = useCallback((response) => {
    console.log('Move Response:', response);
    setMoveStatus(response.data);
  }, []);

  const handleAcornsResponse = useCallback((response) => {
    console.log('Acorns Response:', response);
    setAcorns(response.data);
  }, []);

  const handleSaveAcornsResponse = useCallback((response) => {
    console.log('Save Acorns Response:', response);
    setSavedAcorns(response.data);
  }, []);

  const handleFatigueResponse = useCallback((response) => {
    console.log('Fatigue Response:', response);
    setFatigue(response.data);
  }, []);

  const handleChargeFatigueResponse = useCallback((response) => {
    console.log('Charge Fatigue Response:', response);
    setChargedFatigue(response.data);
  }, []);

  const handleKillResponse = useCallback((response) => {
    console.log('Kill Response:', response);
    setKillResult(response.data);
  }, []);

  const handleMissionResponse = useCallback((response) => {
    console.log('Mission Status Response:', response);
    setMissionStatus(response.data);
  }, []);

  const handleCompleteMissionResponse = useCallback((response) => {
    console.log('Complete Mission Response:', response);
    setCompleteMissionResult(response.data);
  }, []);

////////////////////////////////////////////////////////////////////////////////////////////

  const requestGameInfo = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await getGameInfo(roomId);
      } catch (error) {
        console.error('Failed to request game info:', error);
      }
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  }, [isConnected, roomId]);

  const handleStartGame = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await startGame(roomId, nicknames.split(','));
      } catch (error) {
        console.error('Failed to start game:', error);
      }
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  }, [isConnected, roomId, nicknames]);

  const requestEmergency = useCallback(async () => {
    if (isConnected && roomId) {
      try {
        await handleEmergency(roomId);
      } catch (error) {
        console.error('Failed to request emergency:', error);
      }
    } else {
      console.error('WebSocket is not connected or roomId is empty');
    }
  }, [isConnected, roomId]);

  const handleMove = useCallback(async () => {
    if (isConnected && roomId && userNum && newForest) {
      try {
        await moveForest(roomId, userNum, newForest);
      } catch (error) {
        console.error('Failed to move forest:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, userNum, newForest]);

  const handleGetAcorns = useCallback(async () => {
    if (isConnected && roomId && userNum) {
      try {
        await getUserAcorns(roomId, userNum);
      } catch (error) {
        console.error('Failed to get user acorns:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, userNum]);

  const handleSaveAcorns = useCallback(async () => {
    if (isConnected && roomId && userNum) {
      try {
        await saveUserAcorns(roomId, userNum);
      } catch (error) {
        console.error('Failed to save user acorns:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, userNum]);

  const handleGetFatigue = useCallback(async () => {
    if (isConnected && roomId && userNum) {
      try {
        await getUserFatigue(roomId, userNum);
      } catch (error) {
        console.error('Failed to get user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, userNum]);

  const handleChargeFatigue = useCallback(async () => {
    if (isConnected && roomId && userNum) {
      try {
        await chargeFatigue(roomId, userNum);
      } catch (error) {
        console.error('Failed to charge user fatigue:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, userNum]);

  const handleKillUser = useCallback(async () => {
    if (isConnected && roomId && targetUserNum && myNum) {
      try {
        await killUser(roomId, targetUserNum, myNum);
      } catch (error) {
        console.error('Failed to kill user:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, targetUserNum, myNum]);

  const handleGetMissionStatus = useCallback(async () => {
    if (isConnected && roomId && forestNum) {
      try {
        await getMissionStatus(roomId, forestNum);
      } catch (error) {
        console.error('Failed to get mission status:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, forestNum]);

  const handleCompleteMission = useCallback(async () => {
    if (isConnected && roomId && forestNum && missionNum && userNum) {
      try {
        await completeMission(roomId, forestNum, missionNum, userNum);
      } catch (error) {
        console.error('Failed to complete mission:', error);
      }
    } else {
      console.error('WebSocket is not connected or required fields are empty');
    }
  }, [isConnected, roomId, forestNum, missionNum, userNum]);

  ////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <div>
      <h2>Game Start</h2>
      <p>Connection Status: {isConnected ? 'Connected' : 'Disconnected'}</p>

      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <input
        type="text"
        value={nicknames}
        onChange={(e) => setNicknames(e.target.value)}
        placeholder="Nicknames (comma-separated)"
      />
      <input
        type="text"
        value={userNum}
        onChange={(e) => setUserNum(e.target.value)}
        placeholder="User Number"
      />
      <input
        type="text"
        value={newForest}
        onChange={(e) => setNewForest(e.target.value)}
        placeholder="New Forest"
      />
      <input
        type="text"
        value={targetUserNum}
        onChange={(e) => setTargetUserNum(e.target.value)}
        placeholder="Target User Number"
      />
      <input
        type="text"
        value={myNum}
        onChange={(e) => setMyNum(e.target.value)}
        placeholder="My User Number"
      />
      <input
        type="text"
        value={forestNum}
        onChange={(e) => setForestNum(e.target.value)}
        placeholder="Forest Number"
      />
      <input
        type="text"
        value={missionNum}
        onChange={(e) => setMissionNum(e.target.value)}
        placeholder="Mission Number"
      />

      <button onClick={requestGameInfo} disabled={!isConnected || !roomId}>Get Game Info</button>
      <button onClick={handleStartGame} disabled={!isConnected || !roomId || !nicknames}>Start Game</button>
      <button onClick={requestEmergency} disabled={!isConnected || !roomId}>Request Emergency</button>
      <button onClick={handleMove} disabled={!isConnected || !roomId || !userNum || !newForest}>Move Forest</button>
      <button onClick={handleGetAcorns} disabled={!isConnected || !roomId || !userNum}>Get User Acorns</button>
      <button onClick={handleSaveAcorns} disabled={!isConnected || !roomId || !userNum}>Save User Acorns</button>
      <button onClick={handleGetFatigue} disabled={!isConnected || !roomId || !userNum}>Get User Fatigue</button>
      <button onClick={handleChargeFatigue} disabled={!isConnected || !roomId || !userNum}>Charge User Fatigue</button>
      <button onClick={handleKillUser} disabled={!isConnected || !roomId || !targetUserNum || !myNum}>Kill User</button>
      <button onClick={handleGetMissionStatus} disabled={!isConnected || !roomId || !forestNum}>Get Mission Status</button>
      <button onClick={handleCompleteMission} disabled={!isConnected || !roomId || !forestNum || !missionNum || !userNum}>Complete Mission</button>

      {gameInfo && (
        <div>
          <h3>Game Info:</h3>
          <pre>{JSON.stringify(gameInfo, null, 2)}</pre>
        </div>
      )}

      {gameStart && (
        <div>
          <h3>Game Start Info:</h3>
          <pre>{JSON.stringify(gameStart, null, 2)}</pre>
        </div>
      )}

      {emergencyStatus && (
        <div>
          <h3>Emergency Status:</h3>
          <pre>{JSON.stringify(emergencyStatus, null, 2)}</pre>
        </div>
      )}

      {moveStatus && (
        <div>
          <h3>Move Status:</h3>
          <pre>{JSON.stringify(moveStatus, null, 2)}</pre>
        </div>
      )}

      {acorns && (
        <div>
          <h3>User Acorns:</h3>
          <p>{acorns}</p>
        </div>
      )}

      {savedAcorns !== null && (
        <div>
          <h3>Saved Acorns:</h3>
          <p>{savedAcorns}</p>
        </div>
      )}

      {fatigue !== null && (
        <div>
          <h3>User Fatigue:</h3>
          <p>{fatigue}</p>
        </div>
      )}

      {chargedFatigue !== null && (
        <div>
          <h3>Charged Fatigue:</h3>
          <p>{chargedFatigue}</p>
        </div>
      )}

      {killResult !== null && (
        <div>
          <h3>Kill Result:</h3>
          <p>{killResult ? 'Success' : 'Failed'}</p>
        </div>
      )}

      {missionStatus && (
        <div>
          <h3>Mission Status:</h3>
          <pre>{JSON.stringify(missionStatus, null, 2)}</pre>
        </div>
      )}

      {completeMissionResult !== null && (
        <div>
          <h3>Mission Completion Result:</h3>
          <p>{completeMissionResult ? 'Success' : 'Failed'}</p>
        </div>
      )}
    </div>
  );
}

export default GameStart;
