import { supabase } from "./supabase";

export type NieuweBoeking = {
  voornaam: string;
  achternaam: string;
  email: string;
  telefoon: string;

  postcode: string;
  huisnummer: string;
  toevoeging?: string;
  straat: string;
  plaats: string;

  dienst: string;

  woningtype?: string;
  verdiepingen?: string[];
  aantal_ramen?: number;
  glasbewassing_type?: string;
  frequentie?: string;
  bereikbaar?: string;
  kozijnen?: boolean;
  opmerking?: string;
  thuis_nodig?: string;
  basisprijs?: number;
  ramen_prijs?: number;
  verdieping_toeslag?: number;
  bereik_toeslag?: number;
  kozijnen_toeslag?: number;
  korting_percentage?: number;
  korting_bedrag?: number;
  telescoop: boolean;
  totaalprijs: number;

  gewenste_datum?: string;
  gewenste_tijd?: string;

  professional_id?: string | null;
};

export async function boekingOpslaan(boeking: NieuweBoeking) {
  const { data, error } = await supabase
    .from("boekingen")
    .insert([
      {
        voornaam: boeking.voornaam,
        achternaam: boeking.achternaam,
        email: boeking.email,
        telefoon: boeking.telefoon,

        postcode: boeking.postcode,
        huisnummer: boeking.huisnummer,
        toevoeging: boeking.toevoeging || null,
        straat: boeking.straat,
        plaats: boeking.plaats,

        dienst: boeking.dienst,

        woningtype: boeking.woningtype || null,
        verdiepingen: boeking.verdiepingen ?? null,
        aantal_ramen: boeking.aantal_ramen ?? null,
        telescoop: boeking.telescoop,
        glasbewassing_type: boeking.glasbewassing_type || null,
        frequentie: boeking.frequentie || null,
        bereikbaar: boeking.bereikbaar || null,
        kozijnen: boeking.kozijnen ?? false,
        opmerking: boeking.opmerking || null,

        basisprijs: boeking.basisprijs ?? 0,
        ramen_prijs: boeking.ramen_prijs ?? 0,
        verdieping_toeslag: boeking.verdieping_toeslag ?? 0,
        bereik_toeslag: boeking.bereik_toeslag ?? 0,
        kozijnen_toeslag: boeking.kozijnen_toeslag ?? 0,
       korting_percentage: boeking.korting_percentage ?? 0,
       korting_bedrag: boeking.korting_bedrag ?? 0,
        totaalprijs: boeking.totaalprijs,

        status: "nieuw",
        betaalstatus: "open",

        gewenste_datum: boeking.gewenste_datum || null,
        gewenste_tijd: boeking.gewenste_tijd || null,
        thuis_nodig: boeking.thuis_nodig || null,
        professional_id: boeking.professional_id ?? null,
      },
    ])
    .select("id")
    
    

  if (error) {
    console.error("Fout bij opslaan ShineGo-boeking:", error);

    throw new Error(
      `Boeking kon niet worden opgeslagen: ${error.message}`
    );
  }

  return data;
}