import { useState, useEffect, useCallback } from 'react';
import { supabase, GameRoom } from '../lib/supabase';
import { Board, Player, getBoardState, makeMove as makeGameMove } from '../utils/gameLogic';
import { GameStatus } from '../utils/constants';

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
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('disconnected');

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

  // Fetch room state manually (polling fallback)
  const fetchRoomState = useCallback(async (code: string) => {
    const roomCodeUpper = code.toUpperCase();
    try {
      const { data, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCodeUpper)
        .single();

      if (error) {
        console.error('❌ Error fetching room state:', error);
        return null;
      }

      if (data) {
        console.log('📋 Fetched room state:', data);
        setRoom(data);
        const gameReady = data.player2_id && data.game_status === 'playing';
        setIsWaiting(!gameReady);
        if (gameReady) {
          setError(null);
        }
        return data;
      }
      return null;
    } catch (err) {
      console.error('❌ Error in fetchRoomState:', err);
      return null;
    }
  }, []);

  // Subscribe to room updates - MUST be defined before createRoom/joinRoom
  const subscribeToRoom = useCallback((code: string) => {
    const roomCodeUpper = code.toUpperCase();
    
    // Remove any existing subscription for this room
    const existingChannels = supabase.getChannels().filter(ch => 
      ch.topic?.includes(`room:${roomCodeUpper}`) || ch.topic === `room:${roomCodeUpper}`
    );
    existingChannels.forEach(ch => supabase.removeChannel(ch));

    console.log(`🔌 Subscribing to room: ${roomCodeUpper}`);
    setSubscriptionStatus('connecting');

    const channel = supabase
      .channel(`room:${roomCodeUpper}`, {
        config: {
          broadcast: { self: true }
        }
      })
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'game_rooms',
          filter: `room_code=eq.${roomCodeUpper}`
        },
        (payload) => {
          console.log('📨 Real-time update received:', payload);
          if (payload.new) {
            const updatedRoom = payload.new as GameRoom;
            console.log('✅ Room updated via real-time:', updatedRoom);
            console.log('  - player2_id:', updatedRoom.player2_id);
            console.log('  - game_status:', updatedRoom.game_status);
            setRoom(updatedRoom);
            
            // Update waiting state when game is ready
            const gameReady = updatedRoom.player2_id && updatedRoom.game_status === 'playing';
            console.log('  - gameReady:', gameReady);
            setIsWaiting(!gameReady);
            
            // Clear error if game is ready
            if (gameReady) {
              setError(null);
            }
          } else if (payload.old) {
            console.log('⚠️ Room deleted or changed:', payload.old);
          }
        }
      )
      .subscribe((status, err) => {
        console.log(`📡 Subscription status for ${roomCodeUpper}:`, status);
        setSubscriptionStatus(status);
        
        if (err) {
          console.error('❌ Subscription error:', err);
          setError(`Connection error: ${err.message}`);
          setIsConnected(false);
        }
        
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to room updates');
          setIsConnected(true);
          // Fetch current room state after subscribing
          fetchRoomState(roomCodeUpper);
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Channel error - Real-time may not be enabled');
          setError('Real-time connection failed. Using polling fallback...');
          setIsConnected(false);
          // Start polling as fallback
          startPolling(roomCodeUpper);
        } else if (status === 'TIMED_OUT') {
          console.error('❌ Subscription timed out - Using polling fallback');
          setError('Connection timed out. Using polling fallback...');
          setIsConnected(false);
          // Start polling as fallback
          startPolling(roomCodeUpper);
        } else if (status === 'CLOSED') {
          console.warn('⚠️ Channel closed');
          setIsConnected(false);
        }
      });

    return () => {
      console.log(`🔌 Unsubscribing from room: ${roomCodeUpper}`);
      supabase.removeChannel(channel);
    };
  }, [fetchRoomState]);

  // Polling fallback when real-time fails
  const startPolling = useCallback((code: string) => {
    console.log('🔄 Starting polling fallback for room:', code);
    const intervalId = setInterval(() => {
      fetchRoomState(code);
    }, 2000); // Poll every 2 seconds

    // Store interval ID for cleanup
    return () => {
      clearInterval(intervalId);
      console.log('🛑 Stopped polling for room:', code);
    };
  }, [fetchRoomState]);

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

      // Subscribe FIRST to get real-time updates
      subscribeToRoom(code);

      setRoom(data);
      setRoomCode(code);
      setPlayerNumber(Player.ONE);
      setIsWaiting(true);
      setIsConnected(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to create room');
      console.error('❌ Error creating room:', err);
    }
  }, [subscribeToRoom]);

  // Join an existing room
  const joinRoom = useCallback(async (code: string) => {
    try {
      const playerId = `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const roomCodeUpper = code.toUpperCase();
      
      // Check if room exists first
      const { data: existingRoom, error: fetchError } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', roomCodeUpper)
        .single();

      if (fetchError || !existingRoom) {
        throw new Error('Room not found');
      }

      // Check if room is already full
      if (existingRoom.player2_id) {
        // Subscribe and set room so they can see/watch the game
        subscribeToRoom(roomCodeUpper);
        setRoom(existingRoom);
        setRoomCode(roomCodeUpper);
        setPlayerNumber(Player.TWO);
        setIsWaiting(false);
        setIsConnected(true);
        setError('Room is already full. You can watch the game.');
        return;
      }

      // Subscribe FIRST to get real-time updates
      subscribeToRoom(roomCodeUpper);

      // Try to join the room atomically
      const { data, error } = await supabase
        .from('game_rooms')
        .update({
          player2_id: playerId,
          game_status: 'playing'
        })
        .eq('room_code', roomCodeUpper)
        .is('player2_id', null) // Only update if player2_id is still null (prevents race condition)
        .select()
        .single();

      if (error) {
        // If update failed, check if someone else joined
        const { data: checkRoom } = await supabase
          .from('game_rooms')
          .select('*')
          .eq('room_code', roomCodeUpper)
          .single();
        
        if (checkRoom?.player2_id) {
          // Room was taken, but set it up anyway so they can watch
          setRoom(checkRoom);
          setRoomCode(roomCodeUpper);
          setPlayerNumber(Player.TWO);
          setIsWaiting(false);
          setIsConnected(true);
          setError('Room was just filled. You can watch the game.');
          return;
        }
        throw error;
      }

      if (!data) {
        throw new Error('Failed to join room. Please try again.');
      }

      setRoom(data);
      setRoomCode(roomCodeUpper);
      setPlayerNumber(Player.TWO);
      setIsWaiting(false);
      setIsConnected(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to join room');
      console.error('❌ Error joining room:', err);
    }
  }, [subscribeToRoom]);

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
      const newBoard = makeGameMove(board, col, playerNumber as Player);

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

  // Polling fallback effect - only poll if real-time is not connected
  useEffect(() => {
    if (!roomCode || subscriptionStatus === 'SUBSCRIBED') return; // Don't poll if real-time is working
    
    console.log('🔄 Setting up polling fallback for room:', roomCode);
    const cleanup = startPolling(roomCode);
    
    return cleanup;
  }, [roomCode, subscriptionStatus, startPolling]);

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

  // Manual refresh function
  const refreshRoom = useCallback(async () => {
    if (!roomCode) return;
    console.log('🔄 Manually refreshing room state...');
    await fetchRoomState(roomCode);
  }, [roomCode, fetchRoomState]);

  return {
    ...gameState,
    room, // Expose room object for checking player2_id and game_status
    roomCode,
    playerNumber,
    isConnected,
    isWaiting,
    error,
    subscriptionStatus,
    createRoom,
    joinRoom,
    makeMove,
    resetGame,
    refreshRoom
  };
};

