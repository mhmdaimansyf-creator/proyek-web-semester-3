# UI Guideline
## Bengkel Abadi Motor

## 1. Arah Desain
Buat antarmuka web yang sederhana, rapi, mudah dipahami, dan tidak terlalu ramai. Utamakan kemudahan penggunaan untuk Admin dan Pemilik.

## 2. Prinsip Tampilan
- Gunakan CSS biasa, bukan Tailwind CSS.
- Gunakan warna yang konsisten dan kontras teks yang cukup.
- Gunakan jarak antar elemen yang rapi.
- Gunakan ukuran teks yang mudah dibaca.
- Gunakan ikon seperlunya dan jangan memenuhi halaman dengan dekorasi.
- Pastikan tampilan tetap dapat digunakan pada layar laptop dan ponsel.
- Gunakan komponen yang dapat dipakai ulang jika memang membantu.

## 3. Struktur Umum
- Halaman login berdiri sendiri.
- Setelah login, tampilkan layout aplikasi dengan sidebar dan area konten.
- Sidebar memuat nama aplikasi dan navigasi modul.
- Area konten memuat judul halaman, informasi utama, dan isi modul.
- Sediakan informasi pengguna yang sedang login dan tombol logout.

## 4. Navigasi
Lima modul yang ditampilkan:
1. Dashboard
2. Data Spare Part
3. Barang Masuk dan Keluar
4. Laporan Persediaan
5. Login sebagai halaman autentikasi, bukan menu pengelolaan setelah pengguna masuk.

Jangan menambah modul lain.

## 5. Tampilan Berdasarkan Role
### Admin
- Dapat melihat seluruh navigasi modul.
- Pada Data Spare Part, tampilkan aksi tambah, edit, dan hapus.
- Pada Barang Masuk dan Keluar, tampilkan form pencatatan transaksi.
- Dapat melihat dan mencetak laporan.

### Pemilik
- Dapat melihat Dashboard.
- Dapat melihat dan mencari Data Spare Part.
- Dapat melihat riwayat Barang Masuk dan Keluar.
- Dapat melihat dan mencetak Laporan Persediaan.
- Jangan tampilkan tombol atau form untuk mengubah data.
- Pembatasan visual bukan pengganti validasi hak akses di backend.

## 6. Panduan Tiap Halaman
### Login
- Form username dan password.
- Tombol masuk yang jelas.
- Tampilkan pesan validasi yang mudah dimengerti.
- Jangan menampilkan password atau informasi sensitif dalam pesan error.

### Dashboard
- Tampilkan ringkasan stok dan transaksi.
- Gunakan kartu ringkasan secukupnya.
- Hindari grafik yang tidak diperlukan.

### Data Spare Part
- Gunakan tabel dengan judul kolom yang jelas.
- Sediakan pencarian.
- Tampilkan stok dan satuan.
- Aksi pengelolaan hanya untuk Admin.

### Barang Masuk dan Keluar
- Bedakan jenis transaksi dengan label yang jelas.
- Form harus memiliki label dan validasi.
- Tampilkan riwayat transaksi dalam tabel.
- Pastikan pengguna memahami spare part dan jumlah yang dicatat.

### Laporan Persediaan
- Tampilkan informasi laporan secara terstruktur.
- Sediakan tombol cetak.
- Saat mencetak, sembunyikan navigasi dan tombol yang tidak diperlukan menggunakan aturan print CSS.

## 7. Komponen dan Status
Gunakan komponen konsisten untuk:
- Tombol utama dan sekunder.
- Input dan label form.
- Tabel.
- Kartu ringkasan.
- Pesan sukses, error, dan data kosong.
- Dialog konfirmasi untuk tindakan yang menghapus data.

## 8. Aksesibilitas dan Responsif
- Gunakan label pada setiap input.
- Pastikan tombol memiliki teks atau nama yang jelas.
- Jangan hanya menggunakan warna untuk menyampaikan status.
- Tabel dapat ditangani pada layar kecil, misalnya dengan area scroll horizontal.
- Pastikan tidak ada konten penting yang terpotong.
