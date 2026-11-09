import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F4F5F7] flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-7xl font-black text-[#005E23]">404</p>
        <h1 className="text-xl font-black text-[#151515] mt-2">Page Not Found</h1>
        <p className="text-sm text-[#777777] mt-2">This admin page does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-[#005E23] px-6 py-3 text-sm font-bold text-white hover:bg-[#004719]">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
