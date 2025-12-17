import { useState, useEffect, useCallback } from 'react';
import { supabase, GameRoom } from '../lib/supabase';
import { Board, Player } from '../utils/gameLogic';
import { GameStatus } from '../utils/constants';
import { getBoardState } from '../utils/gameLogic';

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export const useSupabaseGame = () => {
  const [room, setRoom] = useState<GameRoom | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [playerNumber, setPlayerNumber] = useState<Player | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert room board to game state
  const getGameState = useCallback((room: GameRoom | null) => {
    if (!room) {
      return {
        board: Array(6).fill(null).map(() => Array(7).fill(0)) as Board,
        currentPlayer: Player.ONE,
        gameStatus: GameStatus.PLAYING,
        winningPositions: [] as Array<{row: number, col: number}>
      };
    }

    const board = room.board as Board;
    const { winner, isDraw, winningPositions } = getBoardState(board);
    
    let gameStatus = GameStatus.PLAYING;
    if (winner) {
      gameStatus = GameStatus.WIN;
    } else if (isDraw) {
      gameStatus = GameStatus.DRAW;
    }

    return {
      board,
      currentPlayer: room.current_player as Player,
      gameStatus,
      winningPositions: winningPositions || []
    };
  }, []);

  // Create a new room
  const createRoom = useCallback(async () => {
    try {
      const code = generateRoomCode();
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      const { data, error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          player1_id: playerId,
          player2_id: null,
          game_status: 'waiting',
          current_player: 1,
          board: Array(6).fill(null).map(() => Array(7).fill(0))
        })
        .select()
        .single();

      if (error) throw error;

      setRoom(data);
      setRoomCode(code);
      setPlayerNumber(Player.ONE);
      setIsWaiting(true);
      setIsConnected(true);
      setError(null);

      // Subscribe to room updates
      subscribeToRoom(code);
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      console.error('Error creating room:', err);
    }
  }, []);

  // Join an existing room
  const joinRoom = useCallback(async (code: string) => {
    try {
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Check if room exists
      const { data: existingRoom, error: fetchError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', code.toUpperCase())
        .single();

      if (fetchError || !existingRoom) {
        throw new Error('Room not found');
      }

      if (existingRoom.player2_id) {
        throw new Error('Room is full');
      }

      // Join the room
      const { data, error } = await supabase
        .from('game_rooms')
        .update({
          player2_id: playerId,
          game_status: 'playing'
        })
        .eq('room_code', code.toUpperCase())
        .select()
        .single();

      if (error) throw error;

      setRoom(data);
      setRoomCode(code.toUpperCase());
      setPlayerNumber(Player.TWO);
      setIsWaiting(false);
      setIsConnected(true);
      setError(null);

      // Subscribe to room updates
      subscribeToRoom(code.toUpperCase());
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
      console.error('Error joining room:', err);
    }
  }, []);

  // Subscribe to room updates
  const subscribeToRoom = useCallback((code: string) => {
    const channel = supabase
      .channel(`room:${code}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `room_code=eq.${code.toUpperCase()}`
        },
        (payload) => {
          if (payload.new) {
            const updatedRoom = payload.new as GameRoom;
            setRoom(updatedRoom);
            
            // Update waiting state when game is ready
            // Game is ready when both players are present and status is 'playing'
            const gameReady = updatedRoom.player2_id && updatedRoom.game_status === 'playing';
            setIsWaiting(!gameReady);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Make a move
  const makeMove = useCallback(async (col: number) => {
    if (!room || !roomCode || !playerNumber) return;
    
    if (room.current_player !== playerNumber) {
      setError('Not your turn');
      return;
    }

    if (room.game_status !== 'playing') {
      setError('Game is not active');
      return;
    }

    try {
      const board = room.board as Board;
      const { makeMove } = await import('../utils/gameLogic');
      const newBoard = makeMove(board, col, playerNumber as Player);

      if (!newBoard) {
        setError('Invalid move');
        return;
      }

      const { winner, isDraw } = getBoardState(newBoard);
      const nextPlayer = playerNumber === Player.ONE ? Player.TWO : Player.ONE;
      
      const updateData: any = {
        board: newBoard,
        current_player: nextPlayer
      };

      if (winner) {
        updateData.game_status = 'finished';
        updateData.winner = winner;
      } else if (isDraw) {
        updateData.game_status = 'finished';
        updateData.winner = null;
      }

      const { error } = await supabase
        .from('game_rooms')
        .update(updateData)
        .eq('room_code', roomCode);

      if (error) throw error;
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to make move');
      console.error('Error making move:', err);
    }
  }, [room, roomCode, playerNumber]);

  // Reset game
  const resetGame = useCallback(async () => {
    if (!roomCode) return;

    try {
      const { error } = await supabase
        .from('game_rooms')
        .update({
          board: Array(6).fill(null).map(() => Array(7).fill(0)),
          current_player: 1,
          game_status: 'playing',
          winner: null
        })
        .eq('room_code', roomCode);

      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to reset game');
      console.error('Error resetting game:', err);
    }
  }, [roomCode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomCode) {
        const channel = supabase.getChannels().find(ch => ch.topic === `room:${roomCode}`);
        if (channel) {
          supabase.removeChannel(channel);
        }
      }
    };
  }, [roomCode]);

  const gameState = getGameState(room);

  return {
    ...gameState,
    room, // Expose room object for checking player2_id and game_status
    roomCode,
    playerNumber,
    isConnected,
    isWaiting,
    error,
    createRoom,
    joinRoom,
    makeMove,
    resetGame
  };
};

