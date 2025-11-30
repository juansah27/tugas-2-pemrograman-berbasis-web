# Tugas 2 - Pemrograman Berbasis Web

## SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar

Aplikasi web berbasis Vue.js untuk mengelola stok bahan ajar dan tracking delivery order di Universitas Terbuka.

## Struktur Proyek

```
tugas2-vue-ut/
├── index.html          # Halaman navigasi utama
├── stok.html           # Halaman Stok Bahan Ajar
├── tracking.html       # Halaman Tracking DO
├── css/
│   └── style.css       # Styling aplikasi
├── js/
│   ├── stok-app.js     # Logika Vue untuk stok
│   └── tracking-app.js # Logika Vue untuk tracking
├── dataBahanAjar.js    # Data dummy
└── README.md           # Dokumentasi
```

## Fitur

### Halaman Stok Bahan Ajar
- ✅ Menampilkan daftar stok dengan semua field
- ✅ Filter berdasarkan UT-Daerah, Kategori, Low Stock, Empty Stock
- ✅ Sort berdasarkan Judul, Stok, Harga
- ✅ Status stok: Aman, Menipis, Kosong
- ✅ Edit dan tambah stok baru
- ✅ Validasi form
- ✅ Dependent options (Kategori muncul setelah pilih UT-Daerah)

### Tracking Delivery Order
- ✅ Menampilkan daftar tracking DO
- ✅ Form tambah DO baru
- ✅ Auto-generate nomor DO (DO2025-001, DO2025-002, dst)
- ✅ Detail paket otomatis muncul setelah pilih paket
- ✅ Timeline perjalanan untuk setiap DO

## Teknologi

- Vue.js 2.6.14 (CDN)
- HTML5
- CSS3
- Vanilla JavaScript

## Cara Menjalankan

### Opsi 1: Buka Langsung
Double-click `index.html` di browser

### Opsi 2: Local Server (Disarankan)
```bash
# Menggunakan Python
python -m http.server 8000

# Atau menggunakan Node.js
npx http-server -p 8000
```

Lalu buka: `http://localhost:8000`

## Vue.js Features yang Digunakan

- **Directives**: `v-if`, `v-show`, `v-for`, `v-model`, `v-bind`, `v-html`, `v-text`
- **Computed Properties**: `filteredStok`, `filteredKategoriList`, `nextDONumber`, `totalHarga`
- **Watchers**: Monitor perubahan filter dan form
- **Methods**: Validasi, submit, reset, dll
- **Form Validation**: Error handling untuk semua input

## Kriteria Penilaian

1. ✅ Arsitektur dan Struktur Proyek Vue.js
2. ✅ Data Binding & Directive untuk List Rendering
3. ✅ Conditional (v-if, v-else, v-show)
4. ✅ Computed Properties & Methods
5. ✅ Watchers (minimal 2 watcher)
6. ✅ Formulir input dan Validasi
7. ✅ Kreativitas UI/UX
8. ✅ Video penjelasan (15 menit)

## Author

[Nama Anda]
[NIM Anda]

## Mata Kuliah

STSI4209 - Pemrograman Berbasis Web
Universitas Terbuka

