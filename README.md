# 🌾 AgroERP — KrushiCare Agriculture Management System

India's smartest digital ERP for **Krushi Seva Kendras** and agriculture retail businesses.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start the Backend

```bash
cd server
cp .env.example .env    # Edit with your MongoDB URI and secrets
npm run dev             # Runs on http://localhost:5000
```

### 2. Start the Frontend

```bash
cd client
npm run dev             # Runs on http://localhost:5173
```

### 3. Demo Login (no backend needed)

The frontend includes demo data and works with demo login buttons on the login page.

---

## 📦 Tech Stack

| Layer       | Technology                              |
|-------------|----------------------------------------|
| Frontend    | React 18 + Vite + Tailwind CSS v4      |
| State       | Zustand + React Hook Form              |
| Charts      | Recharts                               |
| Backend     | Node.js + Express.js                   |
| Database    | MongoDB + Mongoose                     |
| Auth        | JWT + bcryptjs                         |
| Security    | Helmet + Rate Limiting + CORS          |

---

## 🧩 Modules

| # | Module | Features |
|---|--------|----------|
| 1 | Authentication | Login, Register, Forgot Password, JWT RBAC |
| 2 | Dashboard | KPI cards, charts, alerts (3 role-based views) |
| 3 | Products | CRUD, expiry tracking, batch numbers, categories |
| 4 | Inventory | Stock in/out, level charts, low stock alerts |
| 5 | Billing (POS) | Cart, GST calc, invoice, print |
| 6 | Bill History | Invoice list, filter by status/payment |
| 7 | Customers | Farmer profiles, purchase history, land details |
| 8 | Udhari | Credit ledger, partial payments, progress tracking |
| 9 | Analytics | Sales area chart, top products, monthly profit |
| 10 | Weather | Current weather, 5-day forecast, crop suggestions |
| 11 | Notifications | Expiry/stock/udhari alerts, mark read, delete |
| 12 | Employees | Attendance, roles, salary, add/remove |
| 13 | Subscription | 3-tier plans (Starter/Pro/Enterprise) |
| 14 | Settings | Shop info, notification prefs, password change |

---

## 🔐 User Roles

| Role | Access |
|------|--------|
| `superadmin` | Platform-wide management |
| `admin` | Full shop management |
| `user` | Billing + product view |

---

## 📁 Project Structure

```
Agri/
├── client/          # React + Vite frontend
│   └── src/
│       ├── components/    # KPICard, DataTable, Modal, Badge, etc.
│       ├── layouts/       # AuthLayout, DashboardLayout
│       ├── pages/         # All 14 pages
│       ├── services/      # Axios API wrappers
│       └── store/         # Zustand stores
├── server/          # Node.js + Express backend
│   ├── controllers/ # Business logic
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express routers
│   ├── middleware/  # JWT, RBAC, error handler
│   └── utils/       # Token generator, helpers
└── README.md
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register shop |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/products` | List products |
| POST | `/api/products` | Create product |
| POST | `/api/bills` | Create bill |
| GET | `/api/bills` | List bills |
| GET | `/api/customers` | List customers |
| GET | `/api/analytics/sales` | Sales analytics |
| GET | `/api/analytics/dashboard` | Dashboard stats |

---

## ⚙️ Environment Variables

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
OPENWEATHER_API_KEY=your_key (for live weather)
CLIENT_URL=http://localhost:5173
```

---

*Built with ❤️ for Indian agriculture — AgroERP v1.0*
