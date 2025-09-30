# AGENTS.md - Panduan Pengembangan Watashime API

## Project Overview

Watashime adalah proyek API berbasis TypeScript yang menggunakan framework Hono untuk membangun server API yang cepat. Proyek ini dikembangkan untuk melakukan scraping informasi anime dari website Samehadaku.

## Technologies

- **Language:** TypeScript
- **Runtime/Framework:** Bun, Hono
- **Package Manager:** Bun
- **Build Tool:** Bun
- **Linter:** ESLint
- **Formatter:** Prettier
- **Environment Management:** dotenv
- **Web Scraping:** Cheerio
- **Redis:** Upstash Redis (untuk caching data slug)

## Project Structure

```
src/
├── config/          # File konfigurasi (Redis, dll)
├── controllers/     # Handler request/response
├── middleware/      # Fungsi middleware (logging, dll)
├── routes/          # Definisi route
├── scrapers/        # Logika web scraping
├── services/        # Business logic
├── types/           # Definisi tipe TypeScript
├── utils/           # Fungsi utilitas
├── index.ts         # Entry point aplikasi
```

### Layer Responsibilities

1. **`index.ts`**: Entry point aplikasi, inisialisasi Hono app, load environment variables
2. **`routes/`**: Mendefinisikan endpoint API dan menghubungkannya ke controller
3. **`controllers/`**: Menangani request masuk, memanggil services, dan memformat response
4. **`services/`**: Berisi business logic, mengkoordinasikan scrapers
5. **`scrapers/`**: Implementasi fungsi web scraping
6. **`middleware/`**: Concerns lintas aplikasi seperti logging, otentikasi
7. **`types/`**: Interface dan tipe TypeScript
8. **`utils/`**: Fungsi bantuan
9. **`config/`**: File konfigurasi untuk layanan eksternal seperti Redis

## Coding Conventions

### Naming Conventions

- Gunakan PascalCase untuk class dan interface
- Gunakan camelCase untuk fungsi, variabel, dan properti
- Gunakan UPPER_SNAKE_CASE untuk konstanta
- Gunakan format `-- nama fungsi --` untuk komentar yang mengelompokkan fungsi (ini penting karena aturan ESLint)

### TypeScript Usage

- Gunakan `type` daripada `interface` untuk tipe sederhana
- Gunakan interface untuk objek kompleks dan struktur data
- Sertakan tipe eksplisit untuk parameter fungsi dan return type
- Gunakan `strict: true` dalam konfigurasi TypeScript
- Gunakan `explicit-function-return-type` untuk semua fungsi publik

### Comments

- Gunakan format `// -- Nama Fungsi --` untuk membedakan fungsi
- Hindari komentar yang tidak berguna karena ESLint akan menghapus komentar yang tidak mengandung `--`
- Gunakan komentar untuk menjelaskan "mengapa" sesuatu dilakukan, bukan "apa" yang dilakukan

### Import Sorting

- Gunakan aturan ESLint `simple-import-sort` untuk mengurutkan import
- Import eksternal terlebih dahulu, kemudian import internal
- Urutkan berdasarkan abjad dan pengelompokan

### ESLint Rules

- Gunakan `eqeqeq: 'always'` untuk perbandingan ketat
- Gunakan `curly: ['error', 'all']` untuk semua blok pernyataan
- Gunakan `no-var: 'error'` dan `prefer-const: 'error'` untuk menghindari var
- Gunakan `@typescript-eslint/no-unused-vars: 'warn'` untuk variabel yang tidak digunakan
- Gunakan `@typescript-eslint/explicit-function-return-type: 'warn'` untuk semua fungsi
- Gunakan `@typescript-eslint/consistent-type-imports: 'error'` untuk import tipe
- Gunakan `complexity: ['warn', 10]` untuk batas kompleksitas fungsi
- Gunakan `max-lines: ['warn', { max: 300, ... }]` untuk batas jumlah baris per file
- Gunakan `max-depth: ['warn', 4]` untuk batas kedalaman bersarang
- Gunakan aturan `no-useless-comments` untuk menghapus komentar tidak berguna

### Prettier Configuration

- Gunakan `semi: true` (tambahkan titik koma)
- Gunakan `singleQuote: true` (tanda kutip tunggal)
- Gunakan `trailingComma: 'es5'` (koma tambahan di akhir)
- Gunakan `printWidth: 80` (lebar maksimal 80 karakter)
- Gunakan `tabWidth: 2` (lebar tab 2 spasi)

## Update Management

File ini harus diperbarui ketika terjadi perubahan signifikan pada:

- Struktur proyek
- Teknologi yang digunakan
- Konvensi penamaan
- Aturan ESLint atau Prettier
- Pola arsitektur
- Praktik pengembangan

## Do

- Gunakan TypeScript secara penuh untuk type safety
- Ikuti prinsip separation of concerns dalam arsitektur
- Gunakan caching Redis untuk data yang sering diakses
- Tambahkan logging konsisten untuk debugging
- Gunakan error handling yang konsisten di setiap layer
- Buat interface tipe yang jelas dan dokumentasi
- Gunakan Prettier dan ESLint untuk menjaga konsistensi kode
- Gunakan komentar dalam format `// -- Nama Fungsi --` untuk membedakan fungsi
- Gunakan import type untuk tipe TypeScript
- Gunakan async/await untuk operasi asinkron
- Gunakan try/catch untuk menangani error
- Gunakan return eksplisit untuk tipe yang jelas
- Perbarui AGENTS.md ketika melakukan perubahan signifikan pada arsitektur atau praktik pengembangan

## Don't

- Jangan gunakan var, gunakan const atau let
- Jangan gunakan ==, gunakan === untuk perbandingan
- Jangan biarkan variabel tidak digunakan
- Jangan gunakan komentar yang tidak berguna (akan dihapus oleh ESLint)
- Jangan hardcode nilai-nilai, gunakan environment variables
- Jangan taruh logika bisnis di controller, pindahkan ke service
- Jangan taruh logika scraping di service, pindahkan ke scraper
- Jangan lupa menangani error di setiap layer
- Jangan gunakan console.log untuk produksi (gunakan logging service)
- Jangan gunakan struktur yang terlalu dalam (max depth 4)
- Jangan buat file yang terlalu panjang (max 300 baris)
- Jangan gunakan tanda komentar "//" berlebihan kecuali dalam format "// -- Nama Fungsi --"
- Jangan abaikan pembaruan AGENTS.md ketika melakukan perubahan besar pada proyek
