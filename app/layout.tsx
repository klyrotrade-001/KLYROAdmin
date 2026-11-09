import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KLYRO Admin',
  description: 'Control center for KLYRO Store',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
      </head>
      <body className="min-h-screen bg-[#F4F5F7] text-[#151515] antialiased">
        {children}
      </body>
    </html>
  );
}
