# AGENTS.md — Aturan untuk Coding Agent

## 1. Sumber Kebenaran
Sebelum melakukan perubahan, baca:
- `PRD.md`
- `UI-GUIDELINE.md`
- `IMPLEMENTATION_PLAN.md`

Jika instruksi lain bertentangan dengan dokumen tersebut, pertahankan ruang lingkup proyek yang ditetapkan SOT dan jelaskan konflik sebelum mengambil keputusan besar.

## 2. Identitas Proyek
Nama proyek: Sistem Informasi Pengelolaan Persediaan Spare Part Berbasis Web Menggunakan React-Vite dengan Metode RAD pada Bengkel Abadi Motor.

Teknologi:
- React-Vite.
- Node.js + Express.js.
- MySQL.
- CSS biasa.

## 3. Ruang Lingkup yang Tidak Boleh Berubah
Tepat dua role:
- Admin.
- Pemilik.

Tepat lima modul:
1. Login.
2. Dashboard.
3. Data Spare Part.
4. Barang Masuk dan Keluar.
5. Laporan Persediaan.

Jangan menambahkan modul seperti booking servis, kasir, pembayaran, pelanggan, kendaraan, penggajian, atau multi-cabang.

## 4. Aturan Hak Akses
- Admin dapat mengelola spare part dan mencatat transaksi.
- Pemilik hanya dapat melihat dashboard, data spare part, riwayat transaksi, dan laporan.
- Setiap operasi tulis harus dilindungi middleware/otorisasi backend.
- Menyembunyikan tombol pada frontend saja tidak cukup.
- Jangan mempercayai role yang dikirim bebas oleh frontend; ambil role dari identitas pengguna yang sudah terautentikasi.

## 5. Aturan Database dan Keamanan
- Gunakan MySQL database `abadi_motor`.
- Kredensial koneksi hanya dari environment variable.
- Jangan commit `.env`.
- Sediakan `.env.example` tanpa rahasia.
- Password wajib di-hash dengan algoritma yang sesuai.
- Validasi semua input di backend.
- Gunakan query parameterized atau mekanisme ORM yang aman.
- Jangan mengirim password hash ke frontend.
- Tangani error tanpa membocorkan kredensial atau detail internal.

## 6. Aturan Transaksi Stok
- Barang masuk menambah stok.
- Barang keluar mengurangi stok.
- Jumlah transaksi harus positif.
- Stok tidak boleh negatif.
- Pencatatan transaksi dan pembaruan stok harus atomik menggunakan database transaction.
- Tangani kemungkinan transaksi bersamaan dengan mekanisme locking atau update bersyarat yang aman.
- Jika transaksi gagal, rollback semua perubahan terkait.

## 7. Aturan Frontend
- Gunakan React-Vite dan CSS biasa.
- Jangan gunakan Tailwind CSS.
- Buat komponen yang sederhana dan dapat digunakan ulang bila bermanfaat.
- Ikuti UI-GUIDELINE.md.
- Tampilkan pesan loading, error, sukses, dan data kosong secara jelas.
- Jangan menjadikan dummy data sebagai sumber data aplikasi akhir.
- Pastikan layout dapat digunakan pada desktop dan layar kecil.

## 8. Aturan Backend
- Gunakan Express.js.
- Pisahkan route, controller, middleware, dan konfigurasi secara wajar.
- Buat API JSON yang konsisten.
- Gunakan status HTTP yang sesuai.
- Validasi autentikasi dan role di server.
- Jangan membuat struktur berlebihan untuk aplikasi berskala kecil ini.

## 9. Aturan Perubahan Kode
- Periksa file sebelum mengubahnya.
- Jangan menghapus atau menimpa file yang tidak terkait.
- Jangan membuat ulang proyek jika proyek yang ada masih dapat digunakan.
- Jangan memasang dependency tanpa kebutuhan yang jelas.
- Jangan mengubah nama modul, role, atau teknologi.
- Jangan membuat data contoh sebagai pengganti implementasi database.
- Jaga perubahan tetap mudah dipahami dan dipelihara.

## 10. Verifikasi
Setelah mengubah kode:
- Jalankan build frontend jika tersedia.
- Jalankan pemeriksaan backend yang tersedia.
- Jalankan test yang relevan jika ada.
- Periksa error terminal dan browser.
- Laporkan apa yang benar-benar sudah diuji dan apa yang belum.
- Jangan menyatakan aplikasi selesai jika masih ada error penting atau fitur belum terhubung ke database.

## 11. Komunikasi
Sebelum pekerjaan besar, ringkas file yang akan dibuat/diubah.
Jika menemui error, telusuri penyebabnya dan perbaiki; jangan mengulang seluruh proyek tanpa alasan.
Jika ada informasi lingkungan yang hanya diketahui pengguna (misalnya password MySQL atau port khusus), tanyakan hanya informasi yang benar-benar diperlukan.
