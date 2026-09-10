# Arsitektur Teknis ZenAI

## 1. Layer

### Presentation Layer

- Next.js App Router
- React
- `app/page.js`
- `components/BusinessGrowthLoop.jsx`
- `app/globals.css`

### Application/API Layer

- `app/api/ai/route.js`
- `app/api/autopilot/route.js`
- `app/api/marketplace/route.js`
- `app/api/health/route.js`

### Integration Layer

- Supabase Auth + Database
- Groq
- OpenRouter
- Gemini
- Tavily

### Persistence Layer

Tabel utama:

`public.zenai_user_state`

## 2. AI Request Flow

```text
User input
   ↓
Client validation
   ↓
API route
   ↓
Authentication / security checks
   ↓
AI request
   ↓
Provider selection
   ├── Groq
   ├── OpenRouter
   └── Gemini
   ↓
Response normalization
   ↓
UI
```

## 3. Text Provider Fallback

```text
Request
  ↓
Groq
  ├─ success → return
  └─ fail
       ↓
OpenRouter
  ├─ success → return
  └─ fail
       ↓
Gemini
  ├─ success → return
  └─ fail → error
```

## 4. Market Insight Flow

```text
Business context
      ↓
Query generation
      ↓
Tavily search
      ↓
Result normalization
      ↓
AI analysis
      ↓
Market Insight
```

## 5. Autopilot Flow

```text
Business context + goal
          ↓
     /api/autopilot
          ↓
     AI generation
          ↓
     structured result
          ↓
  action plan 7/14/30 hari
          ↓
          UI
```

## 6. Persistence Flow

```text
Authenticated user
       ↓
Supabase Auth
       ↓
zenai_user_state
       ↓
JSONB state
       ↓
RLS: auth.uid() = user_id
```

## 7. Design Decision: JSONB State

State utama saat ini disimpan sebagai satu JSONB. Keuntungannya adalah implementasi MVP lebih sederhana dan seluruh state pengguna dapat disinkronkan sebagai satu unit.

Trade-off: query analitik dan pemisahan domain belum sebaik model tabel terstruktur. Jika produk berkembang ke skala besar, state dapat diekstraksi menjadi tabel domain seperti diagnosis, update, autopilot, dan transaksi.
