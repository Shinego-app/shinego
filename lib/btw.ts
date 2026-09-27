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

  return [
    {
      omschrijving: "Glasbewassing",
      tarief: 21,
      bedragIncl: totaal,
    },
  ];
}
