-- ZenAI cloud persistence
-- Jalankan sekali di Supabase SQL Editor.

create table if not exists public.zenai_user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.zenai_user_state enable row level security;

drop policy if exists "Users can read own ZenAI state" on public.zenai_user_state;
create policy "Users can read own ZenAI state"
  on public.zenai_user_state
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own ZenAI state" on public.zenai_user_state;
create policy "Users can insert own ZenAI state"
  on public.zenai_user_state
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own ZenAI state" on public.zenai_user_state;
create policy "Users can update own ZenAI state"
  on public.zenai_user_state
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists zenai_user_state_updated_at_idx
  on public.zenai_user_state(updated_at);
