# SmartWater Analytics Platform — Proposal Source Extract

> Source: `PROPOSAL SOFTWARE DEVELOPMENT ITC 2026_SOFTDEV_Gugugaga.pdf`
>
> Purpose: machine-readable source mirror for local coding agents that cannot reliably parse the original PDF.
> This file preserves the proposal's product requirements and wording as closely as practical.
> The original PDF remains the authoritative source.

## Title

**SmartWater Analytics Platform: Intelligent Water Quality Monitoring, Prediction, and Recommendation System Using IoT and Artificial Intelligence**

Gugugaga Team — Telkom University Purwokerto — Kabupaten Banyumas — 2026.

---

# BAB I — PENDAHULUAN

## 1.1 Latar Belakang

Perkembangan industri tekstil, khususnya batik di Kota Pekalongan, memberikan kontribusi besar terhadap perekonomian dan penyerapan tenaga kerja, tetapi juga meningkatkan produksi limbah cair yang berpotensi mencemari lingkungan.

Berdasarkan DIKPLHD Kota Pekalongan Tahun 2024 dan 2025, kualitas air masih menjadi isu prioritas karena beberapa sungai berada dalam kondisi tercemar akibat limbah domestik dan industri. Meskipun pemerintah telah membangun IPAL komunal dan melakukan inspeksi lapangan, pengawasan masih bersifat periodik dan reaktif.

Permasalahan tersebut menunjukkan perlunya sistem monitoring yang mampu mendeteksi perubahan kualitas air secara lebih cepat dan berkelanjutan.

SmartWater Analytics Platform dikembangkan sebagai perangkat lunak berbasis Artificial Intelligence dan Internet of Things yang mengintegrasikan sensor kualitas air dengan dashboard berbasis web untuk:
- pemantauan secara real-time,
- deteksi anomali,
- prediksi pencemaran,
- Early Warning System,
- pemberian rekomendasi tindakan.

Platform ditujukan untuk membantu pelaku industri, Dinas Lingkungan Hidup, dan pemangku kepentingan lain melakukan pengawasan lebih proaktif, meningkatkan kepatuhan terhadap regulasi, dan mendukung industri tekstil berkelanjutan.

Pengembangan selaras dengan subtema **AI for Smart Environment and Sustainability** serta mendukung:
- SDG 6 — Clean Water and Sanitation
- SDG 9 — Industry, Innovation and Infrastructure
- SDG 12 — Responsible Consumption and Production

## 1.2 Rumusan Masalah

1. Bagaimana merancang sistem monitoring kualitas air limbah industri tekstil yang mampu melakukan pemantauan secara real-time?
2. Bagaimana mengintegrasikan Artificial Intelligence dan Internet of Things untuk mendukung deteksi anomali, prediksi kualitas air, serta pemberian rekomendasi secara otomatis?
3. Bagaimana menyediakan dashboard monitoring yang membantu pelaku industri dan Dinas Lingkungan Hidup melakukan pengambilan keputusan secara cepat dan berbasis data?

## 1.3 Tujuan Pengembangan

1. Mengembangkan platform monitoring kualitas air limbah industri tekstil berbasis web yang terintegrasi dengan sensor IoT.
2. Mengimplementasikan Artificial Intelligence untuk analisis data, deteksi anomali, prediksi kualitas air, serta pemberian rekomendasi tindakan.
3. Membangun Early Warning System yang mampu memberikan notifikasi ketika kualitas air mendekati atau melebihi baku mutu.

## 1.4 Manfaat Pengembangan

### Industri Tekstil
- Monitoring kualitas air limbah secara real-time melalui IoT.
- Deteksi potensi pencemaran sejak dini.
- Mendukung keputusan operasional melalui analisis berbasis AI.

### Dinas Lingkungan Hidup
- Pengawasan kualitas air limbah industri secara terintegrasi dan berkelanjutan.
- Data monitoring sebagai dasar evaluasi dan kebijakan.
- Respons lebih efektif terhadap potensi pencemaran.

### Masyarakat
- Mengurangi risiko pencemaran badan air.
- Mendukung lingkungan yang lebih bersih, sehat, dan berkelanjutan.
- Mendukung pengelolaan limbah industri yang lebih bertanggung jawab.

### Dunia Akademik
- Referensi sistem monitoring lingkungan berbasis AI dan IoT.
- Mendukung penelitian lanjutan.
- Contoh implementasi sistem pendukung keputusan berbasis data.

### Pembangunan Berkelanjutan
- Mendukung SDG 6.
- Mendukung SDG 9.
- Mendukung SDG 12.

## 1.5 Batasan Pengembangan

1. Perangkat lunak dikembangkan sebagai aplikasi berbasis web yang responsif.
2. Studi kasus difokuskan pada monitoring kualitas air limbah industri batik di Kota Pekalongan.
3. Parameter yang dipantau:
   - pH
   - suhu
   - TDS
   - turbidity
   - DO
   - COD
   - BOD
   - TSS
4. Data diperoleh dari sensor IoT yang mengirimkan data secara berkala ke server.
5. Artificial Intelligence digunakan untuk deteksi anomali, prediksi kualitas air, dan pemberian rekomendasi.
6. Sistem menerapkan Role-Based Access Control (RBAC) dengan tiga jenis pengguna:
   - Administrator
   - Industri Tekstil
   - Dinas Lingkungan Hidup
7. Perangkat lunak berfungsi sebagai **Decision Support System (DSS)** dan **tidak melakukan pengendalian otomatis terhadap instalasi pengolahan limbah**.
8. Pengembangan difokuskan pada MVP yang mencakup:
   - monitoring,
   - analisis AI,
   - dashboard,
   - notifikasi,
   - pelaporan.

---

# BAB II — METODOLOGI PENGEMBANGAN

## 2.1 Metode Pengembangan

SmartWater Analytics Platform menggunakan Agile Software Development dengan pendekatan Scrum yang bersifat iteratif dan inkremental.

Agile dipilih karena sistem mengintegrasikan:
- Internet of Things,
- Artificial Intelligence,
- dashboard web,
- sistem notifikasi.

## 2.2 Tahapan Pengembangan

### 2.2.1 Requirement Analysis dan Product Backlog
Kebutuhan sistem diidentifikasi melalui studi literatur, analisis masalah, observasi, dan kebutuhan pengguna, lalu disusun menjadi Product Backlog.

### 2.2.2 Sprint Planning
Tim menentukan prioritas fitur dan target pengembangan pada setiap sprint.

### 2.2.3 Sprint Development
Fitur dikembangkan meliputi:
- antarmuka,
- backend,
- database,
- integrasi IoT,
- model AI,
- dashboard.

### 2.2.4 Sprint Review
Fitur dievaluasi untuk memastikan kesesuaian dengan kebutuhan pengguna.

### 2.2.5 Sprint Retrospective
Tim mengevaluasi proses kerja dan kendala sprint.

### 2.2.6 Testing dan Deployment
Sistem diuji menggunakan Black Box Testing dan diimplementasikan pada server setelah fungsi dinyatakan sesuai kebutuhan.

---

# BAB III — PERANCANGAN DAN IMPLEMENTASI PERANGKAT LUNAK

## 3.1 Analisis Kebutuhan

### 3.1.1 Kebutuhan Fungsional

Sistem dirancang untuk:
- melakukan autentikasi pengguna sesuai hak akses,
- menerima dan menyimpan data kualitas air dari sensor IoT secara real-time,
- menampilkan dashboard dan grafik historis kualitas air,
- melakukan analisis AI berupa deteksi anomali dan prediksi kualitas air,
- memberikan notifikasi dini dan menghasilkan laporan monitoring,
- mengelola data pengguna dan perangkat sensor.

### 3.1.2 Kebutuhan Nonfungsional

- Availability — dapat diakses melalui internet.
- Performance — mampu memproses data real-time dengan respons cepat.
- Security — autentikasi dan RBAC.
- Scalability — mendukung penambahan sensor dan lokasi industri.
- Usability — antarmuka mudah digunakan.

### 3.1.3 Identifikasi Pengguna

**Administrator**
- mengelola pengguna,
- mengelola sensor,
- mengelola konfigurasi sistem.

**Industri Tekstil**
- memantau kualitas air,
- menerima notifikasi,
- mengakses hasil analisis,
- mengakses laporan.

**Dinas Lingkungan Hidup**
- memantau seluruh industri,
- mengevaluasi kualitas air,
- mengakses laporan monitoring.

## 3.2 Perancangan Sistem

### 3.2.1 Arsitektur Sistem

Empat lapisan utama:
1. **IoT Layer** — mengumpulkan data dari sensor kualitas air.
2. **Application Layer** — memproses data, menjalankan logika bisnis, dan analisis AI.
3. **Database Layer** — menyimpan data monitoring, pengguna, dan hasil analisis.
4. **Presentation Layer** — menampilkan dashboard, notifikasi, dan laporan.

### 3.2.2 Desain Solusi

Data dari sensor dikirim ke server, divalidasi dan disimpan dalam database, kemudian dianalisis oleh modul AI. Hasil analisis ditampilkan pada dashboard. Sistem mengirimkan notifikasi apabila terdeteksi potensi pencemaran.

## 3.3 Implementasi Perangkat Lunak

### 3.3.1 Implementasi Perangkat Keras

Perangkat keras terdiri atas sensor kualitas air yang terhubung dengan mikrokontroler **ESP32**.

Data hasil pengukuran dikirim ke server melalui:
- HTTP, atau
- MQTT.

### 3.3.2 Implementasi Perangkat Lunak

Empat komponen utama:

**Frontend**
- dashboard monitoring,
- grafik,
- notifikasi,
- laporan,
- manajemen pengguna.

**Backend**
- proses bisnis,
- autentikasi,
- REST API,
- integrasi AI,
- integrasi database.

**Database**
- data pengguna,
- sensor,
- hasil monitoring,
- analisis AI,
- laporan.

**Artificial Intelligence Engine**
- deteksi anomali,
- prediksi kualitas air,
- rekomendasi.

### 3.3.3 Implementasi Hak Akses Pengguna

RBAC dengan:
- Administrator,
- Industri Tekstil,
- DLH.

---

# BAB IV — MOCK UP INTERFACE

## 4.1 Halaman Login

Halaman Login merupakan gerbang autentikasi bagi seluruh pengguna SmartWater Analytics Platform.

RBAC menentukan hak akses untuk:
- Administrator,
- Industri Tekstil,
- DLH.

Komponen:
- Email atau Username
- Password + show/hide
- Ingat Saya
- Masuk ke Platform
- Lupa Password
- Informasi IT Support

## 4.2 Dashboard Monitoring dan Manajemen Sistem

Digunakan oleh DLH dan Administrator sesuai hak akses masing-masing.

### Fitur DLH
- monitoring jumlah stasiun aktif,
- status industri Normal, Warning, Critical, Offline,
- peta GIS lokasi industri,
- Live Incident Feed,
- Industrial Compliance Tracking,
- Water Quality Index trend,
- prediksi risiko pencemaran berbasis AI.

### Fitur Administrator
- monitoring jumlah perangkat aktif,
- System Health,
- Failed Nodes,
- jumlah pengguna aktif,
- manajemen perangkat IoT,
- pencarian dan penyaringan perangkat,
- Provision New Device,
- status koneksi Active, Unstable, Offline.

## 4.4 Halaman Mobile — Pemilik Batik

Antarmuka untuk pelaku industri memantau kualitas air limbah pada lokasi usahanya secara near real-time.

Menyajikan:
- ringkasan status kualitas air,
- nilai parameter utama seperti pH, suhu, kekeruhan, TDS,
- grafik tren monitoring,
- daftar peringatan,
- analisis AI berupa tingkat risiko dan rekomendasi tindakan.

Fitur:
- monitoring kondisi kualitas air terkini,
- nilai dan status setiap parameter,
- histori perubahan kualitas air,
- daftar peringatan berdasarkan tingkat keparahan,
- detail anomali dan faktor penyebab,
- prediksi risiko pencemaran berbasis AI,
- checklist rekomendasi penanganan,
- navigasi menuju monitoring, peringatan, analisis AI, dan profil.

---

# Source-grounded implementation constraints

These are directly supported by the proposal:

1. SmartWater is a responsive web-based application.
2. Study case: batik/textile wastewater in Pekalongan.
3. All eight listed water-quality parameters remain part of the system domain.
4. ESP32 is the specified microcontroller context.
5. IoT data can be transmitted via HTTP or MQTT.
6. Backend context includes REST API.
7. AI capabilities are anomaly detection, prediction, and recommendations.
8. RBAC has three user categories: Administrator, Textile Industry, and DLH.
9. The MVP includes monitoring, AI analysis, dashboard, notifications, and reporting.
10. SmartWater is a Decision Support System.
11. The proposal explicitly states that the software does **not** automatically control wastewater-treatment installations.

Therefore, mockup wording such as “Execute Actions” or “Initial system auto-purge initiated” must not be interpreted as direct autonomous physical control of IPAL equipment. Any implementation should preserve the proposal's DSS boundary.
