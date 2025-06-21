import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#2A2F5B] text-white py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center text-blue-200 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            Späť na hlavnú stránku
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 font-montserrat">Zásady Ochrany Súkromia</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800 font-medium">
              Posledná aktualizácia: {new Date().toLocaleDateString("sk-SK")}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Úvod</h2>
            <p className="leading-relaxed">
              AI Workshop Experti ("my", "nás", "naša spoločnosť") si váži vaše súkromie a je odhodlaná chrániť vaše
              osobné údaje. Tieto Zásady ochrany súkromia vysvetľujú, ako zbierame, používame, zdieľame a chránime vaše
              informácie, keď navštívite našu webovú stránku a využívate naše služby.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Informácie, ktoré zbierame</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">2.1 Osobné údaje</h3>
            <p className="leading-relaxed mb-4">
              Keď nás kontaktujete prostredníctvom našich formulárov, môžeme zbierať:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Meno a priezvisko</li>
              <li>E-mailovú adresu</li>
              <li>Názov spoločnosti</li>
              <li>Telefónne číslo (ak je poskytnuté)</li>
              <li>Správy a komunikáciu s nami</li>
            </ul>

            <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">2.2 Automaticky zbierané údaje</h3>
            <p className="leading-relaxed mb-4">Keď navštívite našu webovú stránku, automaticky zbierame:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>IP adresu a informácie o prehliadači</li>
              <li>Údaje o návštevách stránok (cez Vercel Analytics)</li>
              <li>Cookies a podobné technológie</li>
              <li>Informácie o zariadení a operačnom systéme</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Ako používame vaše údaje</h2>
            <p className="leading-relaxed mb-4">Vaše osobné údaje používame na:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Odpoveď na vaše otázky a žiadosti</li>
              <li>Poskytovanie našich služeb a workshopov</li>
              <li>Zlepšovanie našej webovej stránky a služieb</li>
              <li>Zasielanie marketingových komunikácií (len so súhlasom)</li>
              <li>Dodržiavanie právnych povinností</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Zdieľanie údajov</h2>
            <p className="leading-relaxed mb-4">Vaše osobné údaje nezdieľame s tretími stranami, okrem:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Poskytovateľov služieb (napr. e-mailové služby, analytické nástroje)</li>
              <li>Právnych požiadaviek alebo súdnych príkazov</li>
              <li>Ochrany našich práv a bezpečnosti</li>
              <li>So vaším výslovným súhlasom</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Cookies a analytické nástroje</h2>
            <p className="leading-relaxed mb-4">
              Používame Vercel Analytics na sledovanie návštevnosti našej webovej stránky. Tieto nástroje zbierajú
              anonymné údaje o vašom používaní stránky. Môžete sa rozhodnúť neprijať cookies prostredníctvom nášho
              cookie banneru.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Vaše práva</h2>
            <p className="leading-relaxed mb-4">Máte právo na:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Prístup k vašim osobným údajom</li>
              <li>Opravu nesprávnych údajov</li>
              <li>Vymazanie vašich údajov</li>
              <li>Obmedzenie spracovania</li>
              <li>Prenosnosť údajov</li>
              <li>Námietku proti spracovaniu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Bezpečnosť údajov</h2>
            <p className="leading-relaxed">
              Implementujeme primerané technické a organizačné opatrenia na ochranu vašich osobných údajov pred
              neoprávneným prístupom, zmenou, zverejnením alebo zničením.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Kontakt</h2>
            <p className="leading-relaxed">
              Ak máte otázky týkajúce sa týchto Zásad ochrany súkromia, kontaktujte nás na:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p>
                <strong>E-mail:</strong> privacy@aiworkshopexperts.com
              </p>
              <p>
                <strong>Adresa:</strong> [Vaša adresa bude doplnená]
              </p>
              <p>
                <strong>Telefón:</strong> +421 123 456 789
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
