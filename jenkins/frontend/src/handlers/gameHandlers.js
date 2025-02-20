import { useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { subscribeToTopic } from '../api/stomp';
import { useGame } from '../contexts/GameContext';

export const useGameHandlers = (roomId, setGameState, moveForest, cancelAction, endVote) => {
    const nickName = sessionStorage.getItem('nickName');
    const navigate = useNavigate();
    const { players } = useGame();

    // 게임 초기화 응답 처리
    const handleGameStartResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    subscribeToTopic(`/topic/server-time`, handleTimeSyncResponse);
                    const initializedData = message.data;
                    const userKey = `ROOM:${roomId}:USER:${nickName}`;
                    const forestKey = `ROOM:${roomId}:FOREST:1`;

                    setGameState((prev) => ({
                        ...prev,
                        isStarted: true,
                        evilSquirrel: initializedData.users[userKey].evilSquirrel,
                        forestToken: initializedData.users[userKey].forestToken,
                        forestUsers: initializedData.forestUsers,
                        count: initializedData.forests[forestKey].count,
                        evilSquirrelNickname: initializedData.forests[forestKey].evilSquirrelNickname,
                        initServerTime: initializedData.serverTime,
                        serverTime: initializedData.serverTime,
                    }));
                }
            } catch (error) {
                console.error('Game start error:', error);
            }
        },
        [roomId, setGameState, nickName]
    );

    // 비상 상황 응답 처리
    const handleEmergencyResponse = useCallback(
        (message) => {
            try {
                const initializedData = message.data;
                if (message.success) {
                    setGameState(prev => ({
                        ...prev,
                        isVoting: true,
                        isEmergencyVote: true,
                        forestNum: 1,
                        forestUsers: initializedData.forestUsers,
                        isPaused: true,
                        hasUsedEmergency: true,
                        voter: initializedData.voter,
                        serverTime: initializedData.serverTime,
                        timer: 270 - Math.floor((initializedData.serverTime - prev.initServerTime) / 1000),
                    }));
                    cancelAction();
                    moveForest(1);
                    // 부수 효과는 추후 useEffect로 분리하는 것도 고려
                    navigate(`/game/${roomId}/main`);
                }
            } catch (error) {
                console.error('Emergency response error:', error);
            }
        },
        [roomId, cancelAction, moveForest, navigate]
    );

    // 숲 이동 응답 처리
    const handleMoveResponse = useCallback(
        async (message) => {
            try {
                if (message.success) {
                    const initializedData = message.data;
                    setGameState((prev) => ({
                        ...prev,
                        forestUsers: initializedData.forestUsers,
                    }));
                    if (message.data.nickname === nickName) {
                        setGameState((prev) => ({
                            ...prev,
                            forestToken: initializedData.forestToken,
                            forestNum: initializedData.forestNum,
                        }));
                    }
                }
            } catch (error) {
                console.error('Move response error:', error);
            }
        },
        [nickName]
    );

    // 도토리 저장 응답 처리
    const handleSaveAcornsResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const initializedData = message.data;
                    if (initializedData.newTotalAcorns >= 13) {
                        // 부수 효과: navigate는 업데이트 이후 useEffect에서 처리해도 좋음
                        navigate(`/game/${roomId}/main`);
                        setGameState((prev) => ({
                            ...prev,
                            totalAcorns: initializedData.newTotalAcorns,
                            heldAcorns: 0,
                            isGameOver: true,
                            gameOverReason: 'acorns',
                            winner: 'good',
                            isStarted: false
                        }));
                        setTimeout(() => {
                            setGameState(prev => ({
                                ...prev,
                                currentScreen: 'gameOver'
                            }));
                        }, 500);
                    } else {
                        setGameState((prev) => ({
                            ...prev,
                            totalAcorns: initializedData.newTotalAcorns
                        }));
                        if (message.data.nickname === nickName) {
                            setGameState((prev) => ({
                                ...prev,
                                heldAcorns: 0
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error('Save acorns error:', error);
            }
        },
        [setGameState, nickName, navigate, roomId]
    );

    // 결과 조회 처리
    const handleResultResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const initializedData = message.data.results;
                    setGameState((prev) => ({
                        ...prev,
                        results: initializedData
                    }));
                }
            } catch (error) {
                console.error('Result response error:', error);
            }
        },
        [setGameState]
    );

    // 피로도 충전 응답 처리
    const handleChargeFatigueResponse = useCallback(
        (message) => {
            try {
                if (message.success && message.data.nickname === nickName) {
                    const initializedData = message.data;
                    setGameState((prev) => ({
                        ...prev,
                        fatigue: initializedData.userFatigue
                    }));
                }
            } catch (error) {
                console.error('Charge fatigue error:', error);
            }
        },
        [setGameState, nickName]
    );

    // 킬 응답 처리 (중복 처치 방지 및 부수 효과 분리)
    const handleKillResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const data = message.data;
                    setGameState((prev) => {
                        // 이미 처형된 플레이어인지 체크
                        if (prev.killedPlayers.includes(data.victimNickname)) {
                            return prev;
                        }
                        const newKilledPlayers = [...prev.killedPlayers, data.victimNickname];
                        const updates = {
                            ...prev,
                            killedPlayers: newKilledPlayers,
                            killerNickname: data.killerNickname
                        };

                        if (data.killerNickname === nickName) {
                            updates.fatigue = data.killerFatigue;
                        } else if (data.victimNickname === nickName) {
                            updates.isDead = true;
                            updates.isSpectating = true;
                        }

                        // 나쁜 다람쥐 승리 조건 체크
                        if (updates.count - newKilledPlayers.length <= 2) {
                            updates.isGameOver = true;
                            updates.gameOverReason = 'kill';
                            updates.winner = 'bad';
                            updates.isStarted = false;
                        }
                        return updates;
                    });
                    // 상태 업데이트 후, isGameOver 플래그를 감지해 navigate 호출하는 useEffect로 부수 효과 처리 가능
                    // 예시: if (newState.isGameOver) { navigate(`/game/${roomId}/main`); }
                }
            } catch (error) {
                console.error('Kill handling error:', error);
            }
        },
        [setGameState, nickName]
    );

    // 미션 완료 응답 처리
    const handleCompleteMissionResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const initializedData = message.data;
                    const forestNum = initializedData.forestNum;
                    const missionNum = initializedData.missionNum;
                    const missionKey = `${forestNum}_${missionNum}`;

                    setGameState(prev => ({
                        ...prev,
                        [missionKey]: [true, prev[missionKey][1]],
                    }));

                    if (initializedData.nickname === nickName) {
                        setGameState(prev => ({
                            ...prev,
                            fatigue: Math.max(prev.fatigue - 1, 0),
                            heldAcorns: initializedData.userAcorns
                        }));
                    }
                }
            } catch (error) {
                console.error('Complete mission error:', error);
            }
        },
        [nickName, setGameState]
    );

    // 퇴장 응답 처리
    const handleOutResponse = useCallback(
        (message) => {
            try {
                if (message.status) {
                    navigate("/rooms");
                }
            } catch (error) {
                console.error('Out response error:', error);
            }
        },
        [navigate]
    );

    // 긴급 투표 처리 (투표 중복 체크 및 승리 조건 개선)
    const handleVoteResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const data = message.data;
                    setGameState((prev) => {
                        // 이미 투표한 플레이어라면 중복 추가하지 않음
                        const newVotedPlayers = prev.votedPlayers.includes(data.nickname)
                            ? prev.votedPlayers
                            : [...prev.votedPlayers, data.nickname];

                        const updates = {
                            ...prev,
                            [data.nickname]: data.voteNum,
                            votedPlayers: newVotedPlayers,
                            totalVote: data.totalVote,
                        };

                        // 모든 생존자(전체 count에서 killedPlayers 제외)가 투표했는지 확인
                        if (newVotedPlayers.length === updates.count - updates.killedPlayers.length) {
                            const result = endVote(newVotedPlayers);

                            // 동표 처리: result가 falsy이면 투표 상태만 초기화
                            if (!result) {
                                return {
                                    ...updates,
                                    totalVote: 0,
                                    votedPlayers: [],
                                    ...Object.fromEntries(newVotedPlayers.map((p) => [p, 0])),
                                };
                            }

                            // 좋은 다람쥐 승리 조건 (악당 색출 성공)
                            if (result === updates.evilSquirrelNickname) {
                                return {
                                    ...updates,
                                    isGameOver: true,
                                    winner: 'good',
                                    gameOverReason: 'emergency',
                                    isStarted: false,
                                    isVoting: false,
                                    isEmergencyVote: false,
                                    totalVote: 0,
                                    votedPlayers: [],
                                    isPaused: false,
                                    ...Object.fromEntries(newVotedPlayers.map((p) => [p, 0])),
                                };
                            }

                            // 악당 색출 실패: result에 해당하는 플레이어를 처형
                            const newKilledPlayers = prev.killedPlayers.includes(result)
                                ? prev.killedPlayers
                                : [...prev.killedPlayers, result];
                            let updatedState = {
                                ...updates,
                                killedPlayers: newKilledPlayers,
                                isVoting: false,
                                isEmergencyVote: false,
                                totalVote: 0,
                                votedPlayers: [],
                                isPaused: false,
                                ...Object.fromEntries(newVotedPlayers.map((p) => [p, 0])),
                            };

                            if (result === nickName) {
                                updatedState.isDead = true;
                                updatedState.isSpectating = true;
                            }

                            if (updatedState.count - newKilledPlayers.length <= 2) {
                                updatedState = {
                                    ...updatedState,
                                    isGameOver: true,
                                    gameOverReason: 'kill',
                                    winner: 'bad',
                                    isStarted: false,
                                };
                            }
                            return updatedState;
                        }

                        return updates;
                    });
                }
            } catch (error) {
                console.error('Vote handling error:', error);
            }
        },
        [setGameState, nickName, endVote]
    );

    // 최종 투표 처리
    const handleLastVoteResponse = useCallback(
        (message) => {
            try {
                if (message.success) {
                    const data = message.data;
                    setGameState((prev) => {
                        const newVotedPlayers = prev.votedPlayers.includes(data.nickname)
                            ? prev.votedPlayers
                            : [...prev.votedPlayers, data.nickname];

                        const updates = {
                            ...prev,
                            [data.nickname]: data.voteNum,
                            votedPlayers: newVotedPlayers,
                            totalVote: data.totalVote,
                        };

                        if (data.totalVote === updates.count - updates.killedPlayers.length) {
                            const result = endVote(newVotedPlayers);

                            // 나쁜 다람쥐 색출 여부에 따라 승리 처리
                            if (result === updates.evilSquirrelNickname) {
                                updates.isGameOver = true;
                                updates.winner = 'good';
                                updates.gameOverReason = 'time';
                                updates.isStarted = false;
                                for (const player of newVotedPlayers) {
                                    updates[player] = 0;
                                }
                            } else {
                                updates.isGameOver = true;
                                updates.winner = 'bad';
                                updates.gameOverReason = 'time';
                                updates.isStarted = false;
                                for (const player of newVotedPlayers) {
                                    updates[player] = 0;
                                }
                            }
                        }
                        return updates;
                    });
                }
            } catch (error) {
                console.error('Last vote error:', error);
            }
        },
        [setGameState, endVote]
    );

    // 서버시간 동기화
    const handleTimeSyncResponse = useCallback(
        (message) => {
            try {
                if (message) {
                    const now = message.serverTime;
                    setGameState((prev) => {
                        const totalGameTime = prev.hasUsedEmergency ? 300 : 240;
                        return {
                            ...prev,
                            serverTime: now,
                            timer: totalGameTime - Math.floor((now - prev.initServerTime) / 1000)
                        };
                    });
                }
            } catch (error) {
                console.error('Time sync error:', error);
            }
        },
        [setGameState]
    );

    // 부수 효과 분리 예시: 게임 종료 시 navigate 처리 (useEffect)
    useEffect(() => {
        setGameState((state) => {
            if (state.isGameOver) {
                navigate(`/game/${roomId}/main`);
            }
            return state;
        });
    }, [navigate, roomId, setGameState]);

    return {
        handleGameStartResponse,
        handleMoveResponse,
        handleSaveAcornsResponse,
        handleResultResponse,
        handleChargeFatigueResponse,
        handleKillResponse,
        handleCompleteMissionResponse,
        handleOutResponse,
        handleEmergencyResponse,
        handleVoteResponse,
        handleLastVoteResponse,
        handleTimeSyncResponse
    };
};
