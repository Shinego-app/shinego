import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "../../../lib/supabaseAdmin";

const resend = new Resend(process.env.RESEND_API_KEY!);

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normaliseerDiensten(value: unknown) {
  const invoer = Array.isArray(value) ? value : [];
  const toegestaan = new Set(["glazenwasser", "telewash", "bedrijf", "binnen"]);
  const diensten = invoer
    .map((dienst) => String(dienst || "").toLowerCase())
    .map((dienst) => (dienst === "glazenwassen" ? "glazenwasser" : dienst))
    .filter((dienst) => toegestaan.has(dienst));

  if (!diensten.includes("glazenwasser")) diensten.unshift("glazenwasser");
  return Array.from(new Set(diensten));
}

async function verstuurAdminMelding(professional: any) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.shinego.nl").replace(/\/$/, "");
  // Gebruik hetzelfde beheeradres als de admin-inlogcodes. Dit voorkomt dat
  // registratiemeldingen per ongeluk naar een afwijkend notificatie-adres gaan.
  const beheerEmail = (process.env.ADMIN_LOGIN_EMAIL || "info@shinego.nl")
    .trim()
    .toLowerCase();
  const volledigeNaam =
    [professional.voornaam, professional.achternaam].filter(Boolean).join(" ") || "-";

  const { data: emailData, error: emailError } = await resend.emails.send({
    from: "ShineGo <noreply@shinego.nl>",
    to: beheerEmail,
    subject: `Nieuwe professional aangemeld - ${professional.bedrijfsnaam}`,
    html: `
      <h2>Nieuwe ShineGo-professional aangemeld</h2>
      <p>Er staat een nieuwe aanmelding klaar om te controleren.</p>
      <p><strong>Bedrijfsnaam:</strong> ${escapeHtml(professional.bedrijfsnaam)}</p>
      <p><strong>Naam:</strong> ${escapeHtml(volledigeNaam)}</p>
      <p><strong>E-mail:</strong> ${escapeHtml(professional.email || "-")}</p>
      <p><strong>Telefoon:</strong> ${escapeHtml(professional.telefoon || "-")}</p>
      <p><strong>Woonplaats:</strong> ${escapeHtml(professional.woonplaats || "-")}</p>
      <p><strong>KVK:</strong> ${escapeHtml(professional.kvk_nummer || "-")}</p>
      <p><strong>BTW:</strong> ${escapeHtml(professional.btw_nummer || "-")}</p>
      <p><a href="${siteUrl}/admin/professionals" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:600;">Aanmelding controleren</a></p>
    `,
  });

  if (emailError) {
    console.error("Adminmelding nieuwe professional mislukt:", emailError);
    return false;
  }

  console.info("Adminmelding nieuwe professional verstuurd:", {
    professional_id: professional.id,
    resend_email_id: emailData?.id || null,
  });
  return true;
}

async function markeerAdminMeldingVerstuurd(
  userId: string,
  appMetadata: Record<string, unknown> | null | undefined
) {
  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    app_metadata: {
      ...(appMetadata || {}),
      professional_admin_notification_sent_at: new Date().toISOString(),
    },
  });

  if (error) {
    console.error("Adminmelding-markering opslaan mislukt:", error);
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";

    if (!token) {
      return NextResponse.json({ error: "Niet ingelogd." }, { status: 401 });
    }

    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Ongeldige sessie." }, { status: 401 });
    }

    const metadata = user.user_metadata || {};
    const appMetadata = user.app_metadata || {};
    if (metadata.account_type && metadata.account_type !== "professional") {
      return NextResponse.json({ error: "Dit account is geen professional-account." }, { status: 403 });
    }

    const { data: bestaand, error: bestaandError } = await supabaseAdmin
      .from("professionals")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    if (bestaandError) {
      throw bestaandError;
    }

    if (bestaand) {
      // Als een eerdere verzendpoging mislukte, proberen we bij de eerstvolgende
      // geldige login opnieuw. De server-only app_metadata-markering voorkomt
      // dubbele mails bij latere logins.
      if (!appMetadata.professional_admin_notification_sent_at) {
        try {
          const meldingVerstuurd = await verstuurAdminMelding(bestaand);
          if (meldingVerstuurd) {
            await markeerAdminMeldingVerstuurd(user.id, appMetadata);
          }
        } catch (emailError) {
          console.error("Adminmelding bestaande professional fout:", emailError);
        }
      }

      return NextResponse.json({ professional: bestaand, already_exists: true });
    }

    const bedrijfsnaam = String(metadata.bedrijfsnaam || "").trim();
    const voornaam = String(metadata.voornaam || "").trim();
    const achternaam = String(metadata.achternaam || "").trim();
    const telefoon = String(metadata.telefoon || "").trim();
    const schoonTelefoon = telefoon.replace(/[\s().-]/g, "");
    const postcodeRaw = String(metadata.postcode || "").replace(/\s/g, "").toUpperCase();
    const postcode = /^[1-9][0-9]{3}[A-Z]{2}$/.test(postcodeRaw)
      ? `${postcodeRaw.slice(0, 4)} ${postcodeRaw.slice(4)}`
      : "";
    const woonplaats = String(metadata.woonplaats || "").trim();
    const straat = String(metadata.straat || "").trim();
    const huisnummer = String(metadata.huisnummer || "").trim();
    const kvkNummer = String(metadata.kvk_nummer || "").replace(/\D/g, "");
    const btwNummer = String(metadata.btw_nummer || "").replace(/[\s.\-]/g, "").toUpperCase();
    const avbVerzekeraar = String(metadata.avb_verzekeraar || "").trim();
    const avbPolisnummer = String(metadata.avb_polisnummer || "").trim();

    if (
      !bedrijfsnaam ||
      !voornaam ||
      !achternaam ||
      !telefoon ||
      !/^(?:\+31|0031|0)[1-9][0-9]{8}$/.test(schoonTelefoon) ||
      !postcode ||
      !woonplaats ||
      !straat ||
      !huisnummer ||
      !/^\d{8}$/.test(kvkNummer) ||
      !/^NL\d{9}B\d{2}$/.test(btwNummer)
    ) {
      return NextResponse.json(
        { error: "De registratiegegevens in het geverifieerde account zijn onvolledig." },
        { status: 400 }
      );
    }

    const werkgebiedKm = Number(metadata.werkgebied_km);
    const veiligeWerkafstand = [10, 15, 25, 35, 50, 75, 100].includes(werkgebiedKm)
      ? werkgebiedKm
      : 25;

    const { data, error } = await supabaseAdmin
      .from("professionals")
      .insert({
        user_id: user.id,
        email: user.email || null,
        bedrijfsnaam,
        voornaam,
        achternaam,
        telefoon,
        postcode,
        woonplaats,
        straat,
        huisnummer,
        toevoeging: String(metadata.toevoeging || "").trim() || null,
        kvk_nummer: kvkNummer,
        btw_nummer: btwNummer,
        avb_verzekeraar: avbVerzekeraar || null,
        avb_polisnummer: avbPolisnummer || null,
        avb_bevestigd: metadata.avb_bevestigd === true,
        diensten: normaliseerDiensten(metadata.diensten),
        werkgebied_km: veiligeWerkafstand,
        actief: false,
        geverifieerd: false,
        uitbetalingen_actief: false,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Professional opslaan mislukt:", error);
      return NextResponse.json(
        { error: "Professional kon niet in Supabase worden opgeslagen." },
        { status: 500 }
      );
    }

    let notificationSent = false;
    try {
      notificationSent = await verstuurAdminMelding(data);
      if (notificationSent) {
        await markeerAdminMeldingVerstuurd(user.id, appMetadata);
      }
    } catch (emailError) {
      console.error("Adminmelding nieuwe professional fout:", emailError);
    }

    return NextResponse.json({
      professional: data,
      notification_sent: notificationSent,
    });
  } catch (error) {
    console.error("Professional registratie API fout:", error);
    return NextResponse.json(
      { error: "Onverwachte fout bij professionalregistratie." },
      { status: 500 }
    );
  }
}
