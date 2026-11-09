import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: NextRequest) {
  try {
    const { username, currentPassword, newPassword } = await req.json();

    if (!username || !currentPassword || !newPassword)
      return NextResponse.json({ success: false, error: 'All fields required' }, { status: 400 });

    if (newPassword.length < 6)
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters' }, { status: 400 });

    await connectDB();

    // Find existing admin record
    const admin = await Admin.findOne({ username }).lean() as { password: string } | null;
    const storedPassword = admin ? admin.password : 'admin123';

    // Verify current password
    if (currentPassword !== storedPassword)
      return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 401 });

    if (currentPassword === newPassword)
      return NextResponse.json({ success: false, error: 'New password must be different from current password' }, { status: 400 });

    // Upsert — create or update admin record in MongoDB
    await Admin.findOneAndUpdate(
      { username },
      { username, password: newPassword },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
