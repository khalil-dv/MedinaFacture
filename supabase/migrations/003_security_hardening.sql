-- ============================================================
-- IziFacture — Migration 003 : durcissement sécurité & données
-- À exécuter dans le SQL Editor de Supabase, après 001 et 002.
-- ============================================================

-- ---------- 1. Privilèges minimaux ----------
-- anon ne doit pouvoir ni lire ni écrire les tables public :
-- toute l'application passe par RLS avec le rôle authenticated.
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke all on all functions in schema public from anon;
revoke all on schema public from anon;

grant usage on schema public to anon;
grant usage on schema public to authenticated;

grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;
grant execute on all functions in schema public to authenticated;

-- Les futurs objets créés conservent les mêmes privilèges.
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public grant all on tables to authenticated;
alter default privileges in schema public revoke all on sequences from anon;
alter default privileges in schema public grant all on sequences to authenticated;
alter default privileges in schema public revoke all on functions from anon;
alter default privileges in schema public grant execute on functions to authenticated;

-- ---------- 2. Contraintes de cohérence des données ----------
-- PostgreSQL ne supporte pas IF NOT EXISTS pour ADD CONSTRAINT,
-- on utilise DO/EXCEPTION pour ignorer les contraintes déjà en place.

DO $$ BEGIN
  alter table public.invoices add constraint invoices_amounts_non_negative
    check (subtotal >= 0 and vat_amount >= 0 and total >= 0 and amount_paid >= 0);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  alter table public.invoices add constraint invoices_amount_paid_leq_total
    check (amount_paid <= total);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  alter table public.invoices add constraint invoices_vat_rate_non_negative
    check (vat_rate >= 0);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  alter table public.invoice_lines add constraint invoice_lines_quantity_positive
    check (quantity > 0);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  alter table public.invoice_lines add constraint invoice_lines_unit_price_non_negative
    check (unit_price >= 0);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  alter table public.company_settings add constraint company_settings_due_days_positive
    check (payment_due_days > 0);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
