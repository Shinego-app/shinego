-- ShineGo security lockdown
-- Directe browser-writes naar kern-tabellen blokkeren.
-- Serverroutes blijven schrijven via de Supabase service role.
-- SELECT-rechten blijven ongemoeid zodat bestaande RLS-leespolicies blijven werken.

begin;

alter table public.boekingen enable row level security;
alter table public.professionals enable row level security;

revoke insert, update, delete on table public.boekingen from anon, authenticated;
revoke insert, update, delete on table public.professionals from anon, authenticated;

commit;
