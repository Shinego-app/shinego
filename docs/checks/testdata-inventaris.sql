-- Alleen-lezen inventaris. NIET automatisch verwijderen op basis van deze signalen.
-- Eerst projectidentiteit en werkelijke schema's controleren. Bevat geen DELETE/UPDATE.
select table_schema, table_name, column_name, data_type
from information_schema.columns
where (table_schema = 'public' and table_name in ('boekingen','professionals','reviews'))
   or (table_schema = 'auth' and table_name = 'users')
order by table_schema, table_name, ordinal_position;

-- Controleer cascadegedrag in de werkelijke database, niet alleen in de repository.
select conrelid::regclass as tabel, conname, pg_get_constraintdef(oid) as definitie
from pg_constraint
where contype = 'f' and connamespace = 'public'::regnamespace;

select 'boekingen' as tabel, count(*) as aantal from public.boekingen
union all select 'professionals', count(*) from public.professionals
union all select 'reviews', count(*) from public.reviews
union all select 'auth.users', count(*) from auth.users;

-- Minimale kenmerken voor handmatige beoordeling; geen adressen, tokens of wachtwoorden.
select b.id, b.status, b.betaald, b.professional_id,
       (select count(*) from public.reviews r where r.booking_id = b.id) as reviews,
       nullif(to_jsonb(b)->>'stripe_payment_id','') is not null as heeft_stripe_betaling,
       to_jsonb(b)->>'uitbetaald' as uitbetaald,
       case when lower(coalesce(to_jsonb(b)->>'email','')) ~ '@(example\.(com|org|net)|[^@]+\.invalid)$'
            then 'gereserveerd testdomein; eigenaar moet bevestigen'
            when lower(coalesce(to_jsonb(b)->>'voornaam','')) ~ '^(test|demo)$'
            then 'naam bevat testsignaal; onvoldoende bewijs'
            else 'geen eenvoudig testsignaal' end as signaal
from public.boekingen b order by b.id;

select p.id, p.user_id, p.actief, p.geverifieerd,
       (select count(*) from public.boekingen b where b.professional_id = p.id) as gekoppelde_boekingen,
       (select count(*) from public.boekingen b where b.geannuleerde_professional_id = p.id) as eerdere_annuleringen,
       nullif(to_jsonb(p)->>'stripe_account_id','') is not null as heeft_stripe_account
from public.professionals p order by p.id;

select r.id, r.booking_id, r.rating, r.zichtbaar, b.status, b.betaald, b.professional_id
from public.reviews r left join public.boekingen b on b.id = r.booking_id order by r.id;

select u.id, u.created_at, u.last_sign_in_at,
       exists(select 1 from public.professionals p where p.user_id = u.id) as heeft_professionalprofiel,
       case when lower(coalesce(u.email,'')) ~ '@(example\.(com|org|net)|[^@]+\.invalid)$'
            then 'gereserveerd testdomein; eigenaar moet bevestigen'
            else 'geen eenvoudig testsignaal' end as signaal
from auth.users u order by u.created_at;
