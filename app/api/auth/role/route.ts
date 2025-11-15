import {NextResponse} from 'next/server';
import {getSupabaseClient} from '@/lib/supabase/server';

/**
 * GET /api/auth/role
 * Returns the current user's role
 */
export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Check authentication
    const {
      data: {user},
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({role: null, isAdmin: false});
    }

    // Try to get role from database using the debug RPC function (bypasses RLS issues)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {data: roleData, error: roleError} = await supabase.rpc(
      'get_user_role_debug' as any,
      {user_id_param: user.id} as any
    );

    if (roleError || !roleData || roleData.length === 0) {
      // No role found
      return NextResponse.json({
        role: null,
        isAdmin: false,
        userId: user.id
      });
    }

    const role = roleData[0].role;
    const isAdmin = role === 'super_admin' || role === 'admin';

    return NextResponse.json({
      role,
      isAdmin,
      userId: user.id
    });
  } catch (error) {
    console.error('Error fetching user role:', error);
    return NextResponse.json(
      {role: null, isAdmin: false, error: 'Internal server error'},
      {status: 500}
    );
  }
}
