import AdminDashboard from '../components/AdminDashboard';
import AuthGuard from '../components/AuthGuard';

export default function AdminHomePage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  );
}

