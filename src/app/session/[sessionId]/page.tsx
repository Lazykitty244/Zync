'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NicknameSetup from '@/components/NicknameSetup';
import MainApp from '../../../components/MainApp';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const [nickname, setNickname] = useState<string | null>(null);
  const [sessionExists, setSessionExists] = useState<boolean | null>(null);
  
  const sessionId = params.sessionId as string;
  
  useEffect(() => {
    // Validate session exists
    fetch(`/api/session/${sessionId}/validate`)
      .then(res => res.json())
      .then(data => setSessionExists(data.exists))
      .catch(() => setSessionExists(false));
  }, [sessionId]);
  
  if (sessionExists === null) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>;
  }
  
  if (sessionExists === false) {
    return <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-2xl font-bold text-red-600">Session Not Found</h1>
      <p>The session "{sessionId}" doesn't exist or has expired.</p>
      <button 
        onClick={() => router.push('/')}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg"
      >
        Create New Session
      </button>
    </div>;
  }
  
  if (!nickname) {
    return <div className="flex items-center justify-center min-h-screen">
      <NicknameSetup onNicknameSet={setNickname} />
    </div>;
  }
  
  return <MainApp sessionId={sessionId} nickname={nickname} />;
}