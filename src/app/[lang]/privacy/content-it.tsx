import Link from "next/link";
import LegalSection, { type LegalContentProps } from "@/components/LegalSection";

// The Italian privacy notice — the original. content-en.tsx is its faithful
// translation: change one and the other has to follow, and so does UPDATED in
// page.tsx.
export default function PrivacyIt({ club, contactHref }: LegalContentProps) {
  return (
    <>
      <p className="text-lg text-muted">
        In campo improvvisiamo, con i tuoi dati no. Qui sotto trovi cosa raccogliamo (poco), perché
        e come farcelo cancellare. Informativa ai sensi dell&apos;art. 13 del Regolamento (UE)
        2016/679 («GDPR»).
      </p>

      <LegalSection title="Chi è il titolare">
        <p>
          Il titolare del trattamento è <strong>{club.dataController}</strong>, che ha realizzato e
          gestisce questo sito per conto dell&apos;{club.name}, una squadra amatoriale senza
          personalità giuridica.
        </p>
        <p>
          Per qualsiasi richiesta sui tuoi dati scrivici dalla pagina{" "}
          <Link href={contactHref}>Contatti</Link>
          {club.instagram && (
            <>
              {" "}o con un messaggio diretto su{" "}
              <a href={club.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </>
          )}
          .
        </p>
      </LegalSection>

      <LegalSection title="Quali dati trattiamo e perché">
        <ul>
          <li>
            <strong>Modulo di contatto.</strong> Nome, email, eventuale azienda o squadra e il
            testo del messaggio. Li usiamo solo per risponderti: la base giuridica è la tua stessa
            richiesta (art. 6.1.b GDPR). Il messaggio ci arriva per email e non finisce in nessun
            database del sito. Lo conserviamo per il tempo necessario a gestire la richiesta e
            comunque non oltre 12 mesi dall&apos;ultimo scambio.
          </li>
          <li>
            <strong>Dati di navigazione.</strong> Come ogni sito, il server che ci ospita registra
            per ragioni tecniche e di sicurezza dati come indirizzo IP, pagina richiesta e tipo di
            browser. Raccogliamo inoltre statistiche di visita aggregate e anonime, senza cookie e
            senza riconoscerti da una visita all&apos;altra (legittimo interesse, art. 6.1.f GDPR).
          </li>
          <li>
            <strong>Giocatori e staff.</strong> Nomi, foto, numeri di maglia e statistiche dei
            tesserati sono pubblicati con il loro consenso. Sei in rosa e vuoi far togliere o
            correggere qualcosa? Dillo al mister, o scrivici: lo facciamo subito.
          </li>
          <li>
            <strong>Area riservata.</strong> La pagina di amministrazione è accessibile solo al
            gestore del sito, tramite il suo account GitHub. Non ti riguarda, a meno che tu non sia
            lui.
          </li>
        </ul>
        <p>
          Non facciamo profilazione, non vendiamo né cediamo dati a nessuno e non ti iscriviamo a
          nessuna newsletter.
        </p>
      </LegalSection>

      <LegalSection id="cookie" title="Cookie">
        <p>
          Questo sito <strong>non usa cookie di profilazione né di terze parti</strong>, e le
          statistiche di visita funzionano senza cookie. Per questo non ti chiediamo nessun
          consenso: non c&apos;è niente a cui acconsentire.
        </p>
        <p>L&apos;unica cosa che salviamo nel tuo browser è di natura tecnica:</p>
        <ul>
          <li>
            un appunto nella memoria locale del browser che ricorda che hai chiuso l&apos;avviso sui
            cookie, così non te lo riproponiamo a ogni visita. Non contiene dati personali e non
            lascia mai il tuo dispositivo;
          </li>
          <li>
            un cookie di sessione, solo per chi accede all&apos;area riservata (cioè nessuno, a parte
            il gestore del sito).
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Chi altro vede i dati">
        <p>Per far funzionare il sito ci appoggiamo a fornitori che trattano i dati per nostro conto:</p>
        <ul>
          <li><strong>Vercel Inc.</strong> — hosting del sito e statistiche di visita aggregate;</li>
          <li><strong>Resend</strong> — recapito dei messaggi inviati dal modulo di contatto;</li>
          <li>il fornitore della casella email su cui riceviamo quei messaggi.</li>
        </ul>
        <p>
          Alcuni di questi fornitori hanno sede negli Stati Uniti: il trasferimento avviene con le
          garanzie previste dal GDPR (EU-US Data Privacy Framework o clausole contrattuali
          standard).
        </p>
        <p>
          Le foto in home page vengono dal nostro profilo Instagram, ma te le serviamo noi: finché
          guardi le foto, Instagram non sa che sei passato di qui. I video invece, se ne apri uno,
          vengono riprodotti direttamente dai server di Instagram (Meta), che in quel momento
          riceve il tuo indirizzo IP come per qualunque contenuto scaricato; nessun cookie viene
          salvato. Una volta su Instagram, o su qualunque altro sito a cui rimandiamo, vale la loro
          informativa.
        </p>
      </LegalSection>

      <LegalSection title="I tuoi diritti">
        <p>
          Puoi chiederci in ogni momento di sapere quali dati abbiamo su di te, di correggerli,
          cancellarli, limitarne l&apos;uso o riceverne una copia, e puoi opporti al loro
          trattamento (artt. 15-22 GDPR). Basta scriverci dalla pagina{" "}
          <Link href={contactHref}>Contatti</Link>: rispondiamo entro un mese, di solito molto prima.
        </p>
        <p>
          Se pensi che abbiamo gestito male i tuoi dati puoi presentare reclamo al{" "}
          <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer">
            Garante per la protezione dei dati personali
          </a>
          . Ma prima scrivici: di solito ci si chiarisce.
        </p>
      </LegalSection>

    </>
  );
}
