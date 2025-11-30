// Tracking DO Application
var trackingApp = new Vue({
    el: '#tracking-app',
    data: {
        // Data dari dataBahanAjar.js
        upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
        pengirimanList: [
            { kode: "REG", nama: "JNE Regular" },
            { kode: "EXP", nama: "JNE Express" }
        ],
        paket: [
            { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116","EKMA4115"], harga: 120000 },
            { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201","FISIP4001"], harga: 140000 }
        ],
        tracking: {
            "DO2025-0001": {
                nim: "123456789",
                nama: "Rina Wulandari",
                status: "Dalam Perjalanan",
                ekspedisi: "JNE Regular",
                tanggalKirim: "2025-08-25",
                paket: "PAKET-UT-001",
                total: 120000,
                perjalanan: [
                    { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
                    { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
                    { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
                ]
            }
        },
        // Form states
        showAddForm: false,
        formData: {
            nim: '',
            nama: '',
            ekspedisi: '',
            paket: '',
            tanggalKirim: ''
        },
        formErrors: {},
        selectedPaketDetail: null
    },
    computed: {
        // Generate nomor DO berikutnya
        nextDONumber() {
            const currentYear = new Date().getFullYear();
            const doKeys = Object.keys(this.tracking).filter(key => key.startsWith(`DO${currentYear}-`));
            
            if (doKeys.length === 0) {
                return `DO${currentYear}-001`;
            }
            
            // Ambil sequence number terbesar
            const sequences = doKeys.map(key => {
                const match = key.match(/DO\d+-(\d+)/);
                return match ? parseInt(match[1]) : 0;
            });
            
            const maxSeq = Math.max(...sequences);
            const nextSeq = (maxSeq + 1).toString().padStart(3, '0');
            return `DO${currentYear}-${nextSeq}`;
        },
        // Total harga dari paket yang dipilih
        totalHarga() {
            if (!this.formData.paket) return 0;
            const selected = this.paket.find(p => p.kode === this.formData.paket);
            return selected ? selected.harga : 0;
        },
        // List tracking DO
        trackingList() {
            return Object.keys(this.tracking).map(noDO => ({
                noDO: noDO,
                ...this.tracking[noDO]
            })).reverse(); // Terbaru di atas
        }
    },
    watch: {
        // Watcher 1: Update detail paket ketika paket dipilih
        'formData.paket'(newVal) {
            if (newVal) {
                this.selectedPaketDetail = this.paket.find(p => p.kode === newVal);
            } else {
                this.selectedPaketDetail = null;
            }
        },
        // Watcher 2: Auto-set tanggal kirim jika kosong
        showAddForm(newVal) {
            if (newVal && !this.formData.tanggalKirim) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                this.formData.tanggalKirim = `${year}-${month}-${day}`;
            }
        }
    },
    methods: {
        // Toggle form tambah DO
        toggleAddForm() {
            this.showAddForm = !this.showAddForm;
            if (!this.showAddForm) {
                this.resetForm();
            }
        },
        // Reset form
        resetForm() {
            this.formData = {
                nim: '',
                nama: '',
                ekspedisi: '',
                paket: '',
                tanggalKirim: ''
            };
            this.formErrors = {};
            this.selectedPaketDetail = null;
        },
        // Validasi form
        validateForm() {
            this.formErrors = {};
            let isValid = true;
            
            if (!this.formData.nim.trim()) {
                this.formErrors.nim = 'NIM harus diisi';
                isValid = false;
            } else if (!/^\d+$/.test(this.formData.nim.trim())) {
                this.formErrors.nim = 'NIM harus berupa angka';
                isValid = false;
            }
            
            if (!this.formData.nama.trim()) {
                this.formErrors.nama = 'Nama harus diisi';
                isValid = false;
            }
            
            if (!this.formData.ekspedisi) {
                this.formErrors.ekspedisi = 'Ekspedisi harus dipilih';
                isValid = false;
            }
            
            if (!this.formData.paket) {
                this.formErrors.paket = 'Paket harus dipilih';
                isValid = false;
            }
            
            if (!this.formData.tanggalKirim) {
                this.formErrors.tanggalKirim = 'Tanggal kirim harus diisi';
                isValid = false;
            }
            
            return isValid;
        },
        // Submit form (tambah DO baru)
        submitForm() {
            if (!this.validateForm()) {
                return;
            }
            
            const noDO = this.nextDONumber;
            const ekspedisiNama = this.pengirimanList.find(p => p.kode === this.formData.ekspedisi)?.nama || this.formData.ekspedisi;
            
            // Format waktu untuk perjalanan
            const now = new Date();
            const waktuStr = now.toISOString().slice(0, 19).replace('T', ' ');
            
            // Tambah tracking baru
            this.$set(this.tracking, noDO, {
                nim: this.formData.nim.trim(),
                nama: this.formData.nama.trim(),
                status: "Dalam Perjalanan",
                ekspedisi: ekspedisiNama,
                tanggalKirim: this.formData.tanggalKirim,
                paket: this.formData.paket,
                total: this.totalHarga,
                perjalanan: [
                    {
                        waktu: waktuStr,
                        keterangan: `Penerimaan di Loket: ${ekspedisiNama}`
                    }
                ]
            });
            
            this.toggleAddForm();
            alert(`DO ${noDO} berhasil ditambahkan!`);
        },
        // Get detail paket untuk display
        getPaketDetail(kodePaket) {
            return this.paket.find(p => p.kode === kodePaket);
        }
    }
});

