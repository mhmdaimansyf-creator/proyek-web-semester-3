# Implementation Plan
## Bengkel Abadi Motor — Metode RAD

Dokumen ini menjadi panduan implementasi. Kerjakan dengan urutan yang jelas, tetapi tetap boleh menyesuaikan detail teknis kecil selama tidak mengubah ruang lingkup PRD.

## 1. Teknologi
- Frontend: React-Vite.
- Backend: Node.js + Express.js.
- Database: MySQL (dijalankan melalui XAMPP).
- Styling: CSS biasa.
- Komunikasi frontend-backend: REST API berbasis JSON.

## 2. Struktur Folder yang Disarankan
```text
bengkel-abadi-motor/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── database/
│   └── abadi_motor.sql
├── PRD.md
├── UI-GUIDELINE.md
├── IMPLEMENTATION_PLAN.md
├── AGENTS.md
└── README.md
```
Struktur boleh disesuaikan jika proyek sudah memiliki susunan yang berjalan. Hindari memindahkan atau menghapus file tanpa alasan.

## 3. Tahapan Implementasi RAD
### Tahap A — Requirement Planning
- Baca seluruh dokumen SOT.
- Pastikan lima modul dan dua role dipahami.
- Pastikan batasan proyek tidak berubah.

### Tahap B — User Design
- Siapkan layout dan navigasi.
- Buat halaman Login, Dashboard, Data Spare Part, Barang Masuk dan Keluar, serta Laporan Persediaan.
- Data dummy boleh digunakan sementara untuk memeriksa UI, tetapi harus diganti dengan API dan database sebelum aplikasi dinyatakan selesai.

### Tahap C — Construction
- Siapkan backend Express.
- Siapkan database MySQL.
- Implementasikan autentikasi dan middleware role.
- Implementasikan API untuk spare part, transaksi, dashboard, dan laporan.
- Hubungkan frontend ke API.
- Terapkan validasi dan penanganan error.

### Tahap D — Cutover dan Pengujian
- Uji alur Admin dan Pemilik.
- Uji perubahan stok.
- Uji pembatasan akses langsung ke API.
- Uji laporan dan cetak.
- Perbaiki error dan siapkan dokumentasi.

## 4. Rancangan Database Awal
Database: `abadi_motor`

### Tabel `users`
Kolom yang disarankan:
- `id` — primary key.
- `name` — nama pengguna.
- `username` — unik.
- `password` — password hash.
- `role` — `admin` atau `pemilik`.
- `created_at` dan `updated_at`.

### Tabel `spare_parts`
Kolom yang disarankan:
- `id` — primary key.
- `code` — kode spare part, unik.
- `name` — nama spare part.
- `category` — kategori, boleh nullable jika tidak dibutuhkan.
- `unit` — satuan.
- `stock` — jumlah stok, bilangan non-negatif.
- `description` — keterangan, boleh nullable.
- `created_at` dan `updated_at`.

### Tabel `transactions`
Kolom yang disarankan:
- `id` — primary key.
- `spare_part_id` — foreign key ke `spare_parts`.
- `user_id` — foreign key ke `users` yang mencatat transaksi.
- `type` — `in` atau `out`.
- `quantity` — jumlah positif.
- `notes` — keterangan, boleh nullable.
- `created_at`.

Sesuaikan tipe data, indeks, constraint, dan aturan penghapusan foreign key secara tepat. Jangan menambahkan tabel atau kolom besar yang tidak dibutuhkan tanpa menjelaskan alasannya.

## 5. Aturan Konsistensi Stok
- Barang masuk menambah stok.
- Barang keluar mengurangi stok.
- Jumlah harus bilangan bulat positif.
- Barang keluar harus ditolak jika stok tidak mencukupi.
- Simpan catatan transaksi dan perubahan stok dalam satu database transaction.
- Gunakan penguncian atau mekanisme konsistensi yang sesuai agar dua transaksi bersamaan tidak membuat stok negatif.
- Jika penyimpanan transaksi gagal, perubahan stok harus dibatalkan.

## 6. Rancangan API
Rute berikut adalah acuan awal dan boleh disesuaikan tanpa mengubah kebutuhan:
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout` jika menggunakan mekanisme sesi/token yang memerlukannya.
- `GET /api/dashboard`
- `GET /api/spare-parts`
- `POST /api/spare-parts` — Admin.
- `PUT /api/spare-parts/:id` — Admin.
- `DELETE /api/spare-parts/:id` — Admin.
- `GET /api/transactions`
- `POST /api/transactions` — Admin.
- `GET /api/reports/inventory`

Semua endpoint harus memvalidasi autentikasi dan role sesuai kebutuhan. Jangan mengandalkan pembatasan tombol di frontend.

## 7. Konfigurasi Lingkungan
Sediakan `backend/.env.example`, misalnya:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=abadi_motor
```
Nilai `.env` milik pengguna tidak boleh ditimpa atau dimasukkan ke Git. Sesuaikan konfigurasi jika MySQL lokal memakai kredensial atau port berbeda.

## 8. Akun Awal
Sediakan cara aman untuk membuat akun awal Admin dan Pemilik, misalnya melalui seed script yang melakukan hashing password. Jangan menyimpan password teks biasa di database atau source code produksi. Jika menyediakan kredensial demo, jelaskan agar pengguna mengganti password setelah login pertama.

## 9. Pengujian Minimum
- Koneksi backend ke MySQL berhasil.
- Login dengan kredensial valid berhasil.
- Login dengan kredensial salah ditolak.
- Admin dapat melakukan CRUD spare part.
- Pemilik tidak dapat melakukan operasi tulis, termasuk melalui API langsung.
- Barang masuk menambah stok dengan benar.
- Barang keluar mengurangi stok dengan benar.
- Barang keluar melebihi stok ditolak.
- Kegagalan transaksi tidak meninggalkan perubahan stok parsial.
- Laporan menampilkan data aktual.
- Cetak laporan berfungsi.

## 10. Dokumentasi
README harus menjelaskan:
1. Persyaratan perangkat lunak.
2. Instalasi dependency frontend dan backend.
3. Menyalakan MySQL melalui XAMPP.
4. Membuat atau mengimpor database melalui phpMyAdmin.
5. Mengatur file `.env`.
6. Membuat akun awal.
7. Menjalankan backend dan frontend.
8. Cara login dan menggunakan aplikasi.

## 11. Cara Kerja Agen Coding
- Periksa kondisi proyek sebelum mengubah file.
- Baca seluruh dokumen SOT.
- Jangan menimpa konfigurasi yang sudah benar.
- Kerjakan fitur secara konsisten dan hindari duplikasi.
- Jalankan pemeriksaan/build/test yang tersedia setelah perubahan.
- Jika perintah gagal, baca pesan error dan perbaiki penyebabnya.
- Jangan mengklaim fitur berhasil jika belum diuji.
- Jika ada keputusan yang belum jelas, pilih solusi paling sederhana yang sesuai SOT dan dokumentasikan.
