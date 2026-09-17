-- ShineGo security lockdown
-- Doel: alle directe writes vanuit de browser naar kern-tabellen blokkeren.
-- De applicatie schrijft voortaan via serverroutes met de Supabase service role.
-- SELECT-rechten worden hier bewust niet gewijzigd, zodat bestaande RLS-leespolicies
-- voor het professional-dashboard blijven werken.

begin;

alter table public.boekingen enable row level security;
alter table public.professionals enable row level security;

revoke insert, update, delete on table public.boekingen from anon, authenticated;
revoke insert, update, delete on table public.professionals from anon, authenticated;

commit;
