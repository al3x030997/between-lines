import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BetweenLines — draft2publish',
  description: 'Discover debut authors before they’re published. Join a community of readers and writers.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
