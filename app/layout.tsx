import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KLYRO Admin',
  description: 'Control center for KLYRO Store',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F4F5F7] text-[#151515] antialiased">
        {children}
      </body>
    </html>
  );
}
