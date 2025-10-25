'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaBox, FaShoppingCart, FaEnvelope, FaHome, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';

const adminLinks = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
  { name: 'Products', path: '/admin/products', icon: FaBox },
  { name: 'Orders', path: '/admin/orders', icon: FaShoppingCart },
  { name: 'Contacts', path: '/admin/contacts', icon: FaEnvelope },
];

export default function AdminNavbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <FaUserShield className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dishari Admin</h1>
              <p className="text-xs text-gray-400">Management Panel</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              
              return (
                <Link key={link.path} href={link.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="text-lg" />
                    <span className="font-medium">{link.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Admin Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* Admin Avatar & Name */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-2 bg-primary-600 px-4 py-2 rounded-full"
            >
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-bold text-sm">
                  {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                </span>
              </div>
              <div>
                <div className="text-white font-semibold text-sm">
                  {session?.user?.name || 'Admin'}
                </div>
                <div className="text-white/70 text-xs">Administrator</div>
              </div>
            </motion.div>

            {/* Logout Button */}
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
            >
              <FaSignOutAlt />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {adminLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.path;
              
              return (
                <Link key={link.path} href={link.path}>
                  <motion.div
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm ${
                      isActive
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon />
                    <span>{link.name}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
