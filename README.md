# Sistem Informasi Pengelolaan Persediaan Spare Part Berbasis Web Menggunakan React-Vite dengan Metode RAD pada Bengkel Abadi Motor

Aplikasi ini menggunakan React + Vite, Node.js + Express.js, MySQL, dan CSS biasa (tanpa Tailwind CSS). Ruang lingkupnya tetap dua role (Admin dan Pemilik) serta lima modul: Login, Dashboard, Data Spare Part, Barang Masuk dan Keluar, dan Laporan Persediaan.

## Persiapan

- Node.js 18 atau lebih baru dan npm.
- XAMPP (MySQL/MariaDB); jalankan MySQL dari XAMPP Control Panel.
- phpMyAdmin untuk memeriksa database bila diperlukan.
- Browser modern.

## Database yang sudah tersedia

Database `abadi_motor` pada phpMyAdmin sudah ada dan skema live yang diperiksa memiliki tiga tabel yang dipakai aplikasi:

- `users`: `id`, `name`, `username`, `password`, `role`, `created_at`, `updated_at`.
- `spare_parts`: `id`, `code`, `name`, `category`, `unit`, `stock`, `description`, `created_at`, `updated_at`.
- `transactions`: `id`, `spare_part_id`, `user_id`, `type`, `quantity`, `notes`, `created_at`.

Kolom, tipe data, primary key, unique key, dan relasi database yang diperiksa sesuai dengan [database/abadi_motor.sql](./database/abadi_motor.sql). `transactions.spare_part_id` terhubung ke `spare_parts.id` dan `transactions.user_id` ke `users.id`; kedua foreign key menggunakan `ON DELETE RESTRICT`. Transaksi memakai InnoDB dan jumlah transaksi memiliki constraint positif.

**Jangan impor file SQL lagi jika tabel tersebut sudah ada dan skemanya sesuai.** File `database/abadi_motor.sql` disediakan untuk instalasi database baru atau pemulihan skema yang memang diperlukan. Sebelum menggunakannya pada database yang berisi data, buat backup dan tinjau perubahan terlebih dahulu. File tersebut tidak berisi akun maupun data spare part contoh.

Untuk memeriksa nama tabel tanpa mengubah data, buka phpMyAdmin, pilih `abadi_motor`, kemudian tab **Structure**. Pemeriksaan baca-saja jumlah pengguna:

```sql
SELECT id, username, role FROM users ORDER BY id;
```

Jangan menampilkan atau membagikan kolom `password`; nilainya adalah hash.

## Konfigurasi backend

Konfigurasi lokal ada di `backend/.env` dan tidak boleh dibagikan atau dimasukkan ke Git. Pada pemeriksaan konfigurasi project, nilai koneksi database adalah `DB_HOST=localhost`, `DB_PORT=3306`, `DB_USER=root`, dan `DB_NAME=abadi_motor`. `DB_PASSWORD` harus mengikuti konfigurasi MySQL XAMPP lokal. `JWT_SECRET` harus berupa nilai acak minimal 32 karakter. README ini tidak mencantumkan nilai rahasia. Jangan mengganti `.env` yang sudah ada hanya untuk mengikuti nilai contoh.

Jika menyiapkan salinan project baru, buka PowerShell di folder project dan jalankan:

```powershell
Set-Location .\backend
npm install
if (-not (Test-Path .env)) { Copy-Item .env.example .env }
```

Edit `.env` hanya jika kredensial atau port MySQL Anda berbeda. Gunakan `DB_NAME=abadi_motor` dan tetapkan `JWT_SECRET` acak yang panjang (minimal 32 karakter). `DB_PASSWORD` boleh kosong hanya bila MySQL lokal memang tidak memakai password.

## Akun Admin dan Pemilik

Database saat ini berisi dua akun: username `admin` dengan role Admin dan username `pemilik` dengan role Pemilik. Kedua password di database tersimpan sebagai hash bcrypt. Password yang benar tetap diperlukan untuk login; username saja tidak cukup.

Seeder tersedia sebagai mekanisme untuk melengkapi role yang belum ada. Nama variabel yang dibaca kode seeder adalah:

```env
SEED_ADMIN_NAME=
SEED_ADMIN_USERNAME=
SEED_ADMIN_PASSWORD=
SEED_OWNER_NAME=
SEED_OWNER_USERNAME=
SEED_OWNER_PASSWORD=
```

Seeder memeriksa apakah role `admin` atau `pemilik` sudah terdaftar sebelum memerlukan variabel untuk role tersebut. Role yang sudah ada akan dilewati tanpa mengubah pengguna atau password. Hanya jika role belum ada, isi tiga variabel terkait role itu dengan nama, username yang belum dipakai, dan password baru minimal 12 karakter. Seeder berhenti dengan pesan kesalahan jika username sudah digunakan role lain.

Kemudian, dari folder `backend`, jalankan:

```powershell
npm run seed
```

Seeder membuat hash bcrypt dan hanya menambahkan akun yang belum ada. Jangan jalankan seeder untuk mereset password. Untuk mengganti password akun yang sudah ada, gunakan utilitas reset khusus yang dijelaskan di bawah.

Login melalui halaman aplikasi menggunakan username dan password masing-masing. Admin dapat mengelola spare part dan mencatat transaksi; Pemilik hanya dapat melihat dashboard, data spare part, riwayat transaksi, dan laporan. Backend juga menolak operasi tulis oleh Pemilik.

### Mengatur ulang password akun yang sudah ada

Jika password Admin atau Pemilik tidak diketahui, gunakan utilitas reset interaktif dari terminal lokal, bukan seeder:

```powershell
Set-Location .\backend
npm run reset-passwords
```

Utilitas hanya melanjutkan jika username `admin` memiliki role `admin` dan username `pemilik` memiliki role `pemilik`. Masukkan setiap password baru dua kali pada prompt tersembunyi di terminal; password tidak ditampilkan atau ditulis ke file. Gunakan password minimal 12 karakter. Utilitas memperbarui hash bcrypt kedua akun secara atomik, mempertahankan ID, username, role, dan `updated_at`, serta membatalkan seluruh perubahan jika pemeriksaan atau verifikasi gagal. Perintah ini tidak menambah atau menghapus akun, tidak mengubah skema, dan tidak mengubah data lain.

## Menjalankan aplikasi

Pastikan MySQL pada XAMPP tetap berjalan. Buka **terminal pertama** di folder project:

```powershell
Set-Location .\backend
npm install
npm run dev
```

API secara default berjalan pada `http://localhost:5000`. Endpoint pemeriksaan server: `http://localhost:5000/api/health`.

Buka **terminal kedua** di folder project:

```powershell
Set-Location .\frontend
npm install
npm run dev
```

Buka alamat Vite yang ditampilkan (default `http://localhost:5173`). Frontend menggunakan API `http://localhost:5000/api`. Jika alamat backend berbeda, buat `frontend/.env` dengan nilai URL biasa, tanpa tanda kurung siku atau sintaks Markdown:

```env
VITE_API_URL=http://localhost:5000/api
```

Nilai default VITE_API_URL adalah `http://localhost:5000/api`.

## Penggunaan

- Barang spare part baru memiliki stok awal nol. Catat stok awal sebagai transaksi barang masuk agar riwayat dan stok konsisten.
- Spare part yang sudah memiliki riwayat transaksi tidak dapat dihapus; gunakan edit untuk memperbaiki informasinya.
- Pada Laporan Persediaan, tombol **Cetak laporan** membuka dialog cetak browser.
- Logout mengakhiri sesi pada browser. Token API berlaku paling lama delapan jam.

## Pengujian

Jalankan setiap perintah dari folder terkait:

```powershell
Set-Location .\backend
npm test
```

```powershell
Set-Location .\frontend
npm run build
```

`npm test` menjalankan tes backend yang tersedia. `npm run build` memeriksa kompilasi produksi frontend. Untuk menguji alur API dan login, MySQL harus berjalan, skema harus tersedia, backend harus aktif, dan kredensial akun yang benar harus diketahui.

Tes otomatis backend saat ini memeriksa validasi input spare part dan transaksi; tes tersebut bukan pengujian integrasi login/API dengan database. `npm run build` hanya membangun frontend. README ini tidak menganggap hasil tes atau build berhasil sebelum perintah tersebut benar-benar dijalankan pada lingkungan Anda.
