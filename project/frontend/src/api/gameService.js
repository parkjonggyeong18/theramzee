import { sendMessage } from './stomp';

export const getGameInfo = async (roomId) => {
  try {
    await sendMessage(`/app/game/${roomId}/info`, { roomId });
  } catch (error) {
    console.error('Failed to get game info:', error);
    throw error;
  }
};

export const startGame = async (roomId, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/start`, { roomId, nicknames });
  } catch (error) {
    console.error('Failed to start game:', error);
    throw error;
  }
};



  export const moveForest = async (roomId, nickname, newForest, nicknames) => {
    try {
      await sendMessage(`/app/game/${roomId}/move`, { roomId, nickname, newForest, nicknames });
    } catch (error) {
      console.error('Failed to move forest:', error);
      throw error;
    }
  };

  export const saveUserAcorns = async (roomId, nickname) => {
    try {
      await sendMessage(`/app/game/${roomId}/save-acorns`, { roomId, nickname });
    } catch (error) {
      console.error('Failed to save user acorns:', error);
      throw error;
    }
  };

  export const chargeFatigue = async (roomId, nickname) => {
    try {
      await sendMessage(`/app/game/${roomId}/charge-fatigue`, { roomId, nickname });
    } catch (error) {
      console.error('Failed to charge user fatigue:', error);
      throw error;
    }
  };

  export const killUser = async (roomId, victimNickname, killerNickname) => {
    try {
      await sendMessage(`/app/game/${roomId}/kill`, { roomId, victimNickname, killerNickname });
    } catch (error) {
      console.error('Failed to kill user:', error);
      throw error;
    }
  };

  export const completeMission = async (roomId, forestNum, missionNum, nickname) => {
    try {
      await sendMessage(`/app/game/${roomId}/complete-mission`, { roomId, forestNum, missionNum, nickname });
    } catch (error) {
      console.error('Failed to complete mission:', error);
      throw error;
    }
  };

//투표

export const startEmergencyVote = async (roomId, nicknames) => {
  try {
    await sendMessage(`/app/game/${roomId}/emergency`, { 
      roomId, 
      nicknames,
      action: 'START_EMERGENCY_VOTE',
      timestamp: Date.now() 
    });
  } catch (error) {
    console.error('Failed to start emergency vote:', error);
    throw error;
  }
};

export const sendVote = async (roomId, votedPlayer) => {
  try {
    // 순수 데이터 객체만 전송
    const voteData = {
      roomId,
      votedPlayer,    
    };

    await sendMessage(`/app/game/${roomId}/vote`, { roomId, votedPlayer });
  } catch (error) {
    console.error('Failed to send vote:', error);
    throw error;
  }
};
