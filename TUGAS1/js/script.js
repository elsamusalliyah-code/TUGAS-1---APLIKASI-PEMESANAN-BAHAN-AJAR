document.addEventListener("DOMContentLoaded", function () {
  protectPage();
  setupLogin();
  setGreeting();
  renderUserInfo();
  renderTotalStok();
  renderStokTable();
  renderStokCards();
  setupStokForm();
  setupTracking();
});

// 🔒 Proteksi halaman
function protectPage() {
  const page = location.pathname.split("/").pop() || "index.html";
  const publicPages = ["index.html"];
  if (!publicPages.includes(page) && !localStorage.getItem("userSitta")) {
    alert("Silakan login terlebih dahulu");
    window.location.href = "index.html";
  }
}

// 🔑 Login
function setupLogin() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) return;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const user = dataPengguna.find(u => u.email === email && u.password === pass);
    if (user) {
      localStorage.setItem("userSitta", JSON.stringify(user));
      window.location.href = "dashboard.html";
    } else {
      alert("Email/Password yang anda masukkan salah");
    }
  });
}

// 👋 Greeting
function setGreeting() {
  const greetEl = document.getElementById("greeting");
  if (!greetEl) return;

  const hour = new Date().getHours();
  let greet = "Selamat malam";
  if (hour < 12) greet = "Selamat pagi";
  else if (hour < 18) greet = "Selamat siang";

  const user = JSON.parse(localStorage.getItem("userSitta"));
  greetEl.innerText = `${greet}, ${user ? user.nama : "Mahasiswa"}!`;
}

// 🧑 Info user di dashboard
function renderUserInfo() {
  const infoEl = document.getElementById("userInfo");
  if (!infoEl) return;
  const user = JSON.parse(localStorage.getItem("userSitta"));
  if (user) {
    infoEl.innerText = `${user.role} - ${user.lokasi}`;
  }
}

// 📦 Total stok
function renderTotalStok() {
  const totalEl = document.getElementById("totalStokHero");
  if (!totalEl) return;
  const total = dataBahanAjar.reduce((sum, item) => sum + item.stok, 0);
  totalEl.innerText = total;
}

// 📊 Tabel stok
function renderStokTable() {
  const tbody = document.getElementById("stokTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";
  dataBahanAjar.forEach((item, i) => {
    const row = `<tr>
      <td>${i + 1}</td>
      <td><img src="${item.cover}" alt="${item.namaBarang}" width="50"></td>
      <td>${item.kodeLokasi}</td>
      <td>${item.kodeBarang}</td>
      <td>${item.namaBarang}</td>
      <td>${item.jenisBarang}</td>
      <td>${item.edisi}</td>
      <td>${item.stok}</td>
    </tr>`;
    tbody.innerHTML += row;
  });
}

// 📚 Grid cover modul
function renderStokCards() {
  const cards = document.getElementById("stokCards");
  if (!cards) return;
  cards.innerHTML = "";
  dataBahanAjar.forEach(item => {
    const card = `
      <div class="book-card">
        <img src="${item.cover}" alt="${item.namaBarang}">
        <h4>${item.namaBarang}</h4>
        <p>${item.kodeBarang} | Stok: ${item.stok}</p>
      </div>`;
    cards.innerHTML += card;
  });
}

// ➕ Form tambah stok
function setupStokForm() {
  const form = document.getElementById("stokForm");
  if (!form) return;
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const newItem = {
      kodeLokasi: document.getElementById("kodeLokasi").value,
      kodeBarang: document.getElementById("kodeBarang").value,
      namaBarang: document.getElementById("namaBarang").value,
      jenisBarang: document.getElementById("jenisBarang").value,
      edisi: document.getElementById("edisi").value,
      stok: parseInt(document.getElementById("stok").value),
      cover: document.getElementById("coverPath")?.value || "img/default.jpg"
    };
    dataBahanAjar.push(newItem);
    renderStokTable();
    renderStokCards();
    form.reset();
  });
}

// 🚚 Tracking
function setupTracking() {
  const input = document.getElementById("doNumber");
  const resultBox = document.getElementById("trackingResult");
  if (!input || !resultBox) return;

  window.searchTracking = function () {
    const doNumber = input.value.trim();
    const data = dataTracking[doNumber];
    if (data) {
      let perjalananHTML = "<ul>";
      data.perjalanan.forEach(p => {
        perjalananHTML += `<li>${p.waktu} - ${p.keterangan}</li>`;
      });
      perjalananHTML += "</ul>";

      resultBox.innerHTML = `
        <h3>Hasil Tracking</h3>
        <p><strong>Nomor DO:</strong> ${data.nomorDO}</p>
        <p><strong>Nama Mahasiswa:</strong> ${data.nama}</p>
        <p><strong>Status:</strong> ${data.status}</p>
        <p><strong>Ekspedisi:</strong> ${data.ekspedisi}</p>
        <p><strong>Tanggal Kirim:</strong> ${data.tanggalKirim}</p>
        <p><strong>Jenis Paket:</strong> ${data.paket}</p>
        <p><strong>Total Pembayaran:</strong> ${data.total}</p>
        <h4>Riwayat Perjalanan:</h4>
        ${perjalananHTML}
      `;
    } else {
      resultBox.innerHTML = "<p>Nomor DO tidak ditemukan.</p>";
    }
  };

  window.fillDO = function(no) {
    input.value = no;
  };
}

// 📑 Laporan
function showReport(type) {
  const box = document.getElementById("reportBox");
  if (!box) return;
  if (type === "progress") {
    box.innerHTML = "<h3>Monitoring Progress DO</h3><p>Data progress akan ditampilkan di sini.</p>";
  } else if (type === "rekap") {
    box.innerHTML = "<h3>Rekap Bahan Ajar</h3><p>Data rekap akan ditampilkan di sini.</p>";
  } else if (type === "histori") {
    box.innerHTML = "<h3>Histori Transaksi</h3><p>Data histori transaksi akan ditampilkan di sini.</p>";
  }
}

// 🚪 Logout
function logout() {
  localStorage.removeItem("userSitta");
  alert("Anda telah logout");
  window.location.href = "index.html";
}

// ⚙️ Modal helper
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
