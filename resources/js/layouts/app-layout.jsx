import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';


export default function AppLayout({
  breadcrumbs = [],
  children,
  contentClassName = ''



}) {
  return (
    <AppLayoutTemplate breadcrumbs={breadcrumbs}>
      <div
        className={cn(
          'mx-auto my-6 h-full w-[96%] rounded-lg bg-light shadow-lg dark:bg-dark',
          contentClassName
        )}

      >
        {children}

      </div>
    </AppLayoutTemplate>);

}
