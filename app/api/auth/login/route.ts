import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password)
      return NextResponse.json({ success: false, error: 'Username and password required' }, { status: 400 });

    await connectDB();

    // Check MongoDB for stored credentials
    const admin = await Admin.findOne({ username }).lean() as { password: string } | null;

    if (admin) {
      // Use stored password from MongoDB
      if (admin.password !== password) {
        return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
      }
    } else {
      // No record in DB — use default credentials
      if (username !== 'admin' || password !== 'admin123') {
        return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
      }
    }

    return NextResponse.json({ success: true, username });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
