import Link from "next/link";
import LegalSection, { type LegalContentProps } from "@/components/LegalSection";

// The Italian terms — the original. content-en.tsx is its faithful translation.
export default function TermsIt({ club, season, contactHref, privacyHref }: LegalContentProps) {
  return (
    <>
      <p className="text-lg text-muted">
        Poche regole, come al campetto. Usando questo sito le accetti; se non ti vanno, nessun
        rancore: ci vediamo direttamente al campo.
      </p>

      <LegalSection title="Cos'è questo sito">
        <p>
          È il sito dell&apos;{club.name}, una squadra di calcio amatoriale. Non è una testata
          giornalistica, non vende niente e non ha scopo di lucro: serve a raccontare la squadra,
          il calendario e i risultati. Lo gestisce {club.dataController}, a titolo personale.
        </p>
      </LegalSection>

      <LegalSection title="Contenuti e foto">
        <p>
          Testi, grafiche, logo e foto sono dell&apos;{club.name} o dei rispettivi autori. Puoi
          condividere le pagine quanto vuoi (anzi, grazie). Per riutilizzare foto o contenuti
          altrove chiedi prima: basta un messaggio dalla pagina <Link href={contactHref}>Contatti</Link>.
        </p>
        <p>
          Sei in una foto e preferiresti non esserci? Scrivici e la togliamo, senza discussioni.
        </p>
      </LegalSection>

      <LegalSection title="Sponsor e marchi">
        <p>
          I loghi e i nomi degli sponsor appartengono ai rispettivi titolari e compaiono qui con il
          loro accordo. La loro presenza non significa che rispondano di quello che pubblichiamo,
          né tantomeno di come giochiamo.
        </p>
      </LegalSection>

      <LegalSection title="Risultati, classifiche e calendario">
        <p>
          Risultati, classifiche e orari sono inseriti a mano o ripresi dal sito del campionato
          {season?.leagueUrl ? (
            <>
              {" "}(<a href={season.leagueUrl} target="_blank" rel="noopener noreferrer">{season.league}</a>)
            </>
          ) : null}
          , che resta l&apos;unica fonte ufficiale. Facciamo del nostro meglio per tenerli aggiornati,
          ma possono contenere errori o ritardi: prima di attraversare la città per una partita,
          controlla la fonte ufficiale. Lo stesso vale per il calendario a cui puoi abbonarti.
        </p>
      </LegalSection>

      <LegalSection title="Nessuna garanzia">
        <p>
          Il sito è offerto così com&apos;è, senza garanzie di disponibilità o di esattezza, e può
          cambiare o sparire in qualsiasi momento. Nei limiti consentiti dalla legge non rispondiamo
          di danni derivanti dal suo uso. Non rispondiamo nemmeno dei siti esterni a cui rimandiamo,
          Instagram compreso.
        </p>
      </LegalSection>

      <LegalSection title="Dati personali">
        <p>
          Come trattiamo i tuoi dati è spiegato nell&apos;<Link href={privacyHref}>informativa privacy</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Legge applicabile">
        <p>
          Queste note sono regolate dalla legge italiana. Possiamo aggiornarle: fa fede la versione
          pubblicata su questa pagina.
        </p>
      </LegalSection>

    </>
  );
}
