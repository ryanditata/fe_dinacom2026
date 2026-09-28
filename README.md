# 🚀 DinaCom Frontend 2026

Frontend project untuk **DinaCom 2026**, dibangun menggunakan **React + Vite + TypeScript** dengan arsitektur modular agar mudah di-scale dan di-maintain.


## 🛠️ Tech Stack

- ⚡ **Vite** – Build tool super cepat untuk React
- ⚛️ **React + TypeScript** – UI library dengan type safety
- 🎨 **TailwindCSS** – Utility-first CSS framework
- 🔄 **SWR (by Vercel)** – Data fetching dengan caching & revalidation
- 🌐 **Axios** – HTTP client untuk komunikasi API
- 🧭 **React Router v7** – Routing halaman
- 💎 **Lucide React** – Icon set modern
- 🍞 React Toastify – Notifikasi toast interaktif dan mudah digunakan
- 🧩 Formik – Library untuk manajemen form yang efisien di React
- ✅ Yup – Schema validation untuk validasi form yang kuat dan mudah diintegrasikan dengan Formik


## 📦 Installation

Clone repository dan jalankan perintah berikut:

**Clone repo**

```bash
git clone https://github.com/dnccsemarang/fe_dinacom2026.git

```

**Masuk ke folder project**

```bash
cd fe_dinacom2026
```

**Install dependencies**
```bash
npm install
```

**Jalankan development server**
```bash
npm run dev
```


## Project Architecture
```graphql 
src/
│
├── assets/           # File statis seperti gambar, ikon, font, dll.
│
├── components/       # Reusable UI components (Button, Navbar, Modal, dll.)
│
├── context/          # React context untuk state global (misal: AuthContext)
│
├── data/             # Static data atau constants (list, enum, dummy data)
│
├── hooks/            # Custom React hooks (misal: useAuth, useFetch)
│
├── layout/           # Layout utama seperti MainLayout, AuthLayout
│
├── libs/             # Konfigurasi library eksternal (axios instance, dll.)
│
├── pages/            # Halaman utama (home.tsx, not_found.tsx, dll.)
│
├── services/         # API services (misal: userService.ts, authService.ts)
│
├── types/            # TypeScript types & interfaces global
│
├── App.tsx           # Root component, handle router & layout
├── main.tsx          # Entry point aplikasi
└── index.css         # Import Tailwind dan global style
```

## 🧰 Available Commands
Command	Description

| Command | Description |
|-------------|-------------|
| **npm run dev** | Start dev server |
| **npm run build** | Build production files |
| **npm run preview** | Preview production build |


## 📄 License

This project is licensed under the MIT License
	
