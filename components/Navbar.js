'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Services', path: '/services' },
  { name: 'Shop', path: '/shop' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const pathname = usePathname();

  // Pages that should always have solid navbar
  const solidNavbarPages = ['/cart', '/checkout', '/shop', '/about', '/services', '/contact', '/profile', '/auth/signin'];
  const shouldUseSolidNavbar = solidNavbarPages.some(page => pathname.startsWith(page)) || pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartItemCount = getTotalItems();

  // Determine if navbar should be solid
  const isNavbarSolid = scrolled || shouldUseSolidNavbar;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        isNavbarSolid
          ? 'bg-white shadow-lg py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">D</span>
              </div>
              <span
                className={`text-2xl font-bold ${
                  isNavbarSolid ? 'text-gray-900' : 'text-white'
                }`}
              >
                Dishari
              </span>
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative cursor-pointer transition-colors ${
                    pathname === link.path
                      ? 'text-primary-600 font-semibold'
                      : isNavbarSolid
                      ? 'text-gray-700 hover:text-primary-600'
                      : 'text-white hover:text-primary-300'
                  }`}
                >
                  {link.name}
                  {pathname === link.path && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600"
                    />
                  )}
                </motion.span>
              </Link>
            ))}
          </div>

          {/* Cart & User Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Cart - Show for logged in users only */}
            {session?.user ? (
              <Link href="/cart">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative cursor-pointer"
                >
                  <FaShoppingCart
                    className={`text-2xl ${
                      isNavbarSolid ? 'text-gray-700' : 'text-white'
                    }`}
                  />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            ) : (
              <button
                onClick={() => {
                  toast.error('Please login to view cart');
                  window.location.href = '/auth/signin?callbackUrl=/cart';
                }}
                className="relative cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaShoppingCart
                    className={`text-2xl ${
                      isNavbarSolid ? 'text-gray-700' : 'text-white'
                    }`}
                  />
                </motion.div>
              </button>
            )}

            {/* User Menu - Login/Register/Logout */}
            <div className="relative">
              {session?.user ? (
                <div className="flex items-center space-x-3">
                  {/* User Avatar & Name - Clickable to Profile */}
                  <Link href="/profile">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-2 rounded-full shadow-lg cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-bold text-sm">
                          {session.user.name?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="text-white font-semibold text-sm">
                        {session.user.name || session.user.email}
                      </span>
                    </motion.div>
                  </Link>

                  {/* Logout Button */}
                  <motion.button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors border border-gray-300"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="relative"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2"
                    >
                      <FaUser
                        className={`text-xl ${
                          isNavbarSolid ? 'text-gray-700' : 'text-white'
                        }`}
                      />
                      <span className={`text-sm ${
                        isNavbarSolid ? 'text-gray-700' : 'text-white'
                      }`}>Account</span>
                    </motion.div>
                  </button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <Link
                          href="/auth/signin?screen=signup"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="px-4 py-2 hover:bg-primary-50 cursor-pointer flex items-center space-x-2">
                            <FaUser className="text-primary-600" />
                            <span className="text-gray-700">Register</span>
                          </div>
                        </Link>
                        <Link
                          href="/auth/signin"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div className="px-4 py-2 hover:bg-primary-50 cursor-pointer flex items-center space-x-2">
                            <FaUser className="text-primary-600" />
                            <span className="text-gray-700">Login</span>
                          </div>
                        </Link>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden"
          >
            {isOpen ? (
              <FaTimes
                className={`text-2xl ${
                  isNavbarSolid ? 'text-gray-700' : 'text-white'
                }`}
              />
            ) : (
              <FaBars
                className={`text-2xl ${
                  isNavbarSolid ? 'text-gray-700' : 'text-white'
                }`}
              />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="flex flex-col space-y-4 p-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block text-lg ${
                        pathname === link.path
                          ? 'text-primary-600 font-semibold'
                          : 'text-gray-700'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex flex-col space-y-4 pt-4 border-t">
                  {/* Cart Link */}
                  {session?.user ? (
                    <Link href="/cart" onClick={() => setIsOpen(false)}>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <FaShoppingCart className="text-2xl text-gray-700" />
                          {cartItemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                              {cartItemCount}
                            </span>
                          )}
                        </div>
                        <span className="text-gray-700">Cart</span>
                      </div>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        toast.error('Please login to view cart');
                        setIsOpen(false);
                        window.location.href = '/auth/signin?callbackUrl=/cart';
                      }}
                      className="flex items-center space-x-3 text-left"
                    >
                      <FaShoppingCart className="text-2xl text-gray-700" />
                      <span className="text-gray-700">Cart (Login Required)</span>
                    </button>
                  )}

                  {/* User Menu */}
                  {session?.user ? (
                    <div className="space-y-3">
                      {/* User Info - Clickable to Profile */}
                      <Link href="/profile" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3 bg-gradient-to-r from-primary-500 to-primary-600 px-4 py-3 rounded-lg cursor-pointer hover:from-primary-600 hover:to-primary-700 transition-colors">
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                            <span className="text-primary-600 font-bold">
                              {session.user.name?.charAt(0).toUpperCase() || 'U'}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-semibold">
                              {session.user.name || 'User'}
                            </div>
                            <div className="text-white/80 text-xs">
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          signOut({ callbackUrl: '/' });
                        }}
                        className="w-full flex items-center space-x-3 text-left bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors border border-gray-300"
                      >
                        <FaUser className="text-xl" />
                        <span className="font-semibold">Logout</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <Link href="/auth/signin?screen=signup" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3">
                          <FaUser className="text-xl text-gray-700" />
                          <span className="text-gray-700">Register</span>
                        </div>
                      </Link>
                      <Link href="/auth/signin" onClick={() => setIsOpen(false)}>
                        <div className="flex items-center space-x-3">
                          <FaUser className="text-xl text-gray-700" />
                          <span className="text-gray-700">Login</span>
                        </div>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
