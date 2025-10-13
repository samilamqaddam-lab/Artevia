import {Header} from './Header';
import {Footer} from './Footer';
import {MigrationBanner} from '@/components/MigrationBanner';

export function SiteShell({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 transition-colors duration-200 dark:bg-[#0f0f0f] dark:text-slate-100">
      <Header />
      <MigrationBanner />
      <main id="main" tabIndex={-1} className="flex-1" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
