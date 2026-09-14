function nederlandseDatumEnTijd() {
  const delen = new Intl.DateTimeFormat("nl-NL", {
    timeZone: "Europe/Amsterdam",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  const waarde = (type: string) => delen.find((deel) => deel.type === type)?.value || "";

  return {
    datum: `${waarde("year")}-${waarde("month")}-${waarde("day")}`,
    tijd: `${waarde("hour")}:${waarde("minute")}`,
  };
}

function beginTijd(value?: string | null) {
  const match = String(value || "").match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return `${match[1].padStart(2, "0")}:${match[2]}`;
}

export function magOpdrachtStarten(gewensteDatum?: string | null, gewensteTijd?: string | null) {
  if (!gewensteDatum) {
    return { toegestaan: false, reden: "Deze opdracht heeft geen geldige geplande datum." };
  }

  const nu = nederlandseDatumEnTijd();
  const datum = String(gewensteDatum).slice(0, 10);

  if (datum > nu.datum) {
    return { toegestaan: false, reden: `Deze opdracht kan pas op ${datum} worden gestart.` };
  }

  if (datum < nu.datum) {
    return { toegestaan: true, reden: null };
  }

  const start = beginTijd(gewensteTijd);
  if (start && nu.tijd < start) {
    return { toegestaan: false, reden: `Deze opdracht kan vandaag pas vanaf ${start} worden gestart.` };
  }

  return { toegestaan: true, reden: null };
}
