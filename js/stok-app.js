// Import data dari dataBahanAjar.js (harus di-load terlebih dahulu)
var stokApp = new Vue({
    el: '#stok-app',
    data: {
        // Data dari dataBahanAjar.js
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
        stok: [
            {
                kode: "EKMA4116",
                judul: "Pengantar Manajemen",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A3",
                harga: 65000,
                qty: 28,
                safety: 20,
                catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
            },
            {
                kode: "EKMA4115",
                judul: "Pengantar Akuntansi",
                kategori: "MK Wajib",
                upbjj: "Jakarta",
                lokasiRak: "R1-A4",
                harga: 60000,
                qty: 7,
                safety: 15,
                catatanHTML: "<strong>Cover baru</strong>"
            },
            {
                kode: "BIOL4201",
                judul: "Biologi Umum (Praktikum)",
                kategori: "Praktikum",
                upbjj: "Surabaya",
                lokasiRak: "R3-B2",
                harga: 80000,
                qty: 12,
                safety: 10,
                catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
            },
            {
                kode: "FISIP4001",
                judul: "Dasar-Dasar Sosiologi",
                kategori: "MK Pilihan",
                upbjj: "Makassar",
                lokasiRak: "R2-C1",
                harga: 55000,
                qty: 2,
                safety: 8,
                catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
            }
        ],
        // Filter states
        filterUpbjj: '',
        filterKategori: '',
        filterLowStock: false,
        filterEmptyStock: false,
        // Sort state
        sortBy: '',
        sortOrder: 'asc',
        // Form states
        showAddForm: false,
        editingIndex: -1,
        formData: {
            kode: '',
            judul: '',
            kategori: '',
            upbjj: '',
            lokasiRak: '',
            harga: 0,
            qty: 0,
            safety: 0,
            catatanHTML: ''
        },
        formErrors: {}
    },
    computed: {
        // Filter kategori berdasarkan upbjj yang dipilih (dependent options)
        filteredKategoriList() {
            if (!this.filterUpbjj) {
                return this.kategoriList;
            }
            // Ambil kategori unik dari stok yang sesuai dengan upbjj terpilih
            const kategoriSet = new Set();
            this.stok.forEach(item => {
                if (item.upbjj === this.filterUpbjj) {
                    kategoriSet.add(item.kategori);
                }
            });
            return Array.from(kategoriSet);
        },
        // Filter dan sort stok
        filteredStok() {
            let result = [...this.stok];
            
            // Filter berdasarkan upbjj
            if (this.filterUpbjj) {
                result = result.filter(item => item.upbjj === this.filterUpbjj);
            }
            
            // Filter berdasarkan kategori
            if (this.filterKategori) {
                result = result.filter(item => item.kategori === this.filterKategori);
            }
            
            // Filter low stock
            if (this.filterLowStock) {
                result = result.filter(item => item.qty < item.safety && item.qty > 0);
            }
            
            // Filter empty stock
            if (this.filterEmptyStock) {
                result = result.filter(item => item.qty === 0);
            }
            
            // Sort
            if (this.sortBy) {
                result.sort((a, b) => {
                    let aVal, bVal;
                    
                    if (this.sortBy === 'judul') {
                        aVal = a.judul.toLowerCase();
                        bVal = b.judul.toLowerCase();
                    } else if (this.sortBy === 'qty') {
                        aVal = a.qty;
                        bVal = b.qty;
                    } else if (this.sortBy === 'harga') {
                        aVal = a.harga;
                        bVal = b.harga;
                    }
                    
                    if (this.sortOrder === 'asc') {
                        return aVal > bVal ? 1 : -1;
                    } else {
                        return aVal < bVal ? 1 : -1;
                    }
                });
            }
            
            return result;
        },
        // Status untuk setiap item stok
        getStatus() {
            return (item) => {
                if (item.qty === 0) {
                    return { text: 'Kosong', class: 'status-kosong', icon: '🔴' };
                } else if (item.qty < item.safety) {
                    return { text: 'Menipis', class: 'status-menipis', icon: '⚠️' };
                } else {
                    return { text: 'Aman', class: 'status-aman', icon: '✅' };
                }
            };
        }
    },
    watch: {
        // Watcher 1: Reset filter kategori ketika upbjj berubah
        filterUpbjj(newVal) {
            if (newVal) {
                // Reset kategori jika tidak ada di list yang difilter
                if (this.filterKategori && !this.filteredKategoriList.includes(this.filterKategori)) {
                    this.filterKategori = '';
                }
            } else {
                this.filterKategori = '';
            }
        },
        // Watcher 2: Monitor perubahan stok untuk logging
        stok: {
            handler(newVal) {
                console.log('Stok updated:', newVal.length, 'items');
                // Bisa digunakan untuk auto-save atau notifikasi
            },
            deep: true
        }
    },
    methods: {
        // Reset semua filter
        resetFilters() {
            this.filterUpbjj = '';
            this.filterKategori = '';
            this.filterLowStock = false;
            this.filterEmptyStock = false;
            this.sortBy = '';
            this.sortOrder = 'asc';
        },
        // Toggle form tambah/edit
        toggleAddForm() {
            this.showAddForm = !this.showAddForm;
            this.editingIndex = -1;
            this.resetForm();
        },
        // Reset form
        resetForm() {
            this.formData = {
                kode: '',
                judul: '',
                kategori: '',
                upbjj: '',
                lokasiRak: '',
                harga: 0,
                qty: 0,
                safety: 0,
                catatanHTML: ''
            };
            this.formErrors = {};
        },
        // Validasi form
        validateForm() {
            this.formErrors = {};
            let isValid = true;
            
            if (!this.formData.kode.trim()) {
                this.formErrors.kode = 'Kode mata kuliah harus diisi';
                isValid = false;
            }
            
            if (!this.formData.judul.trim()) {
                this.formErrors.judul = 'Judul mata kuliah harus diisi';
                isValid = false;
            }
            
            if (!this.formData.kategori) {
                this.formErrors.kategori = 'Kategori harus dipilih';
                isValid = false;
            }
            
            if (!this.formData.upbjj) {
                this.formErrors.upbjj = 'UT-Daerah harus dipilih';
                isValid = false;
            }
            
            if (!this.formData.lokasiRak.trim()) {
                this.formErrors.lokasiRak = 'Lokasi rak harus diisi';
                isValid = false;
            }
            
            if (this.formData.harga <= 0) {
                this.formErrors.harga = 'Harga harus lebih dari 0';
                isValid = false;
            }
            
            if (this.formData.qty < 0) {
                this.formErrors.qty = 'Jumlah stok tidak boleh negatif';
                isValid = false;
            }
            
            if (this.formData.safety < 0) {
                this.formErrors.safety = 'Safety stock tidak boleh negatif';
                isValid = false;
            }
            
            return isValid;
        },
        // Submit form (tambah/edit)
        submitForm() {
            if (!this.validateForm()) {
                return;
            }
            
            if (this.editingIndex >= 0) {
                // Edit existing
                this.stok[this.editingIndex] = { ...this.formData };
            } else {
                // Add new
                this.stok.push({ ...this.formData });
            }
            
            this.toggleAddForm();
        },
        // Edit stok
        editStok(index) {
            const item = this.filteredStok[index];
            const originalIndex = this.stok.findIndex(s => s.kode === item.kode);
            
            this.editingIndex = originalIndex;
            this.formData = { ...item };
            this.showAddForm = true;
        },
        // Delete stok (optional)
        deleteStok(index) {
            if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                const item = this.filteredStok[index];
                const originalIndex = this.stok.findIndex(s => s.kode === item.kode);
                if (originalIndex >= 0) {
                    this.stok.splice(originalIndex, 1);
                }
            }
        }
    }
});

