import {NextResponse} from 'next/server';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  const body = await request.json();
  await delay(400);
  return NextResponse.json({
    id: `BAT-${Date.now()}`,
    status: 'generated',
    preview: body?.previewDataUrl ?? null,
    generatedAt: new Date().toISOString()
  });
}
