import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsOfService() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8 font-montserrat">Podmienky Služby</h1>

        <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
            <p className="text-sm text-blue-800 font-medium">
              Posledná aktualizácia: {new Date().toLocaleDateString("sk-SK")}
            </p>
          </div>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Prijatie podmienok</h2>
            <p className="leading-relaxed">
              Používaním webovej stránky AI Workshop Experti a našich služieb súhlasíte s týmito Podmienkami služby. Ak
              nesúhlasíte s týmito podmienkami, nepoužívajte naše služby.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Opis služieb</h2>
            <p className="leading-relaxed mb-4">AI Workshop Experti poskytuje:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Firemné AI workshopy a školenia</li>
              <li>Konzultačné služby v oblasti umelej inteligencie</li>
              <li>Vzdelávacie materiály a zdroje</li>
              <li>Prispôsobené AI riešenia pre podniky</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Registrácia a účet</h2>
            <p className="leading-relaxed mb-4">Pri registrácii na naše služby sa zaväzujete:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Poskytovať presné a aktuálne informácie</li>
              <li>Udržiavať bezpečnosť vašich prihlasovacích údajov</li>
              <li>Okamžite nás informovať o akejkoľvek neoprávnenej aktivite</li>
              <li>Byť zodpovedný za všetky aktivity vo vašom účte</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Platby a refundácie</h2>
            <h3 className="text-xl font-medium text-gray-800 mb-3">4.1 Platby</h3>
            <p className="leading-relaxed mb-4">
              Všetky poplatky sú splatné vopred, pokiaľ nie je dohodnuté inak. Prijímame platby prostredníctvom
              bankového prevodu, kreditných kariet a iných schválených metód.
            </p>

            <h3 className="text-xl font-medium text-gray-800 mb-3">4.2 Refundácie</h3>
            <p className="leading-relaxed">
              Refundácie sú možné do 14 dní od zakúpenia služby, pokiaľ nebola služba ešte poskytnutá. Po začatí
              workshopu alebo konzultácie nie sú refundácie možné.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Duševné vlastníctvo</h2>
            <p className="leading-relaxed mb-4">
              Všetok obsah, materiály a duševné vlastníctvo poskytované počas našich služieb zostávajú vlastníctvom AI
              Workshop Experti. Klienti získavajú licenciu na používanie materiálov výlučne pre interné účely svojej
              organizácie.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Dôvernosť</h2>
            <p className="leading-relaxed">
              Zaväzujeme sa chrániť dôverné informácie klientov. Všetky informácie zdieľané počas workshopov a
              konzultácií budú považované za dôverné a nebudú zdieľané s tretími stranami bez výslovného súhlasu.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Obmedzenie zodpovednosti</h2>
            <p className="leading-relaxed mb-4">AI Workshop Experti nebude zodpovedný za:</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Nepriame, náhodné alebo následné škody</li>
              <li>Stratu zisku alebo obchodných príležitostí</li>
              <li>Škody presahujúce sumu zaplatenú za naše služby</li>
              <li>Škody spôsobené nesprávnym používaním našich služieb</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Zrušenie služieb</h2>
            <p className="leading-relaxed">
              Vyhradzujeme si právo zrušiť alebo pozastaviť naše služby v prípade porušenia týchto podmienok alebo
              nevhodného správania. Klienti môžu zrušiť služby s predchádzajúcim 48-hodinovým upozornením.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Zmeny podmienok</h2>
            <p className="leading-relaxed">
              Vyhradzujeme si právo kedykoľvek upraviť tieto Podmienky služby. O významných zmenách budeme informovať
              e-mailom alebo prostredníctvom našej webovej stránky.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Rozhodné právo</h2>
            <p className="leading-relaxed">
              Tieto Podmienky služby sa riadia právom Slovenskej republiky. Všetky spory budú riešené pred príslušnými
              súdmi v Bratislave.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Kontakt</h2>
            <p className="leading-relaxed">Pre otázky týkajúce sa týchto Podmienok služby nás kontaktujte:</p>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <p>
                <strong>E-mail:</strong> legal@aiworkshopexperts.com
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
