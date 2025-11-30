# Narasi Video Penjelasan Tugas Praktik 2
## SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar

---

## [PEMBUKAAN - 30 detik]

Halo, perkenalkan saya [Nama Anda], NIM [NIM Anda]. Pada video ini, saya akan menjelaskan pengerjaan Tugas Praktik 2 mata kuliah Pemrograman Berbasis Web dengan topik implementasi Vue.js untuk aplikasi SITTA - Sistem Informasi Tiras dan Transaksi Bahan Ajar Universitas Terbuka.

Aplikasi ini dibuat sebagai referensi dari penelitian Dosen Prodi Sistem Informasi Universitas Terbuka. Saya akan menjelaskan implementasi fitur-fitur Vue.js yang digunakan beserta alur berpikir dalam pengembangannya.

---

## [BAGIAN 1: ARSITEKTUR DAN STRUKTUR PROYEK - 1 menit]

**1.1 Arsitektur dan Struktur Proyek Vue.js**

Pertama, saya akan menjelaskan struktur proyek yang telah saya buat. Struktur ini dirancang untuk memisahkan concerns dengan jelas dan memudahkan maintenance.

Struktur folder yang saya gunakan adalah:
- **index.html** sebagai halaman navigasi utama yang menghubungkan ke dua halaman utama
- **stok.html** untuk halaman pengelolaan stok bahan ajar
- **tracking.html** untuk halaman tracking delivery order
- Folder **css/** berisi **style.css** untuk styling aplikasi
- Folder **js/** berisi **stok-app.js** dan **tracking-app.js** yang memisahkan logika Vue untuk masing-masing halaman

Pemilihan struktur ini memungkinkan:
1. Pemisahan logika yang jelas antara stok dan tracking
2. Kemudahan dalam maintenance dan debugging
3. Struktur yang scalable untuk pengembangan selanjutnya

Setiap file JavaScript memiliki instance Vue.js sendiri yang independen, sehingga tidak terjadi konflik data antara halaman.

---

## [BAGIAN 2: DATA BINDING & DIRECTIVE LIST RENDERING - 3 menit]

**1.2 Penggunaan Data Binding & Directive untuk List Rendering**

Sekarang saya akan menjelaskan penggunaan directives Vue.js untuk menampilkan data dan data binding.

### Mustaches dan v-text

Di halaman stok, saya menggunakan **mustaches** `{{ }}` untuk menampilkan data dinamis. Contohnya pada tabel stok:
```html
<td>{{ item.kode }}</td>
<td>{{ item.judul }}</td>
```

Saya juga menggunakan **v-text** untuk binding teks, seperti pada badge status:
```html
<span v-text="getStatus(item).text"></span>
```

### v-html untuk Konten HTML

Untuk menampilkan catatan yang mengandung HTML, saya menggunakan **v-html** karena data `catatanHTML` berisi tag HTML seperti `<em>`, `<strong>`, dan `<u>`:
```html
<td v-html="item.catatanHTML"></td>
```

Ini memungkinkan rendering HTML yang proper tanpa menampilkan tag sebagai teks biasa.

### v-bind untuk One-Way Data Binding

Saya menggunakan **v-bind** atau singkatnya `:` untuk binding atribut HTML. Contohnya:
- Binding class dinamis untuk status badge:
```html
<span :class="getStatus(item).class" class="status-badge">
```
- Binding value pada select options:
```html
<option v-for="upbjj in upbjjList" :key="upbjj" :value="upbjj">
```

### v-model untuk Two-Way Data Binding

**v-model** digunakan untuk form input yang memerlukan two-way binding, seperti:
- Filter dropdown:
```html
<select v-model="filterUpbjj">
```
- Form input:
```html
<input type="text" v-model="formData.nim">
```

v-model memungkinkan perubahan di input langsung terupdate di data Vue, dan sebaliknya.

### v-for untuk List Rendering

Untuk menampilkan daftar data, saya menggunakan **v-for**:
```html
<tr v-for="(item, index) in filteredStok" :key="item.kode">
```

Penggunaan `:key` dengan `item.kode` yang unik penting untuk performa Vue dalam tracking perubahan elemen list. Ini memungkinkan Vue melakukan update yang efisien saat data berubah.

---

## [BAGIAN 3: CONDITIONAL DIRECTIVES - 2 menit]

**1.3 Penggunaan Conditional**

Saya menggunakan conditional directives untuk menampilkan elemen berdasarkan kondisi tertentu.

### v-if untuk Conditional Rendering

**v-if** digunakan ketika elemen perlu ditambahkan atau dihapus dari DOM. Contohnya:
- Menampilkan form hanya ketika `showAddForm` bernilai true:
```html
<div class="form-section" v-show="showAddForm">
```

Sebenarnya di sini saya menggunakan **v-show**, tapi untuk contoh v-if, saya gunakan pada:
- Menampilkan pesan kosong ketika tidak ada data:
```html
<div v-if="filteredStok.length === 0" class="empty-state">
```

### v-show untuk Toggle Visibility

**v-show** lebih efisien untuk toggle visibility karena hanya mengubah CSS `display`, tidak menghapus elemen dari DOM. Saya gunakan untuk:
- Form tambah/edit stok:
```html
<div class="form-section" v-show="showAddForm">
```
- Detail paket yang muncul setelah memilih paket:
```html
<div v-if="selectedPaketDetail" class="package-details">
```

Perbedaan utama: **v-if** menghapus elemen dari DOM (lebih berat), sedangkan **v-show** hanya menyembunyikan (lebih ringan untuk toggle yang sering).

### Dependent Options dengan v-show

Saya menerapkan dependent options di filter kategori. Filter kategori hanya muncul setelah UT-Daerah dipilih:
```html
<div class="filter-item" v-show="filterUpbjj">
```

Ini meningkatkan UX karena user tidak melihat opsi yang tidak relevan.

---

## [BAGIAN 4: COMPUTED PROPERTIES & METHODS - 2.5 menit]

**1.4 Penggunaan Property (Computed dan Methods)**

### Computed Properties

Computed properties digunakan untuk data yang bergantung pada data lain dan perlu di-cache. Saya menggunakan beberapa computed properties:

**1. filteredKategoriList** - Menampilkan kategori berdasarkan UT-Daerah yang dipilih:
```javascript
filteredKategoriList() {
    if (!this.filterUpbjj) {
        return this.kategoriList;
    }
    const kategoriSet = new Set();
    this.stok.forEach(item => {
        if (item.upbjj === this.filterUpbjj) {
            kategoriSet.add(item.kategori);
        }
    });
    return Array.from(kategoriSet);
}
```

**2. filteredStok** - Filter dan sort stok berdasarkan kriteria:
```javascript
filteredStok() {
    let result = [...this.stok];
    // Filter logic
    // Sort logic
    return result;
}
```

**3. nextDONumber** - Generate nomor DO otomatis:
```javascript
nextDONumber() {
    const currentYear = new Date().getFullYear();
    // Logic untuk generate sequence number
    return `DO${currentYear}-${nextSeq}`;
}
```

**4. totalHarga** - Menghitung total harga dari paket yang dipilih:
```javascript
totalHarga() {
    if (!this.formData.paket) return 0;
    const selected = this.paket.find(p => p.kode === this.formData.paket);
    return selected ? selected.harga : 0;
}
```

Keuntungan computed properties: hasil di-cache dan hanya di-recompute ketika dependency berubah, sehingga lebih efisien daripada methods.

### Methods

Methods digunakan untuk fungsi yang dipanggil secara eksplisit atau perlu dijalankan setiap kali dipanggil:

- **resetFilters()** - Reset semua filter
- **validateForm()** - Validasi form input
- **submitForm()** - Submit form dengan validasi
- **editStok()** - Edit data stok
- **getStatus()** - Mendapatkan status stok (Aman/Menipis/Kosong)

Perbedaan: Computed untuk data terhitung yang di-cache, Methods untuk fungsi yang perlu dijalankan setiap kali dipanggil.

---

## [BAGIAN 5: WATCHERS - 2 menit]

**1.5 Watchers**

Saya menggunakan minimal 2 watcher di setiap aplikasi untuk memantau perubahan data.

### Watcher di stok-app.js

**Watcher 1: filterUpbjj**
Memantau perubahan filter UT-Daerah dan mereset filter kategori jika tidak relevan:
```javascript
filterUpbjj(newVal) {
    if (newVal) {
        if (this.filterKategori && !this.filteredKategoriList.includes(this.filterKategori)) {
            this.filterKategori = '';
        }
    } else {
        this.filterKategori = '';
    }
}
```

Ini memastikan filter kategori selalu konsisten dengan UT-Daerah yang dipilih.

**Watcher 2: stok (deep watch)**
Memantau perubahan pada array stok untuk logging atau notifikasi:
```javascript
stok: {
    handler(newVal) {
        console.log('Stok updated:', newVal.length, 'items');
    },
    deep: true
}
```

Deep watch diperlukan karena stok adalah array of objects, sehingga perubahan di dalam object juga terdeteksi.

### Watcher di tracking-app.js

**Watcher 1: formData.paket**
Memantau perubahan paket yang dipilih dan update detail paket:
```javascript
'formData.paket'(newVal) {
    if (newVal) {
        this.selectedPaketDetail = this.paket.find(p => p.kode === newVal);
    } else {
        this.selectedPaketDetail = null;
    }
}
```

Ini memungkinkan detail paket muncul otomatis setelah user memilih paket.

**Watcher 2: showAddForm**
Auto-set tanggal kirim ketika form dibuka:
```javascript
showAddForm(newVal) {
    if (newVal && !this.formData.tanggalKirim) {
        const today = new Date();
        // Set tanggal hari ini
        this.formData.tanggalKirim = `${year}-${month}-${day}`;
    }
}
```

Ini meningkatkan UX dengan auto-fill tanggal kirim.

Watchers memungkinkan reaktifitas yang lebih granular dibanding computed properties, terutama untuk side effects dan validasi real-time.

---

## [BAGIAN 6: FORMULIR & VALIDASI - 3 menit]

**1.6 Formulir Input dan Validasi Input Sederhana**

Saya mengimplementasikan form dengan validasi yang user-friendly.

### Form Tambah/Edit Stok

Form ini memiliki field:
- Kode Mata Kuliah (required)
- Judul Mata Kuliah (required)
- Kategori (required, select)
- UT-Daerah (required, select)
- Lokasi Rak (required)
- Harga (required, number, > 0)
- Jumlah Stok (number, >= 0)
- Safety Stock (number, >= 0)
- Catatan HTML (optional)

### Form Tambah DO

Form ini memiliki:
- Nomor DO (auto-generated, disabled)
- NIM (required, numeric validation)
- Nama (required)
- Ekspedisi (required, select)
- Tanggal Kirim (required, date picker dengan auto-fill)
- Paket (required, select dengan detail otomatis)
- Total Harga (auto-calculated, disabled)

### Validasi

Saya menggunakan method **validateForm()** yang:
1. Mengecek setiap field required
2. Validasi format (misal: NIM harus numeric)
3. Validasi range (misal: harga > 0)
4. Menampilkan error message per field:
```javascript
validateForm() {
    this.formErrors = {};
    let isValid = true;
    
    if (!this.formData.kode.trim()) {
        this.formErrors.kode = 'Kode mata kuliah harus diisi';
        isValid = false;
    }
    // ... validasi lainnya
    
    return isValid;
}
```

Error message ditampilkan di bawah setiap input:
```html
<span class="error-message" v-if="formErrors.kode">
    {{ formErrors.kode }}
</span>
```

### UX Improvements

1. **Auto-fill tanggal** - Tanggal kirim otomatis terisi hari ini
2. **Auto-calculate** - Total harga otomatis dari paket yang dipilih
3. **Auto-generate DO** - Nomor DO otomatis dengan format yang benar
4. **Real-time validation** - Error muncul saat submit, bukan saat typing
5. **Disabled fields** - Field yang auto-generated di-disable untuk clarity

---

## [BAGIAN 7: KREATIVITAS UI/UX - 2 menit]

**1.7 Kreativitas dalam Menampilkan Interface**

Saya merancang UI yang modern dan user-friendly dengan beberapa inovasi:

### Visual Design

1. **Gradient Background** - Background gradient purple untuk visual appeal
2. **Card-based Layout** - Setiap section dalam card dengan shadow untuk depth
3. **Color-coded Status** - Status stok dengan warna:
   - Hijau untuk "Aman"
   - Orange untuk "Menipis"
   - Merah untuk "Kosong"
4. **Icon Integration** - Icon emoji untuk visual clarity (📚, 🚚, ✅, ⚠️, 🔴)

### UX Improvements

1. **Dependent Options** - Filter kategori hanya muncul setelah pilih UT-Daerah
2. **Empty State** - Pesan informatif ketika tidak ada data
3. **Timeline Visualization** - Timeline perjalanan DO dengan visual yang jelas
4. **Package Details** - Detail paket muncul otomatis setelah pilih, tidak perlu klik lagi
5. **Responsive Grid** - Layout menggunakan CSS Grid yang responsive
6. **Hover Effects** - Hover effects pada button dan card untuk feedback visual
7. **Form Validation Feedback** - Error message dengan styling yang jelas

### Navigation

- **Breadcrumb Navigation** - Link "Kembali ke Menu Utama" di setiap halaman
- **Clear Hierarchy** - Header, section, dan content dengan hierarchy yang jelas
- **Consistent Styling** - Styling konsisten di semua halaman

---

## [BAGIAN 8: ALUR BERPIKIR & SISTEMATIKA - 2 menit]

**1.8 Penjelasan Sistematika dan Alur Berpikir**

### Fase 1: Perencanaan

Saya mulai dengan menganalisis requirement dari soal tugas:
1. Identifikasi fitur yang diperlukan
2. Mapping fitur ke Vue.js features
3. Rancangan struktur data
4. Rancangan struktur komponen

### Fase 2: Struktur Data

Saya menggunakan data dari `dataBahanAjar.js` sebagai acuan, kemudian:
1. Memisahkan data untuk stok dan tracking
2. Menentukan struktur form data
3. Merancang computed properties yang diperlukan

### Fase 3: Implementasi Fitur

Saya mengimplementasikan secara bertahap:

**Step 1: Display Data**
- Menggunakan v-for untuk list rendering
- Menggunakan mustaches, v-text, v-html untuk display

**Step 2: Interaktivitas**
- Menambahkan v-model untuk form binding
- Mengimplementasikan methods untuk actions

**Step 3: Filtering & Sorting**
- Membuat computed property filteredStok
- Menambahkan filter controls dengan v-model

**Step 4: Conditional Display**
- Menggunakan v-if dan v-show untuk conditional rendering
- Implementasi dependent options

**Step 5: Form & Validation**
- Membuat form dengan validasi
- Error handling dan user feedback

**Step 6: Watchers**
- Menambahkan watchers untuk reactive behavior
- Auto-update dan side effects

### Fase 4: Styling & UX

1. Merancang color scheme yang konsisten
2. Menambahkan visual feedback
3. Optimasi responsive design
4. Testing user flow

### Argumentasi Pilihan Teknologi

1. **Computed vs Methods**: Saya pilih computed untuk filteredStok karena hasil perlu di-cache dan hanya recompute saat dependency berubah, lebih efisien.

2. **v-if vs v-show**: Saya pilih v-show untuk form toggle karena lebih ringan untuk elemen yang sering di-toggle.

3. **Watchers**: Saya gunakan watchers untuk side effects yang tidak bisa ditangani computed, seperti auto-reset filter dan auto-fill tanggal.

4. **Struktur Pemisahan**: Saya pisahkan stok-app.js dan tracking-app.js untuk maintainability dan menghindari konflik data.

---

## [PENUTUP - 30 detik]

Demikian penjelasan saya mengenai implementasi Vue.js pada aplikasi SITTA. Aplikasi ini mengimplementasikan:

✅ Arsitektur yang terstruktur dan mudah dipahami
✅ Data binding dan list rendering yang efisien
✅ Conditional rendering yang tepat
✅ Computed properties dan methods yang sesuai
✅ Watchers untuk reactive behavior
✅ Form dengan validasi yang user-friendly
✅ UI/UX yang modern dan nyaman digunakan

Aplikasi dapat diakses online di GitHub Pages: [URL GitHub Pages]

Source code tersedia di repository GitHub: [URL Repository]

Terima kasih atas perhatiannya. Jika ada pertanyaan, silakan tanyakan di kolom komentar.

---

## CATATAN UNTUK PRESENTASI:

1. **Durasi Total**: ~15 menit
2. **Siapkan Demo**: Buka aplikasi di browser untuk live demo
3. **Show Code**: Tampilkan code snippets saat menjelaskan
4. **Pace**: Jangan terburu-buru, pastikan setiap poin jelas
5. **Practice**: Latih beberapa kali sebelum recording

**Tips Recording:**
- Gunakan screen recording software (OBS, Loom, atau Zoom)
- Rekam layar + suara
- Pastikan kualitas audio jelas
- Test recording dulu sebelum final take
- Edit jika perlu (potong bagian yang tidak perlu)

