'use client';

import AdminNavbar from '@/components/AdminNavbar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  // Don't show AdminNavbar on login page
  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <main>{children}</main>
    </div>
  );
}
