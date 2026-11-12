# Product Requirements Document (PRD)
## Sistem Informasi Pengelolaan Persediaan Spare Part Bengkel Abadi Motor

## 1. Informasi Proyek
- **Judul:** Sistem Informasi Pengelolaan Persediaan Spare Part Berbasis Web Menggunakan React-Vite dengan Metode RAD pada Bengkel Abadi Motor
- **Objek:** Bengkel Abadi Motor
- **Metode pengembangan:** Rapid Application Development (RAD)
- **Frontend:** React-Vite
- **Backend:** Node.js dan Express.js
- **Database:** MySQL
- **Styling:** CSS biasa (tanpa Tailwind CSS)

## 2. Latar Belakang
Aplikasi ini dibuat untuk membantu pengelolaan persediaan spare part di Bengkel Abadi Motor. Sistem diharapkan memudahkan pencatatan data spare part, barang masuk, barang keluar, serta pemantauan stok dan laporan persediaan.

## 3. Tujuan
1. Mempermudah pencatatan data spare part.
2. Mempermudah pencatatan barang masuk dan barang keluar.
3. Membantu memantau jumlah stok.
4. Menyediakan laporan persediaan yang mudah dilihat dan dicetak.

## 4. Pengguna dan Hak Akses
### Admin
Admin bertugas mengelola data dan transaksi.
- Login dan logout.
- Melihat dashboard.
- Menambah, melihat, mengubah, dan menghapus data spare part.
- Mencatat barang masuk dan barang keluar.
- Melihat dan mencetak laporan persediaan.

### Pemilik
Pemilik menggunakan sistem untuk memantau informasi.
- Login dan logout.
- Melihat dashboard.
- Melihat dan mencari data spare part.
- Melihat riwayat transaksi.
- Melihat dan mencetak laporan persediaan.
- Tidak boleh menambah, mengubah, menghapus data, atau mencatat transaksi.

Hak akses harus diperiksa di backend, bukan hanya dengan menyembunyikan tombol pada frontend.

## 5. Ruang Lingkup dan Modul
Aplikasi memiliki tepat lima modul:

### 5.1 Login
- Form username dan password.
- Validasi kredensial.
- Pengalihan tampilan sesuai role.
- Logout.
- Password disimpan dalam bentuk hash.

### 5.2 Dashboard
- Ringkasan jumlah spare part.
- Ringkasan stok.
- Ringkasan barang masuk dan barang keluar.
- Informasi ditampilkan sesuai hak akses pengguna.

### 5.3 Data Spare Part
- Menampilkan daftar spare part.
- Pencarian data.
- Admin dapat menambah, mengubah, dan menghapus data.
- Pemilik hanya dapat melihat dan mencari data.

Data spare part minimal mencakup kode spare part, nama, kategori (jika diperlukan), satuan, stok, dan keterangan (jika diperlukan). Struktur akhir disesuaikan dengan kebutuhan implementasi.

### 5.4 Barang Masuk dan Keluar
- Admin mencatat barang masuk.
- Admin mencatat barang keluar.
- Sistem menyimpan riwayat transaksi.
- Stok bertambah saat barang masuk dan berkurang saat barang keluar.
- Pemilik hanya dapat melihat riwayat transaksi.
- Sistem menolak barang keluar jika jumlahnya melebihi stok tersedia.

### 5.5 Laporan Persediaan
- Menampilkan informasi persediaan dan stok.
- Menampilkan riwayat barang masuk dan keluar sesuai kebutuhan laporan.
- Laporan dapat dicetak melalui fitur cetak browser.
- Admin dan Pemilik dapat melihat serta mencetak laporan.

## 6. Aturan Bisnis
1. Setiap pengguna harus login untuk mengakses halaman aplikasi.
2. Role pengguna hanya Admin atau Pemilik.
3. Pemilik hanya memiliki akses baca.
4. Setiap transaksi barang masuk atau keluar harus memiliki spare part yang valid dan jumlah lebih dari nol.
5. Barang keluar tidak boleh membuat stok menjadi negatif.
6. Perubahan stok dan penyimpanan transaksi harus dilakukan secara konsisten dalam satu transaksi database.
7. Data laporan harus berasal dari database, bukan data dummy.
8. Penghapusan spare part yang sudah memiliki riwayat transaksi harus ditangani dengan aman, misalnya menolak penghapusan atau menggunakan penonaktifan sesuai keputusan implementasi yang terdokumentasi.

## 7. Kebutuhan Nonfungsional
- Antarmuka sederhana, rapi, dan mudah dipahami.
- Tampilan responsif untuk desktop dan perangkat mobile.
- Validasi data di frontend dan backend.
- Password di-hash, bukan disimpan sebagai teks biasa.
- Kredensial database disimpan di file `.env` dan tidak di-commit.
- Penanganan error yang jelas.
- Struktur kode sederhana dan mudah dirawat.

## 8. Di Luar Ruang Lingkup
Jangan menambahkan modul atau fitur besar di luar lima modul yang disepakati, seperti:
- Booking servis.
- Pembayaran atau kasir.
- Penggajian.
- Pengelolaan pelanggan dan kendaraan.
- Multi-cabang.
- Integrasi payment gateway.

## 9. Kriteria Penerimaan
Aplikasi dianggap memenuhi kebutuhan apabila:
1. Admin dan Pemilik dapat login sesuai akun dan role.
2. Admin dapat mengelola data spare part.
3. Pemilik tidak dapat mengubah data, termasuk melalui pemanggilan API langsung.
4. Admin dapat mencatat barang masuk dan keluar.
5. Stok berubah sesuai transaksi dan tidak menjadi negatif.
6. Riwayat transaksi tersimpan di MySQL.
7. Laporan menampilkan data aktual dari database dan dapat dicetak.
8. Petunjuk instalasi dan menjalankan aplikasi tersedia.
