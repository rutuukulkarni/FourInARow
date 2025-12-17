import { useState, useEffect, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { Board, Player } from '../utils/gameLogic';
import { GameStatus } from '../utils/constants';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

interface OnlineGameState {
  board: Board;
  currentPlayer: Player;
  gameStatus: GameStatus;
  winningPositions: Array<{row: number, col: number}>;
  roomId: string | null;
  playerNumber: Player | null;
  isConnected: boolean;
  isWaiting: boolean;
  opponentId: string | null;
}

export const useOnlineGame = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<OnlineGameState>({
    board: Array(6).fill(null).map(() => Array(7).fill(0)),
    currentPlayer: Player.ONE,
    gameStatus: GameStatus.PLAYING,
    winningPositions: [],
    roomId: null,
    playerNumber: null,
    isConnected: false,
    isWaiting: true,
    opponentId: null
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SERVER_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      setGameState(prev => ({ ...prev, isConnected: true }));
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setGameState(prev => ({ ...prev, isConnected: false }));
    });

    newSocket.on('roomCreated', ({ roomId }: { roomId: string }) => {
      setGameState(prev => ({
        ...prev,
        roomId,
        playerNumber: Player.ONE,
        isWaiting: true
      }));
    });

    newSocket.on('roomJoined', ({ roomId, playerNumber }: { roomId: string, playerNumber: number }) => {
      setGameState(prev => ({
        ...prev,
        roomId,
        playerNumber: playerNumber as Player,
        isWaiting: false
      }));
    });

    newSocket.on('gameStart', ({ board, currentPlayer, player1, player2 }: any) => {
      setGameState(prev => ({
        ...prev,
        board,
        currentPlayer: currentPlayer as Player,
        gameStatus: GameStatus.PLAYING,
        isWaiting: false,
        opponentId: prev.playerNumber === Player.ONE ? player2 : player1
      }));
    });

    newSocket.on('moveMade', ({ board, currentPlayer, gameState: gs }: any) => {
      let newGameStatus = GameStatus.PLAYING;
      let winningPositions: Array<{row: number, col: number}> = [];

      if (gs.status === 'win') {
        newGameStatus = GameStatus.WIN;
        // Calculate winning positions (simplified)
        // You might want to enhance this
      } else if (gs.status === 'draw') {
        newGameStatus = GameStatus.DRAW;
      }

      setGameState(prev => ({
        ...prev,
        board,
        currentPlayer: currentPlayer as Player,
        gameStatus: newGameStatus,
        winningPositions
      }));
    });

    newSocket.on('gameReset', ({ board, currentPlayer }: any) => {
      setGameState(prev => ({
        ...prev,
        board,
        currentPlayer: currentPlayer as Player,
        gameStatus: GameStatus.PLAYING,
        winningPositions: []
      }));
    });

    newSocket.on('error', ({ message }: { message: string }) => {
      console.error('Server error:', message);
      alert(message);
    });

    newSocket.on('playerDisconnected', () => {
      alert('Opponent disconnected!');
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const createRoom = useCallback(() => {
    if (socket) {
      socket.emit('createRoom');
    }
  }, [socket]);

  const joinRoom = useCallback((roomId: string) => {
    if (socket) {
      socket.emit('joinRoom', roomId);
    }
  }, [socket]);

  const makeMove = useCallback((col: number) => {
    if (socket && gameState.roomId && gameState.playerNumber) {
      if (gameState.currentPlayer === gameState.playerNumber && gameState.gameStatus === GameStatus.PLAYING) {
        socket.emit('makeMove', {
          roomId: gameState.roomId,
          col,
          player: gameState.playerNumber
        });
      }
    }
  }, [socket, gameState]);

  const resetGame = useCallback(() => {
    if (socket && gameState.roomId) {
      socket.emit('resetGame', gameState.roomId);
    }
  }, [socket, gameState.roomId]);

  return {
    ...gameState,
    createRoom,
    joinRoom,
    makeMove,
    resetGame
  };
};

