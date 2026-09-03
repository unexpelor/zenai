# Security & Privacy Documentation

## 1. Prinsip

ZenAI memisahkan credential provider dari client dan menggunakan autentikasi untuk endpoint API yang membutuhkan sesi pada environment production.

## 2. Authentication

Client mengirim access token pada:

`Authorization: Bearer <access-token>`

Server memverifikasi sesi melalui Supabase Auth.

## 3. Authorization

Data persistence menggunakan Row Level Security (RLS). Policy utama membatasi operasi terhadap:

`auth.uid() = user_id`

Dengan demikian, user tidak seharusnya dapat membaca atau mengubah row milik user lain melalui policy database.

## 4. Secret Management

Credential berikut harus berada di environment server/deployment secret:

- Groq API key
- OpenRouter API key
- Gemini API key
- Tavily API key

`NEXT_PUBLIC_*` hanya digunakan untuk nilai yang memang dimaksudkan tersedia di client. Jangan menaruh provider secret pada variable public.

## 5. Request Protection

Implementasi menyediakan batas ukuran payload/prompt/media dan rate limiting in-memory pada API yang relevan.

## 6. Security Headers

Security headers dasar dikonfigurasi melalui `next.config.mjs`.

## 7. Development Bypass

`ZENAI_ALLOW_UNAUTHENTICATED_API=true` hanya dimaksudkan untuk development ketika `NODE_ENV` bukan production. Jangan mengaktifkannya pada deployment production.

## 8. Privacy

Saat Supabase aktif dan user login, state aplikasi disimpan berdasarkan user. Data keuangan tidak dirancang untuk disimpan pada `localStorage` pada implementasi saat ini.

Jika Supabase tidak tersedia, sebagian data hanya bertahan selama sesi browser sesuai implementasi aplikasi.

## 9. Batasan Keamanan

- Rate limiting belum distributed karena menggunakan memory per server instance.
- Audit keamanan formal belum dibuktikan hanya dengan health check.
- Sebelum production, lakukan pengujian authorization, abuse/rate-limit, input validation, dan dependency audit.
