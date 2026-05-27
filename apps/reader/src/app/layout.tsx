import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { CartProvider } from '@/lib/cart';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BetweenReads — Read',
  description: 'For serious readers and serious writers. Read the work, leave a mark, earn your way deeper.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
