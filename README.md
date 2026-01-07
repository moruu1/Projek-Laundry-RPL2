# 🧺 Apik Laundry - Sistem Manajemen Laundry

Aplikasi web untuk manajemen laundry yang modern dan user-friendly, dikembangkan sebagai project Praktikum Pemrograman Lanjut (PPPL).

## 📋 Deskripsi

Apik Laundry adalah sistem manajemen laundry berbasis web yang memungkinkan pelanggan untuk memesan layanan laundry, melacak status pesanan, dan berkomunikasi dengan admin melalui chatbot. Sistem ini juga menyediakan dashboard untuk admin dan owner untuk mengelola pesanan, pelanggan, inventori, dan laporan keuangan.

## ✨ Fitur Utama

### 👤 Customer (Pelanggan)
- **Home Dashboard**: Ringkasan pesanan dan layanan
- **Kelola Pesanan**: Melihat history dan status pesanan
- **Layanan**: Informasi lengkap tentang layanan laundry
- **Lacak Pesanan**: Tracking real-time status pesanan
- **Profil**: Edit profil dan ubah password
- **Chat Widget (Tanya Apik)**: AI Chatbot dengan TF-IDF & Cosine Similarity untuk menjawab FAQ

### 👨‍💼 Admin
- **Dashboard**: Overview statistik dan pesanan
- **Kelola Pesanan**: CRUD pesanan dengan status management
- **Kelola Pelanggan**: Database pelanggan dengan fitur search dan filter
- **Inventori**: Manajemen stok barang dan bahan
- **Laporan Keuangan**: Transaksi dan pemasukan dengan filter tanggal
- **Profil & Keamanan**: Edit profil dan ubah password

### 👔 Owner
- **Dashboard**: Analytics dan key performance indicators
- **Laporan**: Laporan keuangan dan operasional
- **Inventori**: Monitoring stok dan pembelian
- **Prediksi**: 
  - Linear Regression untuk forecasting pendapatan
  - Moving Average untuk estimasi penggunaan inventaris
  - Rekomendasi optimasi stok (Dalam Pengembangan)
- **Profil & Keamanan**: Edit profil dan ubah password

## 🚀 Teknologi yang Digunakan

### Frontend
- **Vue.js 3.3.11** - Progressive JavaScript Framework
- **Vue Router 4.2.5** - Official router untuk Vue.js
- **Pinia 2.1.7** - State management
- **Vite 5.0.8** - Build tool dan dev server
- **TailwindCSS 3.4.0** - Utility-first CSS framework
- **Font Awesome** - Icon library

### Backend (Dalam Pengembangan)
- **Supabase** - Backend-as-a-Service untuk autentikasi dan database
- **RESTful API** - (Planned)

### Machine Learning & AI
Sistem kecerdasan buatan diimplementasikan menggunakan **Python**:

#### Chatbot (Tanya Apik)
- **Metode**: Retrieval-Based System
- **Algoritma**: 
  - **TF-IDF (Term Frequency-Inverse Document Frequency)** - Ekstraksi fitur dari teks
  - **Cosine Similarity** - Pencocokan pertanyaan dengan FAQ database
- **Fungsi**: Menjawab pertanyaan umum pelanggan secara otomatis

#### Prediksi & Forecasting
- **Linear Regression** - Forecasting pendapatan berdasarkan data historis
- **Moving Average** - Estimasi penggunaan inventaris dan kebutuhan stok
- **Output**: Rekomendasi untuk optimasi operasional dan stok barang

## 📁 Struktur Project

```
Project Laundry/
├── src/
│   ├── assets/              # Gambar, logo, dan asset static
│   │   ├── images/
│   │   └── css/
│   ├── components/          # Reusable Vue components
│   │   ├── Breadcrumbs.vue
│   │   ├── ChatWidget.vue
│   │   ├── ChangePasswordModal.vue
│   │   ├── ConfirmDialog.vue
│   │   ├── EmptyState.vue
│   │   ├── LoadingSkeleton.vue
│   │   ├── LoadingSpinner.vue
│   │   ├── ProfileModal.vue
│   │   └── ToastNotification.vue
│   ├── composables/         # Vue composables
│   │   ├── useAnimations.js
│   │   ├── useConfirm.js
│   │   ├── useRipple.js
│   │   └── useToast.js
│   ├── lib/                 # External libraries config
│   │   └── supabase.js
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── stores/              # Pinia stores
│   │   └── authStore.js
│   ├── views/               # Page components
│   │   ├── admin/           # Admin pages
│   │   │   ├── AdminHomeView.vue
│   │   │   ├── AdminOrdersView.vue
│   │   │   ├── AdminCustomersView.vue
│   │   │   ├── AdminInventoryView.vue
│   │   │   ├── AdminFinancialReportView.vue
│   │   │   ├── AdminProfileView.vue
│   │   │   └── AdminChangePasswordView.vue
│   │   ├── customer/        # Customer pages
│   │   │   ├── CustomerHomeView.vue
│   │   │   ├── CustomerOrdersView.vue
│   │   │   ├── CustomerServicesView.vue
│   │   │   ├── CustomerTrackView.vue
│   │   │   ├── CustomerProfileView.vue
│   │   │   └── ChangePasswordView.vue
│   │   ├── owner/           # Owner pages
│   │   │   ├── OwnerDashboardView.vue
│   │   │   ├── OwnerReportsView.vue
│   │   │   ├── OwnerInventoryView.vue
│   │   │   ├── OwnerPredictionView.vue
│   │   │   ├── OwnerProfileView.vue
│   │   │   └── OwnerChangePasswordView.vue
│   │   ├── HomeView.vue     # Landing page
│   │   ├── LoginView.vue    # Login page
│   │   └── RegisterView.vue # Registration page
│   ├── App.vue              # Root component
│   └── main.js              # Entry point
├── public/                  # Public static assets
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── postcss.config.js        # PostCSS configuration
```

## 🎨 Fitur UI/UX

### Design System
- **Color Palette**: 
  - Primary: `#1678F3` (Biru)
  - Background: `#E8E8E8` (Abu-abu terang)
  - Text: `#000000`, `#666666`, `#999999`
- **Typography**: Inter, Poppins, K2D
- **Responsive Design**: Mobile, Tablet, Desktop friendly
- **Animations**: Smooth transitions dan hover effects
- **Gradient Avatars**: Dynamic gradient backgrounds untuk user avatars

### Komponen Reusable
- **Breadcrumbs**: Navigasi hierarki
- **Modal System**: Profile editing, password change
- **Toast Notifications**: Success/error feedback
- **Loading States**: Spinner dan skeleton screens
- **Empty States**: Informative empty states
- **Confirm Dialog**: User action confirmation
- **Chat Widget**: Floating chat dengan animasi

### Konsistensi
- Unified header design across all pages
- Consistent dropdown menus dengan z-index hierarchy
- Standardized button styles dan hover effects
- Responsive images dan icons

## 🛠️ Instalasi dan Setup

### Prerequisites
- Node.js (v16 atau lebih tinggi)
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone <repository-url>
cd "Project Laundry"
```

2. **Install Dependencies**
```bash
npm install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan kredensial Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Jalankan Development Server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

5. **Build untuk Production**
```bash
npm run build
```

6. **Preview Production Build**
```bash
npm run preview
```

## 👥 User Roles & Akses

### Customer
- **Path**: `/customer/*`
- **Fitur**: Orders, Services, Track, Profile

### Admin
- **Path**: `/admin/*`
- **Fitur**: Dashboard, Orders, Customers, Inventory, Financial Reports

### Owner
- **Path**: `/owner/*`
- **Fitur**: Dashboard, Reports, Inventory, Predictions

## 🔐 Authentication

Sistem menggunakan **Supabase Authentication** dengan fitur:
- Email/Password login
- Role-based access control (RBAC)
- Protected routes dengan navigation guards
- Auto-redirect berdasarkan role
- Session management

## 📊 State Management

Menggunakan **Pinia** untuk global state:

### Auth Store (`authStore.js`)
- User authentication state
- Login/Logout functionality
- User profile management
- Role-based permissions

## 🎯 Routing

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes
- Customer: `/customer/*`
- Admin: `/admin/*`
- Owner: `/owner/*`

**Route Guards**: Memastikan user hanya bisa mengakses halaman sesuai role mereka.

## 🚧 Status Pengembangan

### ✅ Selesai
- [x] Frontend UI/UX design
- [x] Authentication system
- [x] Customer dashboard
- [x] Admin dashboard
- [x] Owner dashboard
- [x] Profile management
- [x] Password change
- [x] Responsive design
- [x] Chat widget UI
- [x] Breadcrumbs navigation
- [x] Loading states
- [x] Toast notifications
- [x] Modal system

### 🔄 Dalam Pengembangan
- [ ] Backend API integration
- [ ] Real database connection
- [ ] Order processing system
- [ ] Real-time order tracking
- [ ] Chatbot AI integration (Python TF-IDF + Cosine Similarity)
- [ ] ML prediction model integration (Linear Regression + Moving Average)
- [ ] Advanced analytics dashboard

### 📝 Planned
- [ ] Export reports (PDF/Excel)
- [ ] Advanced search and filters

## 🐛 Known Issues

- Backend belum terintegrasi (menggunakan mock data)
- Machine Learning model (Python) belum terintegrasi dengan frontend
- Chatbot Tanya Apik masih menggunakan UI placeholder
- Modul prediksi pendapatan dan inventori belum aktif

## 📝 Catatan Pengembangan

### Mock Data
Saat ini aplikasi menggunakan data dummy/mock untuk:
- User authentication
- Orders list
- Customer database
- Inventory items
- Financial transactions

Data ini akan diganti dengan real API calls setelah backend selesai.

### Future Improvements
1. **Performance Optimization**
   - Code splitting
   - Lazy loading images
   - Service worker untuk PWA

2. **Security Enhancements**
   - CSRF protection
   - Rate limiting
   - Input sanitization

3. **Testing**
   - Unit tests dengan Vitest
   - E2E tests dengan Cypress
   - Component tests

## 📄 License

Project ini dibuat untuk keperluan edukasi - Praktikum Pemrograman Lanjut, Universitas Gunadarma.

## 👨‍💻 Developer

**Tim PPPL - Semester 7**
- Universitas Gunadarma
- Program Studi: Informatika

## 📞 Contact & Support

Untuk pertanyaan atau bantuan, silakan hubungi tim pengembang melalui issue tracker di repository ini.

---

**Status Project**: 🟡 Dalam Pengembangan - Frontend Complete, Backend & ML In Progress

**Last Updated**: Januari 2026
