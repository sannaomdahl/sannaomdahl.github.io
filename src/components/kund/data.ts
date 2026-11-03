// Dummy data for the Sanna-style customer view: Fjordlys Rådgivning AS, the
// consulting firm from the sanna.no mockups, seen by its daglig leder. The
// accountant is Truls Uppheim (statsautorisert), as on the website. Numbers
// echo the website where it shows them (omsetning 1 284 000, +12 %, lønn
// 612 000, utestående 412 000, AGA 136 400 on 16 Nov) and are invented
// around that.

export const TODAY = "2026-10-21"

export const FIRM = {
  name: "Fjällsjö Rådgivning AB",
  orgNo: "559123-4567",
  system: "Fortnox",
}

export const CONTACT = {
  name: "Andrea Omdahl",
  first: "Andrea",
  role: "VD",
}

export const TRIPLETEX_URL = "https://www.fortnox.se/"
export const BANK_URL = "https://seb.se/foretag"

export const ACCOUNTANT = {
  name: "Truls Uppheim",
  first: "Truls",
  title: "Din redovisningskonsult",
  photo: "team/truls.webp",
  reply: "Svarar oftast inom en timme",
}

// ── Dette trenger vi fra deg ──

export type TodoKind = "file" | "approve" | "choice"

export type Todo = {
  id: string
  kind: TodoKind
  title: string
  detail: string
  /** ISO date the thing holds up. */
  due: string
  /** What the date is for, in the customer's words. */
  holdsUp: string
  /** Only for `choice`. */
  options?: string[]
  action: string
}

export const TODOS: Todo[] = [
  {
    id: "lonn-okt",
    kind: "approve",
    title: "Godkänn lön för oktober",
    detail: "7 anställda · 603 136 kr · Amalie från 6 oktober",
    due: "2026-10-23",
    holdsUp: "Lön betalas 25 oktober",
    action: "Godkänn lön",
  },
  {
    id: "proshop",
    kind: "file",
    title: "Ladda upp fakturan från Proshop",
    detail: "7 472 kr betalt med kort 3 september · troligen kontorsutrustning",
    due: "2026-10-28",
    holdsUp: "Vi stänger oktober 31 oktober",
    action: "Ladda upp",
  },
  {
    id: "nordic-cloud",
    kind: "choice",
    title: "Nordic Cloud AB, 48 000 kr",
    detail:
      "Det är en årlig licens. Ska jag fördela den över 12 månader, eller bokföra allt i oktober?",
    due: "2026-10-28",
    holdsUp: "Vi stänger oktober 31 oktober",
    options: ["Fördela över året", "Allt i oktober"],
    action: "Välj",
  },
]

/** Already done this month: greyed out at the top of the timeline. */
export const DONE: {
  id: string
  title: string
  detail: string
  when: string
}[] = [
  {
    id: "lonn-sep",
    title: "Godkänd lön för september",
    detail: "7 anställda · 598 000 kr",
    when: "24 sep",
  },
  {
    id: "mva-sep",
    title: "Bekräftat momsunderlag för juli–augusti",
    detail: "Inlämnad 12 oktober",
    when: "9 okt",
  },
]

/** Locked until Truls gets there. */
export const UPCOMING: { id: string; title: string; detail: string }[] = [
  {
    id: "lonn-nov",
    title: "Godkänn lön för november",
    detail: "Öppnar 20 november",
  },
  {
    id: "arsregnskap",
    title: "Skriv under årsredovisningen för 2025",
    detail: "Truls skickar den till Bolagsverket i januari",
  },
]

/** In Truls' hands: the customer sees it move, and does nothing. */
export const WITH_TRULS: { id: string; title: string; detail: string }[] = [
  {
    id: "kvitteringer",
    title: "Kvitton för oktober bokförs",
    detail: "128 av 129 · det sista väntar på dig",
  },
]

// ── Lønn for oktober: what "Godkjenn lønn" opens ──

export type PayLine = {
  name: string
  role: string
  base: number
  commission: number
  /** Something Truls wants them to see before approving. */
  note?: string
  /** Started mid-month: paid for the working days from this one. */
  startDay?: number
}

/** October 2026 has 22 working days; from the 6th there are 19 left. */
export const WORKING_DAYS = 22
export function workingDaysFrom(day: number) {
  let n = 0
  for (let d = day; d <= 31; d++) {
    const w = new Date(2026, 9, d).getDay()
    if (w !== 0 && w !== 6) n++
  }
  return n
}

/** This month's pay for a line: the full base, or the days actually worked. */
export function grossFor(p: PayLine) {
  const base = p.startDay
    ? Math.round((p.base * workingDaysFrom(p.startDay)) / WORKING_DAYS)
    : p.base
  return base + p.commission
}

export const PAYROLL: PayLine[] = [
  { name: "Andrea Omdahl", role: "VD", base: 110_000, commission: 0 },
  {
    name: "Jonas Melin",
    role: "Seniorkonsult",
    base: 82_000,
    commission: 23_000,
    note: "Provision Havsvik Q3",
  },
  {
    name: "Ida Strand",
    role: "Seniorkonsult",
    base: 78_000,
    commission: 19_000,
  },
  { name: "Markus Lind", role: "Konsult", base: 72_000, commission: 14_000 },
  { name: "Nora Ekman", role: "Konsult", base: 70_000, commission: 11_000 },
  {
    name: "Henrik Dahl",
    role: "Konsult",
    base: 68_000,
    commission: 0,
    note: "50 % sjukskriven från 6 okt · Försäkringskassan från dag 15",
  },
  {
    name: "Amalie Voss",
    role: "Konsult",
    base: 65_000,
    commission: 0,
    startDay: 6,
    note: "Från 6 okt",
  },
]

export function payrollTotal() {
  return PAYROLL.reduce((sum, p) => sum + grossFor(p), 0)
}

// ── Status for oktober: what Sanna has already done ──

export type StatusLine = {
  label: string
  value: string
  done: boolean
}

export const STATUS: StatusLine[] = [
  { label: "Kvitton bokförda", value: "128 av 129", done: false },
  { label: "Bank avstämd", value: "Klar", done: true },
  { label: "Momsdeklaration", value: "Inlämnad 12 okt", done: true },
  { label: "Lönekörning", value: "Väntar på dig", done: false },
]

// ── Tallene: September 2026 is the last closed month ──

export const REPORT_MONTH = "September 2026"

export type Stat = {
  label: string
  value: number
  /** The line under the number: change or a note. */
  hint: string
  tone?: "positive" | "warning" | "neutral"
}

export const STATS: Stat[] = [
  {
    label: "Omsättning",
    value: 1_284_000,
    hint: "+12 % från augusti",
    tone: "positive",
  },
  {
    label: "Lönekostnader",
    value: 612_000,
    hint: "+64 000 · ny konsult",
    tone: "neutral",
  },
  {
    label: "Utestående",
    value: 412_000,
    hint: "2 fakturor över 30 dagar",
    tone: "warning",
  },
]

/** Truls' two sentences about the month, as on the website. */
export const SUMMARY = [
  "Omsättningen var 1 284 000 kr, 12 % högre än i augusti. Ökningen kommer från två nya kunder.",
  "Lönekostnaderna ökade med 64 000 kr eftersom en ny konsult började 1 september.",
]

// ── Booket mot fakturert, per måned (kr) ──

export type MonthRow = {
  month: string
  /** Contracted work for the month: signed engagements and retainers. */
  booket: number
  /** What was actually invoiced. Undefined for months not yet invoiced. */
  fakturert?: number
}

export const MONTHS: MonthRow[] = [
  { month: "Jan", booket: 1_050_000, fakturert: 1_012_000 },
  { month: "Feb", booket: 1_080_000, fakturert: 1_064_000 },
  { month: "Mar", booket: 1_150_000, fakturert: 1_188_000 },
  { month: "Apr", booket: 1_120_000, fakturert: 1_071_000 },
  { month: "Maj", booket: 1_180_000, fakturert: 1_142_000 },
  { month: "Jun", booket: 1_210_000, fakturert: 1_236_000 },
  { month: "Jul", booket: 780_000, fakturert: 742_000 },
  { month: "Aug", booket: 1_130_000, fakturert: 1_146_000 },
  { month: "Sep", booket: 1_240_000, fakturert: 1_284_000 },
  { month: "Okt", booket: 1_310_000 },
  { month: "Nov", booket: 1_290_000 },
  { month: "Dec", booket: 960_000 },
]

/** The year's revenue goal, agreed with Truls in January. */
export const GOAL_2026 = 13_500_000

export function invoicedYtd() {
  return MONTHS.reduce((sum, m) => sum + (m.fakturert ?? 0), 0)
}

/** Booked for the months not invoiced yet: what the rest of the year holds. */
export function bookedAhead() {
  return MONTHS.filter((m) => m.fakturert === undefined).reduce(
    (sum, m) => sum + m.booket,
    0,
  )
}

// ── Belegg per konsulent, september ──

export type Consultant = {
  name: string
  /** Billable share of available hours, in percent. */
  utilization: number
  /** Started this year, so a lower number is expected. */
  isNew?: boolean
}

export const UTILIZATION_TARGET = 80

export const CONSULTANTS: Consultant[] = [
  { name: "Jonas Melin", utilization: 92 },
  { name: "Ida Strand", utilization: 88 },
  { name: "Markus Lind", utilization: 84 },
  { name: "Nora Ekman", utilization: 81 },
  { name: "Henrik Dahl", utilization: 74 },
  { name: "Amalie Voss", utilization: 61 },
  { name: "Andrea Omdahl", utilization: 38 },
]

// ── Frister: our dates, with the one worth a heads-up ──

export type DeadlineStatus = "done" | "you" | "truls" | "planned"

export type Deadline = {
  date: string
  label: string
  status: DeadlineStatus
  /** A short reason it matters, only when it does. */
  note?: string
  warn?: boolean
}

/** The month's dates, and the first ones after it. */
export const DEADLINES: { month: string; items: Deadline[] }[] = [
  {
    month: "Oktober",
    items: [
      { date: "2026-10-12", label: "Momsdeklaration", status: "done" },
      { date: "2026-10-23", label: "Godkänn lön", status: "you" },
      { date: "2026-10-25", label: "Lön betalas", status: "truls" },
      { date: "2026-10-31", label: "Oktober stängs", status: "truls" },
    ],
  },
  {
    month: "November",
    items: [
      {
        date: "2026-11-12",
        label: "Arbetsgivardeklaration (AGI)",
        status: "planned",
      },
      {
        date: "2026-11-12",
        label: "Arbetsgivaravgifter",
        status: "planned",
        note: "136 400 kr. Truls flyttar pengar från sparkontot i tid.",
        warn: true,
      },
    ],
  },
]

export const DEADLINE_STATUS: Record<DeadlineStatus, string> = {
  done: "Klar",
  you: "Väntar på dig",
  truls: "Truls",
  planned: "Planerad",
}

// ── Flags on September: a few things worth a look, each closable ──

export type Flag = {
  id: string
  title: string
  detail: string
  /** The question to Truls the flag pre-writes, if it has one. */
  ask?: string
  /** The software flag opens a breakdown instead. */
  expands?: boolean
  /** A money flag links to the bank. */
  bank?: boolean
}

export const FLAGS: Flag[] = [
  {
    id: "likviditet",
    title: "Inte nog till hyran 25 oktober",
    detail:
      "Lön och hyra förfaller båda 25 oktober. Efter lön står det 162 000 kr på företagskontot, och hyran är 184 000 kr. För över 25 000 kr från sparkontot före 25 oktober.",
    ask: "Hej Truls! Kan du flytta 25 000 kr från sparkontot före hyran 25 oktober?",
    bank: true,
  },
  {
    id: "programvare",
    title: "Programvara ökade 20 % från i fjol",
    detail: "38 300 kr i september, 6 400 kr mer än i fjol. I huvudsak Claude.",
    expands: true,
  },
]

// ── The closed months: the figures the pane shows for each ──

export type MonthReport = {
  id: string
  label: string
  /** When Truls closed the month and wrote it up. */
  prepared: string
  /** The date the figures are per. */
  asOf: string
  /** Truls' summary, two or three sentences. */
  summary: string[]
  tiles: {
    label: string
    value: string
    hint: string
    tone?: "positive" | "warning" | "neutral"
  }[]
  kpis: { label: string; value: string; hint: string }[]
}

export const MONTH_REPORTS: MonthReport[] = [
  {
    id: "2026-09",
    label: "September 2026",
    prepared: "8 oktober 2026",
    asOf: "30 september 2026",
    summary: [
      "Omsättningen landade på 1 284 000 kr, 12 % högre än i augusti. Ökningen kommer från två nya kunder, Norrvik Energi och Solberg Bygg.",
      "Lönekostnaderna ökade med 64 000 kr eftersom Nora började 1 september. Resultatet blev 318 000 kr, 25 % marginal.",
      "Programvara har ökat 20 % från i fjol, i huvudsak Claude.",
    ],
    tiles: [
      {
        label: "Omsättning",
        value: "1 284 000",
        hint: "+12 % från augusti",
        tone: "positive",
      },
      {
        label: "Lönekostnader",
        value: "612 000",
        hint: "+64 000 · ny konsult",
        tone: "neutral",
      },
      {
        label: "Utestående",
        value: "412 000",
        hint: "Truls följer upp",
        tone: "neutral",
      },
      {
        label: "På kontot",
        value: "774 000",
        hint: "162 000 efter lön 25 okt",
        tone: "neutral",
      },
    ],
    kpis: [
      {
        label: "Resultat",
        value: "318 000",
        hint: "25 % marginal · +3 % mot mål",
      },
      { label: "Snittimpris", value: "1 450 kr", hint: "+50 kr från augusti" },
      {
        label: "Omsättning per konsult",
        value: "214 000",
        hint: "+9 % från september i fjol",
      },
      {
        label: "Snittprojektvärde",
        value: "386 000",
        hint: "+14 % från i fjol",
      },
    ],
  },
  {
    id: "2026-08",
    label: "Augusti 2026",
    prepared: "9 september 2026",
    asOf: "31 augusti 2026",
    summary: [
      "Omsättningen tog fart efter semestern och landade på 1 146 000 kr, 54 % över juli.",
      "Inga ändringar i lön. Alla kundfordringar är inom förfallodatum, och resultatet blev 262 000 kr.",
    ],
    tiles: [
      {
        label: "Omsättning",
        value: "1 146 000",
        hint: "+54 % från juli (semester)",
        tone: "positive",
      },
      {
        label: "Lönekostnader",
        value: "548 000",
        hint: "oförändrat från juli",
        tone: "neutral",
      },
      {
        label: "Utestående",
        value: "356 000",
        hint: "allt inom förfallodatum",
        tone: "positive",
      },
      {
        label: "På kontot",
        value: "912 000",
        hint: "vid månadens slut",
        tone: "neutral",
      },
    ],
    kpis: [
      { label: "Resultat", value: "262 000", hint: "23 % marginal · mål 22 %" },
      { label: "Snittimpris", value: "1 400 kr", hint: "oförändrat från juli" },
      {
        label: "Omsättning per konsult",
        value: "229 000",
        hint: "+6 % från augusti i fjol",
      },
      {
        label: "Snittprojektvärde",
        value: "372 000",
        hint: "+11 % från i fjol",
      },
    ],
  },
  {
    id: "2026-07",
    label: "Juli 2026",
    prepared: "11 augusti 2026",
    asOf: "31 juli 2026",
    summary: [
      "Semestermånad: omsättningen landade på 742 000 kr, 40 % under juni, som planerat.",
      "Semesterlönen betalades ut i juni, så lönekostnaderna i juli är ordinarie. Resultatet blev 41 000 kr.",
    ],
    tiles: [
      {
        label: "Omsättning",
        value: "742 000",
        hint: "−40 % från juni · semester",
        tone: "warning",
      },
      {
        label: "Lönekostnader",
        value: "548 000",
        hint: "semesterlön utbetald i juni",
        tone: "neutral",
      },
      {
        label: "Utestående",
        value: "298 000",
        hint: "allt inom förfallodatum",
        tone: "positive",
      },
      {
        label: "På kontot",
        value: "1 105 000",
        hint: "vid månadens slut",
        tone: "neutral",
      },
    ],
    kpis: [
      { label: "Resultat", value: "41 000", hint: "6 % marginal · semester" },
      { label: "Snittimpris", value: "1 400 kr", hint: "oförändrat" },
      {
        label: "Omsättning per konsult",
        value: "148 000",
        hint: "−3 % från juli i fjol",
      },
      {
        label: "Snittprojektvärde",
        value: "372 000",
        hint: "+11 % från i fjol",
      },
    ],
  },
]

/** Consulting KPIs for the month, with what to compare against. */
export const KPIS: { label: string; value: string; hint: string }[] = [
  { label: "Resultat", value: "318 000", hint: "25 % marginal · +3 % mot mål" },
  { label: "Snittimpris", value: "1 450 kr", hint: "+50 kr från augusti" },
  {
    label: "Omsättning per konsult",
    value: "214 000",
    hint: "+9 % från september i fjol",
  },
  {
    label: "Snittprojektvärde",
    value: "386 000",
    hint: "+14 % från i fjol",
  },
]

// ── Største kunder: who the revenue comes from, against last year ──

export type TopClient = {
  name: string
  /** Invoiced January–September 2026. */
  ytd: number
  /** The same months last year; none for a new client. */
  lastYear?: number
}

export const TOP_CLIENTS: TopClient[] = [
  { name: "Havsvik AB", ytd: 2_940_000, lastYear: 2_410_000 },
  { name: "Brännö Consulting", ytd: 1_620_000, lastYear: 1_180_000 },
  { name: "Norrvik Energi", ytd: 1_350_000 },
  { name: "Tindra Hälsa", ytd: 1_120_000, lastYear: 1_290_000 },
  { name: "Solberg Bygg", ytd: 880_000 },
  { name: "Övriga 9 kunder", ytd: 1_975_000, lastYear: 1_860_000 },
]

// ── Spør tallene: instant answers from the books ──

export const AI_STARTERS = [
  "Hur mycket har vi lagt på programvara i år?",
  "Vad står det på kontot nu?",
  "Vem är skyldig oss mest?",
]

const MONTH_NAMES = [
  "januari",
  "februari",
  "mars",
  "april",
  "maj",
  "juni",
  "juli",
  "augusti",
  "september",
  "oktober",
  "november",
  "december",
]

export const RECEIVABLES = [
  {
    name: "Havsvik AB",
    amount: 240_000,
    days: 41,
    note: "De har betalat den 28:e varje månad i år.",
  },
  {
    name: "Brännö Consulting",
    amount: 172_000,
    days: 33,
    note: "Första gången de är sena.",
  },
]

export const BANK = {
  today: 774_000,
  afterPayroll: 162_000,
  savings: 1_450_000,
}

/** Answers from the books. Reads the question for a person, a vendor, a
    customer, a month or a subject, and answers from the same data the
    page shows. What it can't find, it says so, and hands to Truls. */
export function askNumbers(question: string): string {
  const q = question.toLowerCase()
  const has = (...words: string[]) => words.some((w) => q.includes(w))
  const first = (name: string) => name.split(" ")[0]

  // A person: their pay, their billable share, or both.
  const person = PAYROLL.find((p) => q.includes(first(p.name).toLowerCase()))
  if (person) {
    const pay = `${first(person.name)} har ${kr(person.base)} kr i grundlön${
      person.commission
        ? ` och ${kr(person.commission)} kr i provision i oktober, ${kr(person.base + person.commission)} kr brutto`
        : " och ingen provision"
    }.${person.note ? ` ${person.note}.` : ""}`
    const c = CONSULTANTS.find((x) => x.name === person.name)
    const bill = c
      ? `Debiteringsgrad i september: ${c.utilization} %${c.utilization >= UTILIZATION_TARGET ? ", över målet" : ", under målet på 80 %"}.`
      : ""
    if (has("lön", "tjänar", "provision", "brutto")) return pay
    if (has("faktur", "debiter", "timmar", "beläggning")) return bill || pay
    return `${pay} ${bill}`.trim()
  }

  // A vendor.
  const vendor = SOFTWARE.find((l) =>
    l.name
      .toLowerCase()
      .split(/[ (]/)
      .some((w) => w && q.includes(w.replace(")", ""))),
  )
  if (vendor) {
    const diff = vendor.sep - vendor.aug
    return `${vendor.name} kostade ${kr(vendor.sep)} kr i september, ${
      diff > 0
        ? `${kr(diff)} kr mer än`
        : diff < 0
          ? `${kr(-diff)} kr mindre än`
          : "detsamma som"
    } i augusti. Det bokförs på 5420 Programvaror.`
  }

  // A customer.
  const customer = RECEIVABLES.find((r) =>
    q.includes(first(r.name).toLowerCase()),
  )
  if (customer)
    return `${customer.name} är skyldig ${kr(customer.amount)} kr. Fakturan är ${customer.days} dagar gammal. ${customer.note}`

  // A month.
  const monthIdx = MONTH_NAMES.findIndex((m) => q.includes(m))
  if (
    monthIdx >= 0 &&
    has("omsättning", "fakturer", "bokat", "intäkt", "sålde", "tjänade")
  ) {
    const m = MONTHS[monthIdx]
    return m.fakturert !== undefined
      ? `I ${MONTH_NAMES[monthIdx]} fakturerade ni ${kr(m.fakturert)} kr, mot ${kr(m.booket)} kr bokat.`
      : `${MONTH_NAMES[monthIdx][0].toUpperCase()}${MONTH_NAMES[monthIdx].slice(1)} är inte fakturerad ännu. Det är bokat ${kr(m.booket)} kr.`
  }

  if (has("hur många anställda", "antal anställda", "anställda har"))
    return `7 anställda: du och 6 konsulter. Amalie började 6 oktober, Henrik är 50 % sjukskriven.`
  if (has("programvara", "software", "verktyg", "licens")) {
    const { sep, change } = softwareTotals()
    const top = [...SOFTWARE].sort((a, b) => b.sep - a.sep).slice(0, 3)
    return `${kr(sep)} kr i september, ${Math.round(change * 100)} % mer än i augusti. Störst är ${top.map((l) => `${l.name} ${kr(l.sep)}`).join(", ")}. Hittills i år: 184 300 kr.`
  }
  if (has("skyldig", "utestående", "förfallen", "påminnelse", "obetald"))
    return `Utestående är 412 000 kr. Över 30 dagar: ${RECEIVABLES.map((r) => `${r.name} ${kr(r.amount)} kr (${r.days} dagar)`).join(" och ")}. Resten är inom förfallodatum.`
  if (has("konto", "bank", "saldo", "likvid", "pengar", "kontant"))
    return `${kr(BANK.today)} kr på företagskontot och ${kr(BANK.savings)} kr på sparkontot. Efter lön 25 oktober står det ${kr(BANK.afterPayroll)} kr på företagskontot, så hyran samma dag behöver 25 000 kr från sparkontot.`
  if (has("hyra", "hyran"))
    return `Hyran är 184 000 kr i månaden och förfaller den 25:e. Nästa är 25 oktober, samma dag som lönen.`
  if (has("mål", "budget", "landar")) {
    const landing = invoicedYtd() + bookedAhead()
    return `${mnok(invoicedYtd())} fakturerat till och med september. Med det som är bokat ut året landar ni på ${mnok(landing)}, ${kr(GOAL_2026 - landing)} kr under målet på ${mnok(GOAL_2026)}.`
  }
  if (has("timpris"))
    return `Snittimpriset i september var 1 450 kr, 50 kr upp från augusti. Jonas ligger högst med 1 650 kr, Amalie lägst med 1 100 kr.`
  if (has("resultat", "marginal", "vinst", "tjänar vi"))
    return `Resultatet i september var 318 000 kr, 25 % marginal. Målet är 22 %. Hittills i år: 2,4 MSEK.`
  if (has("debiteringsgrad", "beläggning", "utnyttjande"))
    return `September: ${CONSULTANTS.filter((c) => c.name !== CONTACT.name)
      .map((c) => `${first(c.name)} ${c.utilization} %`)
      .join(", ")}. Målet är ${UTILIZATION_TARGET} %.`
  if (has("omsättning", "intäkt", "fakturerat", "sålde"))
    return `Omsättningen i september var 1 284 000 kr, 12 % upp från augusti. Hittills i år ${mnok(invoicedYtd())}.`
  if (has("lön", "lönekostnad"))
    return `Lönen i oktober är ${kr(payrollTotal())} kr brutto för 7 anställda, betalas ut 25 oktober. Lönekostnaderna i september var 612 000 kr, 64 000 mer än i augusti eftersom Nora började 1 september.`
  if (
    has(
      "frist",
      "förfall",
      "moms",
      "agi",
      "arbetsgivardeklaration",
      "arbetsgivaravgift",
      "skatt",
    )
  )
    return `Nästa datum: 23 oktober godkänn lön, 25 oktober lön betalas, 31 oktober oktober stängs, 12 november arbetsgivardeklaration och arbetsgivaravgifter 136 400 kr, 12 december momsdeklaration.`
  if (has("utdelning"))
    return `Fritt eget kapital per september är 2,1 MSEK, så det finns utrymme för utdelning. Beloppet bestämmer ni, Truls tar fram styrelsebeslutet.`
  if (has("kunder", "kund", "störst"))
    return `Ni har 14 aktiva kunder. Havsvik AB är störst med 2,9 MSEK hittills i år, sedan Brännö Consulting med 1,6 MSEK.`
  return "Det hittade jag inte i siffrorna. Fråga Truls, så svarar han under dagen."
}

// ── Insight: software costs ──

export type SoftwareLine = { name: string; aug: number; sep: number }

export const SOFTWARE: SoftwareLine[] = [
  { name: "Anthropic (Claude)", aug: 9_800, sep: 13_600 },
  { name: "Figma", aug: 8_400, sep: 8_400 },
  { name: "OpenAI", aug: 5_100, sep: 6_900 },
  { name: "Slack", aug: 4_100, sep: 4_100 },
  { name: "Notion", aug: 2_400, sep: 3_200 },
  { name: "Linear", aug: 2_100, sep: 2_100 },
]

export function softwareTotals() {
  const aug = SOFTWARE.reduce((s, l) => s + l.aug, 0)
  const sep = SOFTWARE.reduce((s, l) => s + l.sep, 0)
  return { aug, sep, change: (sep - aug) / aug }
}

// ── Reading an uploaded document ──

export type Recognised = {
  supplier: string
  what: string
  amount: number
  date: string
  account: string
  tag: string
  comment: string
}

/** Suppliers the demo recognises from the file name or the PDF's text.
    Anything else plays the Norwegian receipt, the walk-through document. */
export const SUPPLIERS: { keys: string[]; result: Recognised }[] = [
  {
    keys: ["proshop", "1938014", "viewfinity"],
    result: {
      supplier: "Proshop AB",
      what: '2 × Samsung ViewFinity S6 34" skjermer, faktura 1938014',
      amount: 7_472,
      date: "2026-09-03",
      account: "5410 Förbrukningsinventarier",
      tag: "Kontorsutrustning",
      comment: "Två skärmar till kontoret",
    },
  },
  {
    keys: ["norwegian", "y3fjnm", "kjøpskvittering", "köpkvitto", "flypris"],
    result: {
      supplier: "Norwegian Air Shuttle",
      what: "Flygbiljett Pristina–Stockholm t/r, 26 sep–3 okt",
      amount: 4_513,
      date: "2026-09-11",
      account: "5800 Resekostnader",
      tag: "Resa",
      comment: `Resa ${CONTACT.first}`,
    },
  },
  {
    keys: ["figma"],
    result: {
      supplier: "Figma",
      what: "Professional, 4 platser, oktober",
      amount: 8_400,
      date: "2026-10-01",
      account: "5420 Programvaror",
      tag: "Programvara",
      comment: "Designverktyg, månadsvis",
    },
  },
  {
    keys: ["anthropic", "claude"],
    result: {
      supplier: "Anthropic",
      what: "Claude Team, oktober",
      amount: 14_200,
      date: "2026-10-02",
      account: "5420 Programvaror",
      tag: "Programvara",
      comment: "AI-verktyg, månadsvis",
    },
  },
  {
    keys: ["swish"],
    result: {
      supplier: "Swish",
      what: "Lunch med konsultgruppen",
      amount: 890,
      date: "2026-10-21",
      account: "6071 Representation",
      tag: "Mat",
      comment: "Lunch, konsultgruppen",
    },
  },
]

/** The steps the reader shows while it works, in order. */
export const READ_STEPS = [
  "Läser dokumentet",
  "Hittar leverantör och belopp",
  "Föreslår konto och etikett",
]

// ── Chat with Truls ──

export type Message = {
  id: string
  from: "you" | "truls"
  text: string
  /** "I dag 09:12" */
  at: string
}

export const CHAT: Message[] = [
  {
    id: "m1",
    from: "you",
    text: "Hej! Kan vi köra bonus med lönen i november?",
    at: "Måndag 14:02",
  },
  {
    id: "m2",
    from: "truls",
    text: "Ja, det fixar vi. Skicka mig beloppen, så tar jag med det.",
    at: "Måndag 14:20",
  },
]

export type ThreadStatus = "open" | "resolved" | "ai"

export type Thread = {
  id: string
  title: string
  status: ThreadStatus
  /** "I dag", "12. sep" */
  updated: string
  messages: Message[]
}

/** Every conversation with Truls, newest first. Resolved ones are kept:
    what was asked and what was decided, for the next time it comes up. */
export const THREADS: Thread[] = [
  {
    id: "okt",
    title: "Oktober",
    status: "open",
    updated: "I dag",
    messages: CHAT,
  },
  {
    id: "sanna",
    title: "Sanna (AI)",
    status: "ai",
    updated: "Svarar direkt",
    messages: [],
  },
  {
    id: "firmabil",
    title: "Tjänstebil till Jonas",
    status: "open",
    updated: "3. okt",
    messages: [
      {
        id: "f1",
        from: "you",
        text: "Jonas vill ha tjänstebil. Lönar det sig för oss?",
        at: "3. okt 09:10",
      },
      {
        id: "f2",
        from: "truls",
        text: "Sällan för en konsult som kör lite. Jag räknar på elbil mot milersättning och återkommer med siffror.",
        at: "3. okt 11:42",
      },
    ],
  },
  {
    id: "mva-aug",
    title: "Momsdeklaration juli–augusti",
    status: "resolved",
    updated: "8. okt",
    messages: [
      {
        id: "m1",
        from: "truls",
        text: "Moms för juli–augusti: 318 400 kr att betala, förfaller 12 oktober. Underlaget ligger i Fortnox. Ok?",
        at: "7. okt 15:02",
      },
      { id: "m2", from: "you", text: "Ja", at: "7. okt 15:30" },
      {
        id: "m3",
        from: "truls",
        text: "Inlämnad. Betalningen går från företagskontot 12 oktober.",
        at: "8. okt 08:15",
      },
    ],
  },
  {
    id: "kapital",
    title: "Nyemission",
    status: "resolved",
    updated: "12. sep",
    messages: [
      {
        id: "k1",
        from: "you",
        text: "Vi tar in 2 MSEK från en investerare i Q4. Vad behöver vi göra?",
        at: "28. aug 10:20",
      },
      {
        id: "k2",
        from: "truls",
        text: "Styrelsebeslut, bolagsstämmoprotokoll och anmälan till Bolagsverket. Jag tar fram utkasten, ni skriver under med BankID. Räkna med två veckor.",
        at: "28. aug 13:05",
      },
      { id: "k3", from: "you", text: "Toppen, kör på.", at: "28. aug 13:20" },
      {
        id: "k4",
        from: "truls",
        text: "Registrerat hos Bolagsverket i dag. Aktiekapitalet är uppdaterat i bokföringen.",
        at: "12. sep 14:48",
      },
    ],
  },
]

/** Where documents can come from, besides a drop. */
export const SOURCES = ["Gmail", "Outlook", "Google Drive", "Claude", "ChatGPT"]

/** The same, when the Nordic Cloud question was already answered on the timeline. */
export const LIVE_MESSAGE_SETTLED =
  "Hej Andrea! September är stängd. Omsättningen landade på 1 284 000 kr, 12 % upp från augusti, mest från två nya kunder. Lönen ökade 64 000 eftersom Nora började 1 september. Nordic Cloud-licensen tar jag som du svarade."

/** Lands when Meldinger is opened: September is closed, with one question. */
export const LIVE_MESSAGE =
  "Hej Andrea! September är stängd. Omsättningen landade på 1 284 000 kr, 12 % upp från augusti, mest från två nya kunder. Lönen ökade 64 000 eftersom Nora började 1 september. Ska jag fördela Nordic Cloud-licensen över året?"

/** Things people ask Truls, as one-tap starters in the chat. */
export const STARTERS = [
  "Hur mycket har vi lagt på programvara i år?",
  "Kan vi ta utdelning i december?",
  "Vad kostar en ny konsult oss per månad?",
]

// ── Formatting ──

const nok = new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 })

/** "1 284 000" */
export function kr(value: number) {
  return nok.format(value)
}

/** "1,28 MNOK" for headline numbers. */
export function mnok(value: number) {
  return `${(value / 1_000_000).toLocaleString("sv-SE", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} MSEK`
}

const DAY = 86_400_000

export function daysFrom(iso: string, from = TODAY) {
  return Math.round((Date.parse(iso) - Date.parse(from)) / DAY)
}

const shortDay = new Intl.DateTimeFormat("sv-SE", {
  day: "numeric",
  month: "short",
})

/** "23. okt" */
export function dayLabel(iso: string) {
  return shortDay.format(new Date(`${iso}T00:00:00`)).replace(/\.$/, "")
}

/** "om 2 dager", "i morgen", "i dag", "3 dager siden" */
export function relative(iso: string) {
  const d = daysFrom(iso)
  if (d < -1) return `för ${-d} dagar sedan`
  if (d === -1) return "i går"
  if (d === 0) return "i dag"
  if (d === 1) return "i morgon"
  return `om ${d} dagar`
}

// ── Everything the model is given when it answers for Sanna or Truls ──

/** The whole dummy ledger as one object, for the system prompt. */
export function ledgerForModel() {
  return {
    today: TODAY,
    firm: FIRM,
    contact: CONTACT,
    accountant: ACCOUNTANT,
    openTasks: TODOS,
    doneTasks: DONE,
    withAccountant: WITH_TRULS,
    upcoming: UPCOMING,
    payrollOctober: PAYROLL.map((p) => ({ ...p, grossThisMonth: grossFor(p) })),
    payrollOctoberTotal: payrollTotal(),
    consultantsBillableShareSeptember: CONSULTANTS,
    billableTarget: UTILIZATION_TARGET,
    revenueByMonth2026: MONTHS,
    revenueGoal2026: GOAL_2026,
    invoicedYtd: invoicedYtd(),
    bookedAhead: bookedAhead(),
    topClientsYtd: TOP_CLIENTS,
    receivablesOver30Days: RECEIVABLES,
    bank: BANK,
    softwareAugSep: SOFTWARE,
    deadlines: DEADLINES,
    flags: FLAGS,
    monthReports: MONTH_REPORTS,
    earlierConversations: THREADS.filter((t) => t.status !== "ai"),
  }
}
