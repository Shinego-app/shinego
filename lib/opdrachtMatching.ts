type Coordinaat = { lat: number; lon: number };

type ProfessionalVoorMatching = {
  postcode?: string | null;
  huisnummer?: string | null;
  werkgebied_km?: number | null;
  diensten?: string[] | null;
};

type BoekingVoorMatching = {
  postcode?: string | null;
  huisnummer?: string | null;
  glasbewassing_type?: string | null;
  telescoop?: boolean | null;
  woningtype?: string | null;
};

const PDOK_URL = "https://api.pdok.nl/bzk/locatieserver/search/v3_1/free";
const geocodeCache = new Map<string, Promise<Coordinaat | null>>();

function normaliseerPostcode(value?: string | null) {
  return String(value || "").replace(/\s/g, "").toUpperCase();
}

function radians(graden: number) {
  return (graden * Math.PI) / 180;
}

function afstandKm(a: Coordinaat, b: Coordinaat) {
  const aardeKm = 6371;
  const dLat = radians(b.lat - a.lat);
  const dLon = radians(b.lon - a.lon);
  const lat1 = radians(a.lat);
  const lat2 = radians(b.lat);
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h = sinLat * sinLat + Math.cos(lat1) * Math.cos(lat2) * sinLon * sinLon;
  return aardeKm * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

async function geocode(postcode?: string | null, huisnummer?: string | null) {
  const pc = normaliseerPostcode(postcode);
  const hn = String(huisnummer || "").trim();
  if (!pc) return null;

  const cacheKey = `${pc}-${hn}`;
  if (!geocodeCache.has(cacheKey)) {
    geocodeCache.set(
      cacheKey,
      (async () => {
        try {
          const zoekterm = [pc, hn].filter(Boolean).join(" ");
          const url = new URL(PDOK_URL);
          url.searchParams.set("q", zoekterm);
          url.searchParams.set("rows", "3");
          url.searchParams.set("fl", "type,postcode,centroide_ll,score");

          const response = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
          if (!response.ok) return null;

          const json = await response.json();
          const docs = Array.isArray(json?.response?.docs) ? json.response.docs : [];
          const beste =
            docs.find((doc: any) => doc?.type === "adres" && doc?.centroide_ll) ||
            docs.find((doc: any) => doc?.type === "postcode" && doc?.centroide_ll) ||
            docs.find((doc: any) => doc?.centroide_ll);

          const punt = String(beste?.centroide_ll || "").match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
          if (!punt) return null;

          return { lon: Number(punt[1]), lat: Number(punt[2]) };
        } catch (error) {
          console.error("PDOK geocodering mislukt:", error);
          return null;
        }
      })()
    );
  }

  return geocodeCache.get(cacheKey)!;
}

export function vereisteDienst(boeking: BoekingVoorMatching) {
  const type = String(boeking.glasbewassing_type || "").toLowerCase();
  if (boeking.telescoop || type === "telewash") return "telewash";
  if (type === "bedrijf" || String(boeking.woningtype || "").toLowerCase().includes("bedrijf")) return "bedrijf";
  if (type === "binnen") return "binnen";
  return "glazenwasser";
}

export function heeftBenodigdeDienst(professional: ProfessionalVoorMatching, boeking: BoekingVoorMatching) {
  const diensten = Array.isArray(professional.diensten)
    ? professional.diensten.map((dienst) => String(dienst).toLowerCase())
    : [];
  const vereist = vereisteDienst(boeking);
  if (vereist === "glazenwasser") return diensten.includes("glazenwasser");
  return diensten.includes(vereist);
}

export async function ligtBinnenWerkgebied(professional: ProfessionalVoorMatching, boeking: BoekingVoorMatching) {
  const professionalPostcode = normaliseerPostcode(professional.postcode);
  const boekingPostcode = normaliseerPostcode(boeking.postcode);
  if (!professionalPostcode || !boekingPostcode) {
    return { binnen: false, afstand_km: null };
  }

  if (professionalPostcode === boekingPostcode) {
    return { binnen: true, afstand_km: 0 };
  }

  const maxKm = Math.max(0, Number(professional.werkgebied_km || 0));
  if (!maxKm) return { binnen: false, afstand_km: null };

  const [professionalLocatie, boekingLocatie] = await Promise.all([
    geocode(professional.postcode, professional.huisnummer),
    geocode(boeking.postcode, boeking.huisnummer),
  ]);

  if (!professionalLocatie || !boekingLocatie) {
    return { binnen: false, afstand_km: null };
  }

  const afstand = afstandKm(professionalLocatie, boekingLocatie);
  return { binnen: afstand <= maxKm, afstand_km: Math.round(afstand * 10) / 10 };
}
