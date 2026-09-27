# Website Pembelajaran Kabel UTP

Website edukasi kabel UTP (Unshielded Twisted Pair): penjelasan, urutan warna standar
T568A/T568B, tata cara crimping, dashboard unggah/unduh materi (PPT & video), dan profil
mahasiswa serta dosen pengampu. Dibangun dengan Next.js, tampilan responsif dengan gaya
"liquid glass" bertema biru.

## Menjalankan di komputer lokal

Pastikan Node.js versi 18 ke atas sudah terpasang, lalu jalankan:

```bash
npm install
npm run dev
```

Buka http://localhost:3000 di browser.

## Menyunting konten

- **Profil mahasiswa & dosen**: edit objek `PROFIL` di bagian atas `pages/index.js`.
- **Urutan warna / standar**: objek `WIRE` dan `STANDARDS` di `pages/index.js`.
- **Tabel kategori kabel & langkah crimping**: objek `KATEGORI_KABEL` dan `LANGKAH`.
- **Warna & tema**: variabel di baris atas `styles/globals.css` (`:root { ... }`).

## Deploy ke Vercel

1. Push folder ini ke repository GitHub/GitLab/Bitbucket.
2. Buka https://vercel.com, pilih **New Project**, lalu impor repository tersebut.
3. Vercel otomatis mendeteksi framework Next.js — biarkan pengaturan default, lalu klik **Deploy**.

Atau lewat CLI:

```bash
npm install -g vercel
vercel
```

## Catatan penting tentang penyimpanan berkas (upload PPT & video)

Fitur unggah pada proyek ini menyimpan file ke folder `public/uploads` melalui API route
(`pages/api/upload.js`). Ini berjalan sempurna saat dijalankan secara lokal (`npm run dev`)
atau di server tradisional.

Namun, **Vercel menjalankan aplikasi di lingkungan serverless** yang sistem berkasnya bersifat
sementara (ephemeral) — setiap berkas yang diunggah bisa hilang saat fungsi di-restart atau
di-deploy ulang. Untuk kebutuhan tugas/demo skala kecil ini biasanya masih cukup, tetapi untuk
penggunaan produksi/jangka panjang, disarankan mengganti penyimpanan dengan salah satu dari:

- **Vercel Blob Storage** (`@vercel/blob`) — paling mudah diintegrasikan dengan Vercel.
- **Supabase Storage** atau **Amazon S3** — untuk kontrol penuh dan kapasitas lebih besar.

Bila diperlukan, bagian `pages/api/upload.js` dan `pages/api/files.js` bisa diganti agar
memanggil layanan tersebut alih-alih `fs` lokal — struktur data (`nama`, `kategori`, `ukuran`,
`url`) tetap bisa dipertahankan.

## Struktur proyek

```
pages/
  _app.js          -> pembungkus global (memuat CSS)
  index.js         -> seluruh halaman (hero, materi, dashboard, profil)
  api/
    upload.js      -> menerima unggahan PPT/video
    files.js       -> daftar & hapus berkas
styles/
  globals.css      -> tema liquid glass biru, responsif
data/
  files.json       -> metadata berkas yang diunggah (otomatis terisi)
public/
  uploads/         -> lokasi fisik berkas yang diunggah
```
