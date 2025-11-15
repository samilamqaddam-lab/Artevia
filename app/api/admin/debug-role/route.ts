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

    // Step 2: Try to fetch role from database
    const {data: roleData, error: roleError} = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (roleError) {
      return NextResponse.json({
        step: 'role_fetch',
        success: false,
        user: {
          id: user.id,
          email: user.email
        },
        error: roleError.message,
        details: roleError,
        hint: 'RLS policy might be blocking access'
      });
    }

    // Step 3: Try to fetch role using raw SQL (bypasses RLS for diagnosis)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const {data: rawRoleData, error: rawRoleError} = await supabase.rpc(
      'get_user_role_debug' as any,
      {user_id_param: user.id} as any
    );
    /* eslint-enable @typescript-eslint/no-explicit-any */

    return NextResponse.json({
      step: 'complete',
      success: true,
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      },
      role_via_rls: roleData,
      role_via_rpc: rawRoleData,
      rpc_error: rawRoleError?.message || null
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
