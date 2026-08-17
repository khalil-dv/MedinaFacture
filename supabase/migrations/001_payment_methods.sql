-- ============================================================
-- MedinaFacture — Migration : coordonnées de paiement + mode par facture
-- Exécuter DANS L'ÉDITEUR SQL Supabase (projet déjà initialisé)
-- ============================================================

-- Coordonnées de paiement de l'entreprise (affichées sur chaque facture)
alter table public.company_settings
  add column if not exists bank_name text not null default '',
  add column if not exists bank_account_name text not null default '',
  add column if not exists bank_account_number text not null default '',
  add column if not exists wave_number text not null default '',
  add column if not exists orange_money_number text not null default '';

-- Mode de paiement choisi pour CHAQUE facture (défaut : celui de l'entreprise)
alter table public.invoices
  add column if not exists payment_method text not null default 'Virement bancaire';
