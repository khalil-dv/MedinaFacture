-- Durcissement RLS : les politiques UPDATE exigent désormais
-- que la ligne modifiée reste la propriété de l'utilisateur connecté.
-- (sécurité renforcée contre l'écriture de lignes appartenant à d'autres)

drop policy if exists "profiles update own" on public.profiles;
create policy "profiles update own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "company_settings update own" on public.company_settings;
create policy "company_settings update own" on public.company_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "clients update own" on public.clients;
create policy "clients update own" on public.clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "invoices update own" on public.invoices;
create policy "invoices update own" on public.invoices
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

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
