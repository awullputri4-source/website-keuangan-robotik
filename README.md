# RoboFinance - Website Keuangan Organisasi Robotik Kampus

Aplikasi web modern, responsif, dan interaktif yang dirancang khusus untuk mempermudah pengelolaan dan transparansi keuangan organisasi/UKM Robotika kampus.

## ✨ Fitur Unggulan

### 1. 💵 Pendataan Penyetoran Uang Kas Anggota
- **Pilihan Metode Fleksibel**:
  - **Tunai (Cash)**: Untuk pembayaran langsung kepada bendahara di sekretariat/laboratorium robotik.
  - **Transfer Bank / E-Wallet**: Mendukung transfer via BCA, Mandiri, BRI, BNI, BSI, Dana, GoPay, OVO, ShopeePay lengkap dengan nomor referensi transaksi.
- **Lampiran Bukti Transfer**: Fasilitas upload atau preview tangkapan layar bukti transfer / struk pembayaran.
- **Kuitansi Digital Otomatis**: Tombol cetak kuitansi tanda terima kas instan untuk bukti pembayaran anggota.
- **Filter & Pencarian**: Filter berdasarkan metode (Cash/Transfer), divisi, periode kas, atau pencarian nama dan NIM mahasiswa.
- **Manajemen Anggota**: Pendataan anggota UKM per divisi (Mekanik, Elektronika, Pemrograman & AI, Desain, Manajerial).

### 2. 📅 Manajemen Acara & Rincian Pengeluaran Belanja
- **Pendataan Acara & Lomba**:
  - Contoh: Kontes Robot Indonesia (KRI), Workshop Mikrokontroler & IoT, Pameran/Expo Dies Natalis, Makrab Divisi.
  - Pengaturan alokasi pagu anggaran, tanggal, lokasi, ketua pelaksana, dan status kegiatan.
- **Rincian Pengeluaran Barang**:
  - Form pencatatan barang: Nama barang/kebutuhan, kategori (Komponen Robot, Alat & Bahan, Konsumsi, Transportasi, Sewa Venue, Publikasi, dll.).
  - Jumlah (Qty) & Satuan (pcs, unit, set, roll, kotak, paket, dll.).
  - Harga satuan dengan **kalkulasi otomatis total biaya** (Qty × Harga Satuan).
  - Nama pembeli / penanggung jawab dan upload foto nota/struk belanja.
  - Perhitungan otomatis: Total realisasi belanja vs Pagu anggaran, sisa saldo anggaran, dan progress bar penyerapan dana.

### 3. 📊 Dashboard Analitik Keuangan
- Ringkasan Saldo Kas Bersih Organisasi.
- Perbandingan penerimaan kas (Total Tunai vs Total Transfer).
- Total realisasi belanja dari seluruh kegiatan.
- Kartu progres anggaran per acara secara visual.
- Riwayat transaksi kas masuk & belanja keluar terbaru.

### 4. 📄 Laporan Keuangan & Buku Kas Umum (Siap Cetak LPJ)
- **Buku Kas Umum**: Pencatatan kronologis arus kas masuk (debet) dan belanja keluar (kredit) lengkap dengan saldo berjalan.
- **Format Siap Cetak (Print View)**: Dilengkapi Kop Surat UKM Robotika, tabel pembukuan rapi, dan kolom tanda tangan pengesahan Ketua Umum, Pembina Robotika, serta Bendahara Umum.
- **Export Data ke CSV / Excel**: Unduh rekap kas dan rincian belanja ke format spreadsheet sekali klik.

---

## 🚀 Cara Menjalankan Project

Pastikan sudah terpasang **Node.js** di komputer.

```bash
# 1. Masuk ke folder proyek
cd "Website Keuangan Robotik"

# 2. Menjalankan server development
npm run dev
```

Buka URL yang tampil di terminal (biasanya `http://localhost:5173`) di browser.

### Perintah Lainnya:
- `npm run build` : Melakukan kompilasi produksi (TypeScript + Vite)
- `npm run preview` : Menjalankan preview build produksi lokal

