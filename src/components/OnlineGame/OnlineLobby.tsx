import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { Users, UserPlus, Copy, Check, AlertCircle } from 'lucide-react';

interface OnlineLobbyProps {
  roomCode: string | null;
  isWaiting: boolean;
  error: string | null;
  onCreateRoom: () => void;
  onJoinRoom: (roomCode: string) => void;
}

export const OnlineLobby: React.FC<OnlineLobbyProps> = ({
  roomCode,
  isWaiting,
  error,
  onCreateRoom,
  onJoinRoom
}) => {
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (roomCode && isWaiting) {
    return (
      <Card className="p-6 text-center">
        <Users className="w-12 h-12 mx-auto mb-4 text-blue-500" />
        <h3 className="text-xl font-bold mb-2">Room Created! 🎮</h3>
        <p className="text-gray-600 mb-4">Share this room code with your friend:</p>
        <div className="flex items-center justify-center gap-2 mb-4">
          <code className="bg-gradient-to-r from-blue-100 to-purple-100 px-6 py-3 rounded-lg font-mono text-2xl font-bold text-gray-800 border-2 border-blue-300">
            {roomCode}
          </code>
          <button
            onClick={copyRoomCode}
            className="p-3 hover:bg-gray-100 rounded-lg transition-all border-2 border-gray-200"
            title="Copy room code"
          >
            {copied ? (
              <Check className="w-6 h-6 text-green-500" />
            ) : (
              <Copy className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-sm text-gray-500 animate-pulse">
          ⏳ Waiting for opponent to join...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6 text-center">Online Multiplayer</h3>
      
      <div className="space-y-4">
        <Button
          variant="primary"
          onClick={onCreateRoom}
          fullWidth
          size="lg"
        >
          <Users className="w-5 h-5 mr-2" />
          Create Room
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <input
            type="text"
            value={joinRoomCode}
            onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter Room Code (e.g., ABC123)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-lg"
            maxLength={6}
          />
          <Button
            variant="secondary"
            onClick={() => joinRoomCode && onJoinRoom(joinRoomCode)}
            fullWidth
            disabled={!joinRoomCode || joinRoomCode.length < 4}
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Join Room
          </Button>
        </div>
      </div>
    </Card>
  );
};

