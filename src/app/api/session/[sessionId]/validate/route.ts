import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  const { sessionId } = params;
  
  // For now, we'll validate against the server
  // In a real app, you'd check a database
  try {
    const response = await fetch(`http://localhost:8081/session/${sessionId}/validate`);
    const data = await response.json();
    return NextResponse.json({ exists: data.exists });
  } catch (error) {
    // If server is down, assume session doesn't exist
    return NextResponse.json({ exists: false });
  }
}