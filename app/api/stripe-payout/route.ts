import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Handmatige uitbetaling door professionals is uitgeschakeld. Afgeronde opdrachten worden automatisch meegenomen in de wekelijkse uitbetalingsronde.",
    },
    { status: 403 }
  );
}
