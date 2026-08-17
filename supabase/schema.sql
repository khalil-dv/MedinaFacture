-- ============================================================
-- IziFacture — Schéma Supabase
-- Exécuter tout ce fichier dans l'éditeur SQL de Supabase
-- (Dashboard > SQL Editor > New query)
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ---------- Tables ----------

-- Profil public (1 ligne par utilisateur)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Réglages société (1 ligne par utilisateur)
create table if not exists public.company_settings (
  user_id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'IziFacture',
  owner_name text not null default '',
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  tax_id text not null default '',
  logo_data_url text,
  default_vat_rate numeric not null default 18,
  currency text not null default 'XOF',
  country text not null default 'Sénégal',
  language text not null default 'Français',
  date_format text not null default 'jj/mm/aaaa',
  payment_due_days integer not null default 30,
  invoice_prefix text not null default 'INV',
  default_payment_method text not null default 'Virement bancaire',
  payment_reminders boolean not null default true,
  default_notes text not null default 'Paiement à réception. Merci de votre confiance !',
  bank_name text not null default '',
  bank_account_name text not null default '',
  bank_account_number text not null default '',
  wave_number text not null default '',
  orange_money_number text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Clients
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  email text not null default '',
  phone text not null default '',
  address text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Factures (montants en FCFA, entiers)
create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete restrict,
  number text not null,
  issue_date date not null,
  due_date date not null,
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue')),
  vat_rate numeric not null default 0,
  subtotal bigint not null default 0,
  vat_amount bigint not null default 0,
  total bigint not null default 0,
  amount_paid bigint not null default 0,
  notes text not null default '',
  payment_method text not null default 'Virement bancaire',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, number)
);

create index if not exists invoices_user_id_idx on public.invoices (user_id);
create index if not exists invoices_client_id_idx on public.invoices (client_id);

-- Lignes de facture
create table if not exists public.invoice_lines (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id) on delete cascade,
  description text not null,
  quantity numeric not null default 1,
  unit_price bigint not null default 0
);

create index if not exists invoice_lines_invoice_id_idx on public.invoice_lines (invoice_id);

-- ---------- Trigger : nouveau compte utilisateur ----------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''));

  insert into public.company_settings (user_id)
  values (new.id);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Trigger : updated_at ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists company_settings_updated_at on public.company_settings;
create trigger company_settings_updated_at
  before update on public.company_settings
  for each row execute function public.set_updated_at();

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists invoices_updated_at on public.invoices;
create trigger invoices_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

-- ---------- Sécurité (RLS) ----------
alter table public.profiles enable row level security;
alter table public.company_settings enable row level security;
alter table public.clients enable row level security;
alter table public.invoices enable row level security;
alter table public.invoice_lines enable row level security;

-- profiles
drop policy if exists "profiles select own" on public.profiles;
create policy "profiles select own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- company_settings
drop policy if exists "company_settings select own" on public.company_settings;
create policy "company_settings select own" on public.company_settings
  for select using (auth.uid() = user_id);

drop policy if exists "company_settings update own" on public.company_settings;
create policy "company_settings update own" on public.company_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "company_settings insert own" on public.company_settings;
create policy "company_settings insert own" on public.company_settings
  for insert with check (auth.uid() = user_id);

-- clients
drop policy if exists "clients select own" on public.clients;
create policy "clients select own" on public.clients
  for select using (auth.uid() = user_id);

drop policy if exists "clients insert own" on public.clients;
create policy "clients insert own" on public.clients
  for insert with check (auth.uid() = user_id);

drop policy if exists "clients update own" on public.clients;
create policy "clients update own" on public.clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clients delete own" on public.clients;
create policy "clients delete own" on public.clients
  for delete using (auth.uid() = user_id);

-- invoices
drop policy if exists "invoices select own" on public.invoices;
create policy "invoices select own" on public.invoices
  for select using (auth.uid() = user_id);

drop policy if exists "invoices insert own" on public.invoices;
create policy "invoices insert own" on public.invoices
  for insert with check (auth.uid() = user_id);

drop policy if exists "invoices update own" on public.invoices;
create policy "invoices update own" on public.invoices
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "invoices delete own" on public.invoices;
create policy "invoices delete own" on public.invoices
  for delete using (auth.uid() = user_id);

-- invoice_lines
drop policy if exists "invoice_lines select own" on public.invoice_lines;
create policy "invoice_lines select own" on public.invoice_lines
  for select using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

drop policy if exists "invoice_lines insert own" on public.invoice_lines;
create policy "invoice_lines insert own" on public.invoice_lines
  for insert with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

drop policy if exists "invoice_lines update own" on public.invoice_lines;
create policy "invoice_lines update own" on public.invoice_lines
  for update using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

drop policy if exists "invoice_lines delete own" on public.invoice_lines;
create policy "invoice_lines delete own" on public.invoice_lines
  for delete using (
    exists (
      select 1 from public.invoices
      where invoices.id = invoice_lines.invoice_id
        and invoices.user_id = auth.uid()
    )
  );

-- ---------- Droits ----------
grant usage on schema public to anon, authenticated;
grant all on all tables in schema public to anon, authenticated;
grant all on all sequences in schema public to anon, authenticated;
grant all on all functions in schema public to anon, authenticated;
