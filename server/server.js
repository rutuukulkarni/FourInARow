import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Change this to your frontend URL in production
    methods: ["GET", "POST"]
  }
});

// Game rooms storage
const rooms = new Map();

// Game logic helpers
const ROWS = 6;
const COLS = 7;

function createEmptyBoard() {
  return Array(ROWS).fill(null).map(() => Array(COLS).fill(0));
}

function makeMove(board, col, player) {
  const newBoard = board.map(row => [...row]);
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][col] === 0) {
      newBoard[row][col] = player;
      return newBoard;
    }
  }
  return null; // Column full
}

function checkWin(board, player) {
  // Check horizontal
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (board[row][col] === player &&
          board[row][col + 1] === player &&
          board[row][col + 2] === player &&
          board[row][col + 3] === player) {
        return true;
      }
    }
  }

  // Check vertical
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col < COLS; col++) {
      if (board[row][col] === player &&
          board[row + 1][col] === player &&
          board[row + 2][col] === player &&
          board[row + 3][col] === player) {
        return true;
      }
    }
  }

  // Check diagonal (top-left to bottom-right)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 0; col <= COLS - 4; col++) {
      if (board[row][col] === player &&
          board[row + 1][col + 1] === player &&
          board[row + 2][col + 2] === player &&
          board[row + 3][col + 3] === player) {
        return true;
      }
    }
  }

  // Check diagonal (top-right to bottom-left)
  for (let row = 0; row <= ROWS - 4; row++) {
    for (let col = 3; col < COLS; col++) {
      if (board[row][col] === player &&
          board[row + 1][col - 1] === player &&
          board[row + 2][col - 2] === player &&
          board[row + 3][col - 3] === player) {
        return true;
      }
    }
  }

  return false;
}

function checkDraw(board) {
  return board[0].every(cell => cell !== 0);
}

function getGameState(board) {
  if (checkWin(board, 1)) return { status: 'win', winner: 1 };
  if (checkWin(board, 2)) return { status: 'win', winner: 2 };
  if (checkDraw(board)) return { status: 'draw' };
  return { status: 'playing' };
}

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  // Create a new room
  socket.on('createRoom', () => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    rooms.set(roomId, {
      id: roomId,
      players: [socket.id],
      board: createEmptyBoard(),
      currentPlayer: 1,
      status: 'waiting'
    });
    
    socket.join(roomId);
    socket.emit('roomCreated', { roomId });
    console.log(`Room created: ${roomId}`);
  });

  // Join an existing room
  socket.on('joinRoom', (roomId) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.players.length >= 2) {
      socket.emit('error', { message: 'Room is full' });
      return;
    }

    room.players.push(socket.id);
    room.status = 'playing';
    
    socket.join(roomId);
    socket.emit('roomJoined', { roomId, playerNumber: 2 });
    
    // Notify both players that game is starting
    io.to(roomId).emit('gameStart', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      player1: room.players[0],
      player2: room.players[1]
    });
    
    console.log(`Player ${socket.id} joined room ${roomId}`);
  });

  // Make a move
  socket.on('makeMove', ({ roomId, col, player }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    if (room.currentPlayer !== player) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }

    if (room.status !== 'playing') {
      socket.emit('error', { message: 'Game is not active' });
      return;
    }

    const newBoard = makeMove(room.board, col, player);
    
    if (!newBoard) {
      socket.emit('error', { message: 'Invalid move' });
      return;
    }

    room.board = newBoard;
    const gameState = getGameState(newBoard);

    if (gameState.status === 'playing') {
      room.currentPlayer = player === 1 ? 2 : 1;
    } else {
      room.status = 'finished';
    }

    // Broadcast move to all players in room
    io.to(roomId).emit('moveMade', {
      board: room.board,
      currentPlayer: room.currentPlayer,
      gameState: gameState
    });
  });

  // Reset game
  socket.on('resetGame', (roomId) => {
    const room = rooms.get(roomId);
    
    if (!room) return;

    room.board = createEmptyBoard();
    room.currentPlayer = 1;
    room.status = 'playing';

    io.to(roomId).emit('gameReset', {
      board: room.board,
      currentPlayer: room.currentPlayer
    });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Remove player from rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.players.includes(socket.id)) {
        room.players = room.players.filter(id => id !== socket.id);
        
        if (room.players.length === 0) {
          rooms.delete(roomId);
        } else {
          // Notify remaining player
          io.to(roomId).emit('playerDisconnected', { playerId: socket.id });
        }
        break;
      }
    }
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Socket.io server ready for connections`);
});

