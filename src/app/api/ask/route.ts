// Answers for the customer views' chat (Norwegian /kunde, Swedish /kund): Sanna at once, Truls as the
// accountant. The whole dummy ledger goes in as context, so the model can
// answer anything in it and says so when it isn't there. Without an API
// key the route says 503 and the page falls back to its canned answers.
import Anthropic from "@anthropic-ai/sdk"

import * as nb from "@/components/kunde/data"
import * as sv from "@/components/kund/data"

export const runtime = "nodejs"

type Who = "sanna" | "truls"
type Lang = "nb" | "sv"

/** The two markets: the Norwegian view on Tripletex, the Swedish on Fortnox. */
const MARKET = {
  nb: {
    data: nb,
    persona: (who: Who) =>
      who === "sanna"
        ? `Du er Sanna, KI-assistenten i Sannas kundeapp. Du svarer ${nb.CONTACT.first}, daglig leder i ${nb.FIRM.name}, med en gang og rett fra regnskapet. ${nb.ACCOUNTANT.first} (regnskapsføreren) ser alt du svarer. Du kan ikke utføre noe selv: når noe må gjøres (bokføre, betale, sende, endre), si at ${nb.ACCOUNTANT.first} gjør det, eller foreslå å spørre ham.`
        : `Du er ${nb.ACCOUNTANT.name}, ${nb.ACCOUNTANT.title.toLowerCase()} i Sanna, og skriver til ${nb.CONTACT.first}, daglig leder i ${nb.FIRM.name}. Du kjenner regnskapet deres ut og inn, er varm og konkret, og tar ansvar: foreslå hva du gjør, og be om et ja når du trenger det. Du er et menneske, ikke en KI.`,
    rules: `Regler:
- Skriv norsk bokmål. Kort: ett til tre avsnitt uten overskrifter, punktlister bare når de hjelper. Ingen markdown-stjerner.
- Alle tall kommer fra regnskapsdataene under. Regn gjerne videre på dem (summer, differanser, prosent), og vis kort hvordan.
- Finnes ikke svaret i dataene, si det i én setning og si hva du trenger. Ikke finn på tall.
- Beløp skrives som «1 284 000 kr». Datoer som «25. oktober».
- Dagens dato står i dataene. Oktober 2026 er åpen måned, september er sist lukkede. Regnskapssystemet er Tripletex.`,
    heading: "Regnskapsdata (JSON)",
    refusal: "Det kan jeg ikke svare på her. Spør Truls direkte.",
  },
  sv: {
    data: sv,
    persona: (who: Who) =>
      who === "sanna"
        ? `Du är Sanna, AI-assistenten i Sannas kundapp. Du svarar ${sv.CONTACT.first}, VD för ${sv.FIRM.name}, direkt och rakt från bokföringen. ${sv.ACCOUNTANT.first} (redovisningskonsulten) ser allt du svarar. Du kan inte utföra något själv: när något måste göras (bokföra, betala, skicka, ändra), säg att ${sv.ACCOUNTANT.first} gör det, eller föreslå att fråga henne.`
        : `Du är ${sv.ACCOUNTANT.name}, ${sv.ACCOUNTANT.title.toLowerCase()} på Sanna, och skriver till ${sv.CONTACT.first}, VD för ${sv.FIRM.name}. Du kan deras bokföring utan och innan, är varm och konkret, och tar ansvar: föreslå vad du gör, och be om ett ja när du behöver det. Du är en människa, inte en AI.`,
    rules: `Regler:
- Skriv svenska. Kort: ett till tre stycken utan rubriker, punktlistor bara när de hjälper. Inga markdown-stjärnor.
- Alla siffror kommer från bokföringsdata nedan. Räkna gärna vidare på dem (summor, skillnader, procent), och visa kort hur.
- Finns inte svaret i datan, säg det i en mening och säg vad du behöver. Hitta inte på siffror.
- Belopp skrivs som «1 284 000 kr». Datum som «25 oktober». Valutan är SEK.
- Svensk kontext: moms, arbetsgivardeklaration (AGI) och arbetsgivaravgifter till Skatteverket den 12:e, årsredovisning till Bolagsverket, Försäkringskassan vid sjukdom.
- Dagens datum står i datan. Oktober 2026 är öppen månad, september är senast stängda. Bokföringssystemet är Fortnox.`,
    heading: "Bokföringsdata (JSON)",
    refusal: "Det kan jag inte svara på här. Fråga Patricia direkt.",
  },
}

function buildSystem(lang: Lang) {
  const m = MARKET[lang]
  return `${m.rules}\n\n${m.heading}:\n${JSON.stringify(m.data.ledgerForModel())}`
}

type Turn = { role: "user" | "assistant"; text: string }

function isTurn(value: unknown): value is Turn {
  if (!value || typeof value !== "object") return false
  const t = value as Record<string, unknown>
  return (
    (t.role === "user" || t.role === "assistant") &&
    typeof t.text === "string" &&
    t.text.length <= 4000
  )
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: "no_key" }, { status: 503 })
  }
  let body: {
    who?: unknown
    question?: unknown
    history?: unknown
    lang?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 })
  }
  const who: Who = body.who === "truls" ? "truls" : "sanna"
  const lang: Lang = body.lang === "sv" ? "sv" : "nb"
  const question =
    typeof body.question === "string" ? body.question.trim().slice(0, 2000) : ""
  if (!question) return Response.json({ error: "no_question" }, { status: 400 })
  const history = Array.isArray(body.history)
    ? body.history.filter(isTurn).slice(-12)
    : []

  const messages: Anthropic.MessageParam[] = [
    ...history.map((t) => ({ role: t.role, content: t.text })),
    { role: "user", content: question },
  ]

  const client = new Anthropic()
  try {
    const response = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [
        { type: "text", text: MARKET[lang].persona(who) },
        // The ledger never changes between questions, so it is cached.
        {
          type: "text",
          text: buildSystem(lang),
          cache_control: { type: "ephemeral" },
        },
      ],
      messages,
    })
    if (response.stop_reason === "refusal") {
      return Response.json({
        text: MARKET[lang].refusal,
      })
    }
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("\n")
      .trim()
    return Response.json({ text })
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError)
      return Response.json({ error: "bad_key" }, { status: 503 })
    if (error instanceof Anthropic.RateLimitError)
      return Response.json({ error: "rate_limited" }, { status: 429 })
    if (error instanceof Anthropic.APIError)
      return Response.json(
        { error: "api", status: error.status },
        { status: 502 },
      )
    return Response.json({ error: "unknown" }, { status: 502 })
  }
}
