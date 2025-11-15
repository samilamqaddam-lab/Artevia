import {NextResponse} from 'next/server';
import {getSupabaseClient} from '@/lib/supabase/server';

/**
 * DEBUG ENDPOINT - To be removed after troubleshooting
 * GET /api/admin/debug-role
 * Returns detailed information about the current user's authentication and role
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Step 1: Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError) {
      return NextResponse.json({
        step: 'auth',
        success: false,
        error: authError.message,
        details: authError
      });
    }

    if (!user) {
      return NextResponse.json({
        step: 'auth',
        success: false,
        error: 'No user found'
      });
    }

    // Step 2: Fetch role using RPC function (bypasses type issues)
    const {data: roleData, error: roleError} = await supabase.rpc(
      'get_user_role_debug',
      {user_id_param: user.id}
    );

    return NextResponse.json({
      step: 'complete',
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      role: roleData,
      role_error: roleError?.message || null
    });
  } catch (error) {
    return NextResponse.json(
      {
        step: 'exception',
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      {status: 500}
    );
  }
}
