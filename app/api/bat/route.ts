import {NextResponse} from 'next/server';
import {BATSchema} from '@/types/api-validation';
import {logger} from '@/lib/logger';
import {z} from 'zod';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request data
    const validatedData = BATSchema.parse(body);

    // Simulate processing delay
    await delay(400);

    return NextResponse.json({
      id: `BAT-${Date.now()}`,
      status: 'generated',
      preview: validatedData.previewDataUrl ?? null,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      logger.warn('Invalid BAT request data:', error.errors);
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        {status: 400}
      );
    }

    // Handle unexpected errors
    logger.error('BAT API error:', error);
    return NextResponse.json(
      {message: 'Une erreur serveur s\'est produite'},
      {status: 500}
    );
  }
}
