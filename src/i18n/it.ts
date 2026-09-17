// The Italian copy — the original, and the shape every other language has to
// match (en.ts is checked against `Dictionary`). Strings with a hole in them
// are functions. Client components cannot be handed functions, so they receive
// the finished strings as props from a server component.
export const it = {
  meta: {
    siteTitle: "RSA TEAM — Siamo Matti",
    siteDescription:
      "La squadra che gioca all'attacco perché difendere è troppa fatica. Rosa, partite e classifica dell'RSA TEAM.",
  },
  nav: {
    home: "Home",
    squad: "Squadra",
    matches: "Partite",
    club: "Il Club",
    contact: "Contatti",
    openMenu: "Apri menu",
    closeMenu: "Chiudi menu",
    language: "Lingua",
    // The language link names where it leads, in that language — so an English
    // speaker can read it on an Italian page.
    switchLabel: "English",
    switchAria: "Switch to English",
  },
  footer: {
    rights: "Tutti i diritti riservati",
    navLabel: "Note legali e contatti",
    contact: "Contatti",
    privacy: "Privacy",
    terms: "Note legali",
  },
  common: {
    round: (n: number) => `${n}ª giornata`,
    kickoffAt: (time: string) => `ore ${time}`,
    postponed: "Rinviata",
    share: "Condividi",
    shareAria: (title: string) => `Condividi: ${title}`,
    linkCopied: "Link copiato",
  },
  // Short labels on badges, and the full words read out in their place.
  positions: {
    short: { GK: "POR", DEF: "DIF", MID: "CEN", FWD: "ATT" },
    long: { GK: "Portiere", DEF: "Difensore", MID: "Centrocampista", FWD: "Attaccante" },
    plural: { GK: "Portieri", DEF: "Difensori", MID: "Centrocampisti", FWD: "Attaccanti" },
  },
  results: {
    short: { W: "V", D: "N", L: "P" },
    long: { W: "Vittoria", D: "Pareggio", L: "Sconfitta" },
  },
  // Values that live in the content JSON in Italian. A value with no entry
  // here is shown as written, so new content never breaks a page.
  content: {
    competitions: { Andata: "Andata", Ritorno: "Ritorno" } as Record<string, string>,
    staffRoles: {
      Allenatore: "Allenatore",
      "Assistente Allenatore": "Assistente Allenatore",
      Presidente: "Presidente",
    } as Record<string, string>,
  },
  notFound: {
    title: "Fuorigioco.",
    body: "Questa pagina è in fuorigioco. Nemmeno il VAR può salvarla.",
    cta: "Torna alla home",
  },
  hero: {
    since: (year: number) => `Dal ${year}`,
    squadCta: "Conosci la rosa",
    matchesCta: "Le partite",
  },
  home: {
    situationLabel: "Risultati e calendario",
    situationTitle: "Chi ci tocca adesso",
    noFixturesTitle: "«Squadra che non gioca, non perde»",
    noFixturesBody: (season: string) =>
      `Il calendario della stagione ${season} non è ancora uscito. Nel frattempo puoi rivederti la scorsa stagione: spoiler, non siamo arrivati ultimi.`,
    noFixturesCta: "Guarda le stagioni passate",
    lastResult: "Ultimo risultato",
    nextMatch: "Prossima partita",
    seasonOver: "Stagione finita. Ci vediamo al prossimo sorteggio.",
    thenComes: "Poi tocca a",
    allMatches: "Tutte le partite",
    shirtLabel: "La maglia",
    shirtTitle: "Vestiti da squadra vera",
    sponsorsLabel: "Chi ci sostiene",
    sponsorsTitle: "Sponsor",
    featuredLabel: "La rosa",
    featuredTitle: "Hot Players",
  },
  shirt: {
    alt: "Maglia dell'RSA TEAM: blu notte con banda bianca e rosa, colletto rosa e SIAMO MATTI sulla schiena",
    dragHint: "Trascina per girarla",
    viewsLabel: "Viste della maglia",
    front: "Fronte",
    back: "Retro",
    rotate: "Ruota",
    zoomOut: "Riduci",
    zoomIn: "Ingrandisci",
  },
  instagram: {
    label: "Dietro le quinte",
    titleWithPosts: "Prove fotografiche",
    titleWithoutPosts: "Seguici su Instagram",
    postAlt: (date: string) => `Post Instagram del ${date}`,
    video: "Video",
    album: "Galleria",
    pitchTitle: "Non perderti un attimo della nostra «preparazione»",
    pitchBody:
      "Allenamenti (quando ci andiamo), terzi tempi (quelli mai saltati) e dietro le quinte che nessuno ci ha chiesto. C'è più aperitivo che tattica: è l'unico modo per vederci correre.",
    follow: (handle: string) => `Seguici @${handle}`,
  },
  sponsorInvite: {
    title: "Questo spazio può essere tuo",
    body: (club: string) =>
      `Vuoi sostenere l'${club}? Diventa nostro sponsor: il tuo logo qui, sotto gli occhi di tutti (anche di chi non corre).`,
    cta: "Diventa sponsor",
  },
  squad: {
    metaTitle: "Squadra",
    metaDescription:
      "La rosa completa dell'RSA TEAM: portieri, difensori, centrocampisti e attaccanti, con numeri, ruoli e statistiche.",
    title: "La Rosa",
  },
  player: {
    metaFallbackTitle: "Giocatore",
    metaDescription: (name: string, role: string, number: number, nationality?: string) =>
      `${name}: ${role} numero ${number} dell'RSA TEAM${nationality ? `, ${nationality}` : ""}.`,
    back: "← Torna alla rosa",
    nationality: "Nazionalità",
    age: "Età",
    since: "Dal",
    appearances: "Presenze",
    goals: "Gol",
    assists: "Assist",
    cleanSheets: "Porte inviolate",
    motm: "Migliore in campo",
  },
  matches: {
    metaTitle: "Partite",
    metaDescription:
      "Calendario, risultati e classifica dell'RSA TEAM, stagione per stagione. Tutte le partite del club amatoriale di Bergamo.",
    seasonMetaTitle: (season: string) => `Partite ${season}`,
    seasonMetaDescription: (season: string) =>
      `Calendario, risultati e classifica dell'RSA TEAM nella stagione ${season}.`,
    srTitle: (club: string) => `Partite, risultati e classifica — ${club}`,
    season: "Stagione",
    league: "Campionato",
    emptyTitle: "«Squadra che non gioca, non perde»",
    emptyBody: (season: string) =>
      `Le partite della stagione ${season} verranno sorteggiate in settembre. Puoi tornare più avanti, noi intanto ci alleniamo. Forse.`,
    emptyFooter: "Siamo matti, non veggenti.",
    calendarLabel: "Calendario",
    calendarTitle: "Prossime",
    playedQuote: "Poteva andare meglio, ma poteva andare anche peggio.",
    resultsLabel: "Risultati",
    resultsTitle: "Giocate",
    standingsLabel: "Classifica",
    standingsTitle: "La Classifica",
    restLine: "Turno di riposo — l'unica giornata in cui non rischiamo di perdere.",
  },
  standings: {
    team: "Squadra",
    // Pti, G, V, N, P, GF, GS, DR — in the order the table draws them.
    columns: ["Pti", "G", "V", "N", "P", "GF", "GS", "DR"],
  },
  calendar: {
    eyebrow: "Non perdertene una",
    title: "Porta il calendario con te",
    body: (club: string) =>
      `Aggiungi le partite dell'${club} al tuo calendario — questa stagione e quelle passate. Si aggiorna da solo: se cambia un orario, salta una partita o arriva un risultato, lo trovi lì senza rifare nulla.`,
    preferFile: "Preferisci un file? Scarica",
    allSeasons: "tutte le stagioni",
    or: "o",
    onlySeason: (season: string) => `solo la ${season}`,
    googleNote: "Google ricontrolla i calendari esterni ogni tanto, non all'istante.",
    // The feed itself is in Italian whatever the page's language.
    languageNote: "",
  },
  match: {
    metaFallbackTitle: "Partita",
    metaDescription: (fixture: string, competition: string, season: string) =>
      `${fixture} · ${competition}, stagione ${season} dell'RSA TEAM.`,
    back: "← Torna alle partite",
    wasScheduled: "Era in programma",
    scorers: "Marcatori",
    noGoals: "Nessun gol",
    ground: "Il Campo",
    kickoff: "Calcio d'inizio",
    detailsSoon: "Campo e marcatori in arrivo.",
    ogAlt: "Partita dell'RSA TEAM",
  },
  club: {
    metaTitle: "Il Club",
    metaDescription:
      "Chi è l'RSA TEAM: la storia del club, lo staff e il campo di casa a Bergamo. Più cuore che tattica, da sempre.",
    label: "Il Club",
    title: "Chi siamo",
    founded: "Fondato nel",
    home: "Casa nostra",
    staff: "Lo staff",
  },
  contact: {
    metaTitle: "Contatti",
    metaDescription:
      "Scrivi all'RSA TEAM: per diventare sponsor, organizzare un'amichevole, giocare con noi o qualsiasi altra cosa.",
    label: "Contatti",
    title: "Fatti sentire",
    intro:
      "Vuoi sfidarci in amichevole, giocare con noi, mettere il tuo logo sulle maglie o solo dirci che abbiamo giocato male? Scrivici: leggiamo tutto, anche le critiche (quelle con più calma).",
    dmWithForm: "I form non fanno per te? Scrivici in direct, rispondiamo anche lì.",
    dmOnly: "Scrivici in direct su Instagram: rispondiamo lì.",
    dmCta: "Scrivici su Instagram",
  },
  sponsorPage: {
    metaTitle: "Diventa sponsor",
    metaDescription:
      "Vuoi sostenere l'RSA TEAM? Diventa nostro sponsor: il tuo logo sotto gli occhi di tutti, anche di chi non corre.",
    label: "Chi ci sostiene",
  },
  form: {
    topicLabel: "Perché ci scrivi",
    topics: {
      sponsor: "Diventare sponsor",
      amichevole: "Organizzare un'amichevole",
      giocare: "Giocare con voi",
      altro: "Altro",
    },
    name: "Come ti chiami",
    organization: "Azienda o squadra",
    optional: "(se c'è)",
    email: "La tua email",
    message: "Cosa avevi in mente",
    honeypot: "Sito web",
    privacyLead: "Usiamo questi dati solo per risponderti. I dettagli sono nell'",
    privacyLink: "informativa privacy",
    submit: "Manda il messaggio",
    sending: "Invio…",
    sentTitle: "Messaggio ricevuto",
    sentBody: "Ti rispondiamo appena finisce il terzo tempo. Quindi con calma, ma ti rispondiamo.",
    errors: {
      name: "Dicci almeno come ti chiami.",
      email: "Questa email non sembra valida.",
      messageShort: "Scrivici due righe in più.",
      messageLong: "Bello l'entusiasmo, ma stai sotto i 2000 caratteri.",
      invalid: "Qualcosa nel modulo non torna. Ricontrolla e riprova.",
      send: "Non è partito: palla persa a centrocampo. Riprova tra poco, o scrivici su Instagram.",
    },
  },
  cookie: {
    aria: "Avviso sui cookie",
    title: "Avviso cookie obbligatorio per legge",
    close: "Chiudi l'avviso",
    body: "Solo che di cookie non ne usiamo: niente profilazione, niente terze parti, nessun dato venduto a nessuno. L'unica cosa che ci segniamo è che hai chiuso questo avviso.",
    aside: "(Il Garante sarebbe fiero di noi. Il mister un po' meno.)",
    details: "Dettagli",
  },
  legal: {
    eyebrow: "Le cose serie",
    privacyTitle: "Informativa privacy",
    privacyMetaTitle: "Privacy",
    privacyMetaDescription:
      "Quali dati personali raccoglie il sito dell'RSA TEAM, perché, per quanto tempo e come chiederne la cancellazione. Spoiler: pochi, e niente cookie di profilazione.",
    termsTitle: "Note legali",
    termsMetaTitle: "Note legali",
    termsMetaDescription:
      "Le condizioni d'uso del sito dell'RSA TEAM: di chi sono contenuti e foto, da dove arrivano risultati e classifiche e cosa (non) garantiamo.",
    updated: (date: string) => `Ultimo aggiornamento: ${date}.`,
  },
};

export type Dictionary = typeof it;
