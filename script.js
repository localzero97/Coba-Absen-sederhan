document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const loginButton = document.getElementById("loginButton");
    const pesanStatus = document.getElementById("pesanStatus");

    // =======================================================================
    // PENTING: Ganti dengan URL WEB APP BARU ANDA
    // =======================================================================
    const GAS_API_URL = "URL_WEB_APP_ANDA_DISINI";

    const payload = {
        action: "login",
        data: {
            peran: document.getElementById("peran").value,
            idPengguna: document.getElementById("idPengguna").value,
            password: document.getElementById("password").value,
        }
    };

    loginButton.disabled = true;
    loginButton.innerText = "Memproses...";
    pesanStatus.innerText = "";
    pesanStatus.className = "status-message";

    fetch(GAS_API_URL, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "text/plain;charset=utf-8" },
    })
    .then(response => response.json())
    .then(res => {
        if (res.status === "berhasil") {
            localStorage.setItem("namaPengguna", res.nama);
            localStorage.setItem("idPengguna", res.idPengguna);
            localStorage.setItem("peranPengguna", res.peran);

            if (res.peran === 'siswa') {
                window.location.href = 'dashboard_siswa.html';
            } else if (res.peran === 'guru') {
                window.location.href = 'dashboard_guru.html'; // <-- PENGALIHAN UNTUK GURU
            }
        } else {
            pesanStatus.innerText = res.pesan;
            pesanStatus.classList.add("gagal");
            loginButton.disabled = false;
            loginButton.innerText = "Login";
        }
    })
    .catch(error => {
        pesanStatus.innerText = "Kesalahan koneksi: " + error.message;
        pesanStatus.classList.add("gagal");
        loginButton.disabled = false;
        loginButton.innerText = "Login";
    });
});
