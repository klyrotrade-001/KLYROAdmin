# 🚀 Starting KLYRO Admin Panel

## Step-by-Step Guide

### 1️⃣ Start Backend Server (Port 5001)
Open **Terminal 1**:
```bash
cd /Users/master/Documents/KLYRO/KLYRO.web/backend
npm run dev
```

You should see:
```
===============================================
 KLYRO Backend Server active on port 5001
 Base URL: http://localhost:5001
 Health:   http://localhost:5001/api/health
===============================================
```

---

### 2️⃣ Start Admin Panel (Port 3001)
Open **Terminal 2**:
```bash
cd /Users/master/Documents/KLYRO/KLYRO.web/admin
npm run dev
```

Wait for:
```
✓ Ready in X.Xs
○ Local:        http://localhost:3001
```

---

### 3️⃣ Access Admin Panel

**Login Page**: http://localhost:3001/login

**Credentials**:
- Username: `admin`
- Password: `admin123`

**After Login**: You'll be redirected to http://localhost:3001/ (Dashboard)

---

## 🔧 Troubleshooting

### Problem: Port 5001 in use
```bash
lsof -i :5001 | grep LISTEN | awk '{print $2}' | xargs kill -9
cd /Users/master/Documents/KLYRO/KLYRO.web/backend
npm run dev
```

### Problem: Port 3001 in use
```bash
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9
cd /Users/master/Documents/KLYRO/KLYRO.web/admin
npm run dev
```

### Problem: Login page 404 error
Make sure you're accessing:
- ✅ `http://localhost:3001/login` (CORRECT)
- ❌ NOT `http://localhost:3001/admin/login` (WRONG)

If still not working:
```bash
cd /Users/master/Documents/KLYRO/KLYRO.web/admin
rm -rf .next
npm run dev
```

---

## 📁 File Structure
```
admin/
├── app/
│   ├── login/
│   │   └── page.tsx          ← Login Page
│   ├── page.tsx               ← Dashboard (Protected)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── AuthGuard.tsx          ← Auth Protection
│   ├── AdminDashboard.tsx
│   └── AdminSidebar.tsx       ← Has Logout Button
└── package.json
```

---

## 🎯 URLs Reference

| Service | URL | Port |
|---------|-----|------|
| Admin Login | http://localhost:3001/login | 3001 |
| Admin Dashboard | http://localhost:3001/ | 3001 |
| Backend API | http://localhost:5001/api/health | 5001 |
| Main Store | http://localhost:3000/ | 3000 |

---

## ✨ Features

- ✅ Login page with authentication
- ✅ Protected dashboard routes
- ✅ Logout button in sidebar
- ✅ Session management with localStorage
- ✅ Auto-redirect if not authenticated

---

## 🔐 Security Note

This is a **demo authentication** using localStorage. For production:
- Implement backend authentication API
- Use JWT tokens
- Add password hashing (bcrypt)
- Implement session management
- Add HTTPS
- Add rate limiting
