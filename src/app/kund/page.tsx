import type { Metadata } from "next"
import { Geist } from "next/font/google"

import { KundDashboard } from "@/components/kund/kund-dashboard"
import { FIRM } from "@/components/kund/data"

// The Swedish twin of /kunde: same view, Swedish copy, Fortnox instead of
// Tripletex, SEK, Skatteverket and Bolagsverket instead of Altinn.
const geist = Geist({ variable: "--font-sans", subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${FIRM.name} · Sanna`,
  description: "Kundappen så som den kan se ut för ett konsultbolag i Sverige.",
}

export default function KundPage() {
  return <KundDashboard className={geist.variable} />
}
