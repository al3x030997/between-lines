import type { Metadata } from 'next'
import { Crimson_Pro, DM_Sans } from 'next/font/google'
import { SessionProvider } from '@/context/SessionContext'
import { ToastProvider } from '@/context/ToastContext'
import Sidebar from '@/components/layout/Sidebar'
import './globals.css'

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'agent-list — Track every query you send',
  description:
    'Replace your spreadsheet. Track query letters, materials versions, and responses in one place.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${dmSans.variable}`}>
      <body className="font-[family-name:var(--font-body)] min-h-screen">
        <ToastProvider>
          <SessionProvider>
            <Sidebar>{children}</Sidebar>
          </SessionProvider>
        </ToastProvider>
      </body>
    </html>
  )
}
