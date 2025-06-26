import { useState } from 'react';

interface NicknameSetupProps {
  onNicknameSet: (nickname: string) => void;
  defaultNickname?: string;
}

const FUNNY_ADJECTIVES = ['Groovy', 'Funky', 'Smooth', 'Electric', 'Cosmic', 'Vibrant'];
const MUSIC_NOUNS = ['Beat', 'Rhythm', 'Melody', 'Harmony', 'Tempo', 'Vibe'];

function generateNickname(): string {
  const adj = FUNNY_ADJECTIVES[Math.floor(Math.random() * FUNNY_ADJECTIVES.length)];
  const noun = MUSIC_NOUNS[Math.floor(Math.random() * MUSIC_NOUNS.length)];
  return `${adj}${noun}${Math.floor(Math.random() * 99)}`;
}

export default function NicknameSetup({ onNicknameSet, defaultNickname }: NicknameSetupProps) {
  const [nickname, setNickname] = useState(defaultNickname || generateNickname());
  
  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Choose Your Beat Name</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter nickname"
        />
        <button
          onClick={() => setNickname(generateNickname())}
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          🎲 Random
        </button>
      </div>
      <button
        onClick={() => onNicknameSet(nickname)}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Join the Beat! 🎵
      </button>
    </div>
  );
}