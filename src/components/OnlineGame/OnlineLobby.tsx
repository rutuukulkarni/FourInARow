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
      <Card className="p-4 sm:p-6 text-center">
        <Users className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-500" />
        <h3 className="text-lg sm:text-xl font-bold mb-2">Room Created! 🎮</h3>
        <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Share this room code with your friend:</p>
        <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4 flex-wrap">
          <code className="bg-gradient-to-r from-blue-100 to-purple-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-mono text-xl sm:text-2xl font-bold text-gray-800 border-2 border-blue-300 break-all">
            {roomCode}
          </code>
          <button
            onClick={copyRoomCode}
            className="p-2.5 sm:p-3 active:bg-gray-100 rounded-lg transition-all border-2 border-gray-200 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Copy room code"
          >
            {copied ? (
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
            ) : (
              <Copy className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            )}
          </button>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 animate-pulse">
          ⏳ Waiting for opponent to join...
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6 text-center">Online Multiplayer</h3>
      
      <div className="space-y-3 sm:space-y-4">
        <Button
          variant="primary"
          onClick={onCreateRoom}
          fullWidth
          size="lg"
          className="min-h-[44px] touch-manipulation"
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Create Room
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-xs sm:text-sm">
            <span className="px-2 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 sm:p-3 flex items-center gap-2 text-red-700">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="text-xs sm:text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <input
            type="text"
            value={joinRoomCode}
            onChange={(e) => setJoinRoomCode(e.target.value.toUpperCase())}
            placeholder="Enter Room Code"
            className="w-full px-3 sm:px-4 py-2.5 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-center text-base sm:text-lg min-h-[44px]"
            maxLength={6}
          />
          <Button
            variant="secondary"
            onClick={() => joinRoomCode && onJoinRoom(joinRoomCode)}
            fullWidth
            disabled={!joinRoomCode || joinRoomCode.length < 4}
            className="min-h-[44px] touch-manipulation"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Join Room
          </Button>
        </div>
      </div>
    </Card>
  );
};

