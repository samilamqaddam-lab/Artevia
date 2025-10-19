import {NextResponse} from 'next/server';
import {createClient} from '@/lib/supabase/client';
import {uploadAvatar, deleteAvatar} from '@/lib/supabase/storage';
import {logger} from '@/lib/logger';

/**
 * POST /api/profile/avatar - Upload avatar
 */
export async function POST(request: Request) {
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

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json({message: 'Aucun fichier fourni'}, {status: 400});
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({message: 'Le fichier doit être une image'}, {status: 400});
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({message: 'Le fichier ne doit pas dépasser 2 Mo'}, {status: 400});
    }

    // Get current profile to delete old avatar
    const {data: currentProfile} = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (currentProfile?.avatar_url) {
      try {
        await deleteAvatar(currentProfile.avatar_url);
      } catch (error) {
        logger.warn('Failed to delete old avatar:', error);
      }
    }

    // Upload new avatar
    const avatarUrl = await uploadAvatar(file);

    // Update profile with new avatar URL
    const {data: profile, error: updateError} = await supabase
      .from('profiles')
      .update({avatar_url: avatarUrl})
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error updating profile with avatar:', updateError);
      return NextResponse.json({message: 'Erreur lors de la mise à jour du profil'}, {status: 500});
    }

    return NextResponse.json({profile, avatarUrl});
  } catch (error) {
    logger.error('POST /api/profile/avatar error:', error);
    return NextResponse.json({message: 'Une erreur serveur s\'est produite'}, {status: 500});
  }
}

/**
 * DELETE /api/profile/avatar - Delete avatar
 */
export async function DELETE() {
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

    // Get current profile
    const {data: currentProfile} = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (currentProfile?.avatar_url) {
      try {
        await deleteAvatar(currentProfile.avatar_url);
      } catch (error) {
        logger.warn('Failed to delete avatar:', error);
      }
    }

    // Update profile to remove avatar URL
    const {data: profile, error: updateError} = await supabase
      .from('profiles')
      .update({avatar_url: null})
      .eq('id', user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Error removing avatar from profile:', updateError);
      return NextResponse.json({message: 'Erreur lors de la mise à jour du profil'}, {status: 500});
    }

    return NextResponse.json({profile});
  } catch (error) {
    logger.error('DELETE /api/profile/avatar error:', error);
    return NextResponse.json({message: 'Une erreur serveur s\'est produite'}, {status: 500});
  }
}
