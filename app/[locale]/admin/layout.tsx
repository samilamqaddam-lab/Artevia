import {redirect} from 'next/navigation';
import {getSupabaseClient} from '@/lib/supabase/server';
import type {ReactNode} from 'react';
import type {Locale} from '@/i18n/settings';

type AdminLayoutProps = {
  children: ReactNode;
  params: {locale: Locale};
};

export default async function AdminLayout({children, params}: AdminLayoutProps) {
  const {locale} = params;
  const supabase = getSupabaseClient();

  // Check authentication
  const {
    data: {user},
    error
  } = await supabase.auth.getUser();

  // Redirect to login if not authenticated
  if (error || !user) {
    redirect(`/${locale}/auth/login?redirectTo=/admin/pricing`);
  }

  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
