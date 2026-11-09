# PROMPT: Redesign Total Frontend + Admin Panel + Dashboard E-commerce (Next.js/React)

## Konteks Project
Website e-commerce berbasis React/Next.js yang perlu di-redesign total — baik dari sisi konsep visual, struktur komponen, maupun penambahan admin panel dan dashboard baru.

---

## 1. Redesign Frontend (Customer-Facing)

**Tujuan:** Rombak total tampilan, bukan sekadar re-skin. Struktur halaman, hierarki komponen, dan UX flow boleh diubah total jika memang lebih baik.

**Yang harus dikerjakan:**
- Buat **design system baru**: palet warna, tipografi, spacing scale, border radius, shadow, dan komponen dasar (button, input, card, badge, modal) — konsisten di seluruh halaman.
- Redesign halaman-halaman berikut:
  - Homepage (hero, kategori unggulan, produk rekomendasi, promo banner)
  - Halaman daftar produk / kategori (filter, sorting, pagination/infinite scroll)
  - Halaman detail produk (galeri gambar, varian, review, produk terkait)
  - Keranjang belanja & checkout (multi-step atau single page, sesuai rekomendasi)
  - Halaman akun pengguna (profil, riwayat pesanan, alamat, wishlist)
  - Halaman autentikasi (login, register, lupa password)
- Pastikan **fully responsive** (mobile, tablet, desktop) dan **dark/light mode-ready** jika memungkinkan.
- Gunakan Tailwind CSS (atau library lain seperti shadcn/ui, Chakra, MUI) untuk konsistensi styling.
- Tambahkan micro-interaction (hover state, transition halus, skeleton loading) agar terasa modern.
- Optimasi gambar (next/image) dan performa (lazy load, code splitting).

---

## 2. Admin Panel (Internal Tool untuk Mengelola E-commerce)

**Tujuan:** Dashboard internal untuk admin mengelola seluruh operasional toko.

**Modul yang dibutuhkan:**
- **Autentikasi admin** terpisah dari user biasa (role-based: super admin, staff, dll jika perlu)
- **Manajemen Produk**
  - CRUD produk (nama, deskripsi, harga, stok, kategori, varian, gambar)
  - Bulk upload/edit (opsional, via CSV)
  - Manajemen kategori & tag
- **Manajemen Pesanan (Order)**
  - List pesanan dengan filter status (pending, diproses, dikirim, selesai, batal)
  - Detail pesanan + update status + cetak invoice
  - Riwayat pembayaran
- **Manajemen User/Customer**
  - List pelanggan, detail profil, riwayat transaksi
  - Blokir/aktifkan akun
- **Manajemen Promo/Diskon**
  - Buat kode voucher, atur diskon per produk/kategori
- Sidebar navigasi yang jelas, breadcrumb, dan search global di admin panel.

---

## 3. Dashboard (Ringkasan & Analitik)

**Tujuan:** Halaman utama admin panel yang menampilkan insight bisnis secara cepat.

**Komponen yang dibutuhkan:**
- Kartu ringkasan (total penjualan hari ini/bulan ini, jumlah order, jumlah user baru, produk terlaris)
- Grafik tren penjualan (line/bar chart, bisa pakai Recharts/Chart.js)
- Tabel order terbaru (5–10 terakhir)
- Produk dengan stok menipis (low stock alert)
- Filter rentang tanggal untuk semua data di dashboard

---

## 4. Aspek Teknis

- **Stack:** Next.js (App Router atau Pages Router — sebutkan mana yang dipakai), React, Tailwind CSS
- **State management:** Zustand/Redux/Context API (sesuaikan dengan yang sudah ada di project)
- **Data fetching:** API routes Next.js / REST / GraphQL (sebutkan backend yang dipakai)
- **Validasi form:** React Hook Form + Zod
- **Autentikasi:** NextAuth.js atau JWT custom (sebutkan)
- Pastikan kode modular, reusable component, dan folder structure rapi (`/components`, `/app` atau `/pages`, `/lib`, `/hooks`, dll)
- Tambahkan loading state & error handling di semua halaman yang fetch data

---

## 5. Deliverables

Kerjakan secara bertahap:
1. Mulai dari **design system + komponen dasar**
2. Lanjut ke **redesign halaman frontend** satu per satu
3. Setelah itu bangun **admin panel** (struktur + CRUD)
4. Terakhir, buat **dashboard** dengan data visualisasi

---

## Catatan Tambahan (lengkapi sebelum eksekusi)

- Referensi gaya visual (misal: "minimalis seperti Shopify" atau lampirkan screenshot)
- Info backend yang dipakai (REST API sendiri, Supabase, Firebase, dll)
- Detail database/skema data produk, order, dan user jika sudah ada
