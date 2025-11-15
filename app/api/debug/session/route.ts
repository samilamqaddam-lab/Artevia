import {NextResponse} from 'next/server';
import {getSupabaseClient} from '@/lib/supabase/server';

/**
 * DEBUG ENDPOINT - Session diagnostics
 * GET /api/debug/session
 */
export async function GET(request: Request) {
  try {
    const supabase = getSupabaseClient();

    // Check session
    const {
      data: {session},
      error: sessionError
    } = await supabase.auth.getSession();

    // Check user
    const {
      data: {user},
      error: userError
    } = await supabase.auth.getUser();

    // Try to get role if user exists
    let roleData = null;
    let roleError = null;

    if (user) {
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const result = await supabase.rpc('get_user_role_debug' as any, {
        user_id_param: user.id
      } as any);
      /* eslint-enable @typescript-eslint/no-explicit-any */

      roleData = result.data;
      roleError = result.error;
    }

    return NextResponse.json({
      session: {
        exists: !!session,
        user_id: session?.user?.id || null,
        email: session?.user?.email || null,
        expires_at: session?.expires_at || null,
        error: sessionError?.message || null
      },
      user: {
        exists: !!user,
        id: user?.id || null,
        email: user?.email || null,
        error: userError?.message || null
      },
      role: {
        data: roleData,
        error: roleError?.message || null
      },
      headers: {
        cookie: request.headers.get('cookie') ? 'Present' : 'Missing',
        authorization: request.headers.get('authorization') ? 'Present' : 'Missing'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      {status: 500}
    );
  }
}
