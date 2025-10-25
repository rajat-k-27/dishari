import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import SessionWrapper from '@/components/SessionWrapper';
import ConditionalLayout from '@/components/ConditionalLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Dishari Cyber Café - Gaming, Browsing & More',
  description: 'Your premier destination for gaming, internet browsing, and cyber café services.',
  keywords: 'cyber café, gaming, internet, browsing, dishari',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        <SessionWrapper>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster position="top-right" />
        </SessionWrapper>
      </body>
    </html>
  );
}
