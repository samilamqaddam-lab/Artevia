import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/client';
import {logger} from '@/lib/logger';
import {z} from 'zod';

const ProfileUpdateSchema = z.object({
  full_name: z.string().optional(),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  locale: z.enum(['fr', 'ar']).optional()
});

/**
 * GET /api/profile - Get current user's profile
 */
export async function GET() {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({message: 'Non authentifié'}, {status: 401});
    }

    // Fetch profile
    const {data: profile, error: fetchError} = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (fetchError) {
      logger.error('Error fetching profile:', fetchError);
      return NextResponse.json({message: 'Erreur lors de la récupération du profil'}, {status: 500});
    }

    return NextResponse.json({profile});
  } catch (error) {
    logger.error('GET /api/profile error:', error);
    return NextResponse.json({message: 'Erreur serveur'}, {status: 500});
  }
}

/**
 * PATCH /api/profile - Update current user's profile
 */
export async function PATCH(request: Request) {
  try {
    const supabase = createClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({message: 'Non authentifié'}, {status: 401});
    }

    const body = await request.json();

    // Validate request data
    const validatedData = ProfileUpdateSchema.parse(body);

    // Update profile
    const {data: profile, error: updateError} = await supabase
      .from('profiles')
      .update(validatedData)
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating profile:', updateError);
      return NextResponse.json({message: 'Erreur lors de la mise à jour du profil'}, {status: 500});
    }

    return NextResponse.json({profile});
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      logger.warn('Invalid profile update data:', error.issues);
      return NextResponse.json(
        {
          message: 'Données invalides',
          errors: error.issues.map((err) => ({
            path: err.path.join('.'),
            message: err.message
          }))
        },
        {status: 400}
      );
    }

    // Handle unexpected errors
    logger.error('PATCH /api/profile error:', error);
    return NextResponse.json({message: 'Une erreur serveur s\'est produite'}, {status: 500});
  }
}
