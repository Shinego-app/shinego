export type BtwRegel = {
  omschrijving: string;
  tarief: 9 | 21;
  bedragIncl: number;
};

export type BtwUitsplitsing = {
  bedragIncl: number;
  bedragExcl: number;
  btwBedrag: number;
  tarief: 9 | 21;
};

function geld(value: number) {
  return Math.round((Number(value || 0) + Number.EPSILON) * 100) / 100;
}

function nummer(value: unknown) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function splitsBtwUitInclusief(
  bedragIncl: number,
  tarief: 9 | 21
): BtwUitsplitsing {
  const incl = geld(bedragIncl);
  const excl = geld(incl / (1 + tarief / 100));
  return {
    bedragIncl: incl,
    bedragExcl: excl,
    btwBedrag: geld(incl - excl),
    tarief,
  };
}

export function berekenPlatformCommissieBtw(
  platformCommissieIncl: number
): BtwUitsplitsing {
  return splitsBtwUitInclusief(platformCommissieIncl, 21);
}

export function berekenKlantBtwRegels(booking: Record<string, unknown>): BtwRegel[] {
  const totaal = geld(nummer(booking.totaalprijs));
  if (totaal <= 0) return [];

  const type = String(booking.glasbewassing_type || "").toLowerCase();
  const woningtype = String(booking.woningtype || "").toLowerCase();
  const bedrijf =
    type === "bedrijf" ||
    woningtype.includes("bedrijf") ||
    woningtype.includes("winkel");

  if (bedrijf) {
    return [
      {
        omschrijving: "Zakelijke glasbewassing",
        tarief: 21,
        bedragIncl: totaal,
      },
    ];
  }

  if (type === "binnen") {
    return [
      {
        omschrijving: "Glasbewassing binnen in woning",
        tarief: 9,
        bedragIncl: totaal,
      },
    ];
  }

  // Bij een gecombineerde woningopdracht wordt het binnenwerk in de huidige
  // boeking niet als apart bedrag opgeslagen. We leiden dit veilig af uit de
  // bestaande prijscomponenten, zonder de betaal- of uitbetalingsflow te wijzigen.
  const kortingBedrag = nummer(booking.korting_bedrag);
  const voorKorting = geld(totaal + kortingBedrag);

  const bekendeBuitenComponenten = geld(
    nummer(booking.basisprijs) +
      nummer(booking.ramen_prijs) +
      nummer(booking.verdieping_toeslag) +
      nummer(booking.bereik_toeslag) +
      nummer(booking.kozijnen_toeslag)
  );

  const afgeleidBinnenVoorKorting = geld(
    Math.max(0, voorKorting - bekendeBuitenComponenten)
  );

  if (afgeleidBinnenVoorKorting > 0.01 && voorKorting > 0) {
    const factor = totaal / voorKorting;
    const binnenIncl = geld(
      Math.min(totaal, afgeleidBinnenVoorKorting * factor)
    );
    const buitenIncl = geld(Math.max(0, totaal - binnenIncl));

    if (binnenIncl > 0 && buitenIncl > 0) {
      return [
        {
          omschrijving: "Glasbewassing binnen in woning",
          tarief: 9,
          bedragIncl: binnenIncl,
        },
        {
          omschrijving: "Glasbewassing buiten / overige werkzaamheden",
          tarief: 21,
          bedragIncl: buitenIncl,
        },
      ];
    }
  }

  return [
    {
      omschrijving: "Glasbewassing buiten",
      tarief: 21,
      bedragIncl: totaal,
    },
  ];
}
