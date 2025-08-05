// =======================================================================
// PENTING: Ganti dengan URL WEB APP BARU ANDA
// =======================================================================
const GAS_API_URL = "https://script.google.com/macros/s/AKfycbyySyLQ_oDr8UBeDUYNi35T8HnWS5MkEKmGpQHe0y_9fV1RsjqOUuk6siQDy8s7CMdn/exec";

document.addEventListener("DOMContentLoaded", function() {
    const namaGuruEl = document.getElementById("nama-guru");
    const idGuru = localStorage.getItem("idPengguna");
    const namaGuru = localStorage.getItem("namaPengguna");

    if (!idGuru || !namaGuru) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "index.html";
        return;
    }

    namaGuruEl.innerText = namaGuru;
    document.getElementById("tanggal-hari-ini").innerText = new Date().toLocaleDateString('id-ID', { dateStyle: 'full' });
    
    loadDashboardData(idGuru);

    document.getElementById("logoutButton").addEventListener("click", function(e) {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin logout?")) {
            localStorage.clear();
            window.location.href = "index.html";
        }
    });
});

function loadDashboardData(idGuru) {
    const rekapTbody = document.getElementById("rekap-tbody");
    rekapTbody.innerHTML = `<tr><td colspan="4">Memuat rekap presensi...</td></tr>`;

    const payload = { action: "getDataGuru", data: { idGuru: idGuru } };

    fetch(GAS_API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
    })
    .then(response => response.json())
    .then(res => {
        if (res.status === 'berhasil') {
            document.getElementById("nama-kelas").innerText = res.kelas;
            rekapTbody.innerHTML = ""; // Kosongkan tabel

            if (res.rekapSiswa && res.rekapSiswa.length > 0) {
                let counts = { Hadir: 0, Sakit: 0, Izin: 0, Alfa: 0 };
                res.rekapSiswa.forEach((siswa, index) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${siswa.nama}</td>
                        <td class="status-${siswa.status}">${siswa.status}</td>
                        <td>${siswa.jam_masuk}</td>
                    `;
                    rekapTbody.appendChild(tr);
                    if(counts[siswa.status] !== undefined) {
                        counts[siswa.status]++;
                    }
                });
                // Tampilkan ringkasan
                const ringkasanEl = document.getElementById("ringkasan-presensi");
                ringkasanEl.innerHTML = `
                    <span class="status-Hadir">Hadir: ${counts.Hadir}</span> | 
                    <span class="status-Sakit">Sakit: ${counts.Sakit}</span> | 
                    <span class="status-Izin">Izin: ${counts.Izin}</span> | 
                    <span class="status-Alfa">Alfa: ${counts.Alfa}</span>
                `;

            } else {
                rekapTbody.innerHTML = `<tr><td colspan="4">Tidak ada siswa di kelas ini.</td></tr>`;
            }
        } else {
            rekapTbody.innerHTML = `<tr><td colspan="4" style="color:red;">Gagal memuat data: ${res.pesan}</td></tr>`;
        }
    }).catch(err => {
        rekapTbody.innerHTML = `<tr><td colspan="4" style="color:red;">Gagal terhubung ke server.</td></tr>`;
    });
}
