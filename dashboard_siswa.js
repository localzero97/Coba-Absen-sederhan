// =======================================================================
// PENTING: Ganti dengan URL WEB APP BARU ANDA
// =======================================================================
const GAS_API_URL = "URL_WEB_APP_ANDA_DISINI";

document.addEventListener("DOMContentLoaded", function() {
    const namaSiswaEl = document.getElementById("nama-siswa");
    const idSiswa = localStorage.getItem("idPengguna");
    const namaSiswa = localStorage.getItem("namaPengguna");

    if (!idSiswa || !namaSiswa) {
        alert("Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "index.html";
        return;
    }

    namaSiswaEl.innerText = namaSiswa;
    document.getElementById("tanggal-hari-ini").innerText = new Date().toLocaleDateString('id-ID', { dateStyle: 'full' });
    
    loadDashboardData(idSiswa);

    document.getElementById("logoutButton").addEventListener("click", function(e) {
        e.preventDefault();
        if (confirm("Apakah Anda yakin ingin logout?")) { localStorage.clear(); window.location.href = "index.html"; }
    });
});

function loadDashboardData(idSiswa) {
    const loader = document.getElementById("loader");
    const kontenPresensi = document.getElementById("konten-presensi");
    const riwayatTbody = document.getElementById("riwayat-tbody");

    loader.style.display = "block";
    kontenPresensi.innerHTML = "";
    riwayatTbody.innerHTML = `<tr><td colspan="3">Memuat riwayat...</td></tr>`;

    const payload = { action: "getDataSiswa", data: { idSiswa: idSiswa } };

    fetch(GAS_API_URL, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "text/plain;charset=utf-8" } })
    .then(response => response.json())
    .then(res => {
        loader.style.display = "none";
        if (res.status === 'berhasil') {
            if (res.statusHariIni) {
                kontenPresensi.innerHTML = `<p class="status-hadir">Anda sudah presensi hari ini pada pukul <strong>${res.statusHariIni.jam || '-'}</strong> dengan status <strong>${res.statusHariIni.status}</strong>.</p>`;
            } else {
                kontenPresensi.innerHTML = `<p>Anda belum melakukan presensi hari ini.</p><button id="absenButton" class="btn-absen">ABSEN SEKARANG</button>`;
                document.getElementById("absenButton").addEventListener("click", doAbsen);
            }
            riwayatTbody.innerHTML = ""; 
            if (res.riwayat && res.riwayat.length > 0) {
                res.riwayat.forEach(item => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `<td>${item.tanggal}</td><td>${item.jam_masuk}</td><td>${item.status}</td>`;
                    riwayatTbody.appendChild(tr);
                });
            } else { riwayatTbody.innerHTML = `<tr><td colspan="3">Belum ada riwayat presensi.</td></tr>`; }
        } else { kontenPresensi.innerHTML = `<p style="color:red;">Gagal memuat data: ${res.pesan}</p>`; }
    }).catch(err => {
        loader.style.display = 'none';
        kontenPresensi.innerHTML = `<p style="color:red;">Gagal terhubung ke server. Periksa koneksi Anda.</p>`;
    });
}

function doAbsen() {
    this.disabled = true;
    this.innerText = "Memproses...";
    const payload = { action: "presensi", data: { idSiswa: localStorage.getItem("idPengguna"), status: "Hadir", keterangan: "" } };
    fetch(GAS_API_URL, { method: "POST", body: JSON.stringify(payload), headers: { "Content-Type": "text/plain;charset=utf-8" }})
    .then(r => r.json()).then(res => {
        alert(res.pesan);
        if (res.status === 'berhasil') { loadDashboardData(localStorage.getItem("idPengguna")); } 
        else { this.disabled = false; this.innerText = "ABSEN SEKARANG"; }
    }).catch(err => {
        alert('Gagal mengirim data. Periksa koneksi internet Anda.');
        this.disabled = false; this.innerText = "ABSEN SEKARANG";
    });
}
