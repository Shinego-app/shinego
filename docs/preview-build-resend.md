# Preview build: ontbrekende Resend-sleutel

De Vercel-build van audit-PR #2 stopt bij module-evaluatie van de admin-inlogroute: new Resend(undefined). De audit wijzigde alleen documentatie; een automatische previewbuild legde deze bestaande configuratie-afhankelijkheid bloot.

## Wijziging
Alle 14 routes met dezelfde eager Resend-initialisatie importeren nu één serverhelper. Deze leest RESEND_API_KEY uitsluitend bij emails.send en geeft zonder sleutel een SDK-compatibele fout terug (data null, error missing_api_key); er wordt niets verstuurd. Met sleutel worden payload en verzendopties ongewijzigd doorgegeven. Geen authenticatie-, betalings-, database- of opdrachtlogica aangepast. Ook in de Stripe-webhook is uitsluitend de e-mailimport vervangen. Geen sleutels, omgevingsvariabelen of providerinstellingen gewijzigd.

Het lockbestand is gesynchroniseerd met de al bestaande package.json-versies Next.js/eslint-config-next 16.3.3. npm ci faalde vooraf omdat het lockbestand nog 16.3.0 bevatte. package.json is niet gewijzigd.

## Verificatie (20 oktober 2026)
- Gelezen: AGENTS.md en geïnstalleerde Next.js-documentatie over routehandlers en environment variables.
- node --test tests/resend.test.mjs: geslaagd; import zonder sleutel, geen netwerkverzoek bij ontbrekende sleutel, mock-succes met behoud payload en idempotencyKey, mock-providerfout. Geen echte e-mails verstuurd. Test uitgevoerd met Node 24; de test gebruikt ingebouwde TypeScript-ondersteuning.
- npm ci --dry-run --ignore-scripts: geslaagd met bijgewerkt lockbestand.
- next build inclusief TypeScript: geslaagd zonder RESEND_API_KEY, met uitsluitend fictieve lokale Supabase/Stripe-testwaarden; geen productiegeheimen gebruikt. Alle 73 statische pagina's gegenereerd. Dit bewijst geen geldige live integratie.
- Zonder enige integratieconfiguratie stopt de build nog op bestaande Supabase-initialisatie (supabaseUrl is required). De PR maakt previews niet volledig onafhankelijk van andere vereiste configuratie.
- Lokale productie-server: homepage HTTP 200; admin request-code zonder mailkey HTTP 500 met bestaande gebruikersmelding, zonder challengecookie. Alleen deze route en homepage aangeroepen, geen database- of betalingsverzoeken.
- Volledige ESLint: baseline en branch beide 63 fouten en 15 waarschuwingen; dezelfde aantallen per bestand, regel-ID en severity. Geen nieuwe lintproblemen. Bestaande lintschuld niet in deze reparatie opgelost.
- git diff --check: geslaagd.

## Voor publicatie
PR nog niet mergen of naar productie publiceren zonder expliciete toestemming. Werkelijke previewconfiguratie en runtime met bestaande geldige Resend-sleutel nog te verifiëren via geautoriseerde Vercel-teamtoegang. Geen productiecredentials naar previews kopiëren als onderdeel van deze wijziging. Foutafhandeling blijft expliciet: geen sleutel betekent geen verzonden e-mail en geen succesvol adminloginproces.
