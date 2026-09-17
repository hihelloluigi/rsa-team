import type { Dictionary } from "./it";

// The English copy. Adapted rather than translated where the Italian is a
// joke: the aim is the same shrug in English, not the same words. A few things
// stay Italian on purpose — the "SIAMO MATTI" motto is the club's identity (it
// is printed on the shirt), and "terzo tempo" has no English equivalent worth
// having, so it is explained once and then used.
export const en: Dictionary = {
  meta: {
    siteTitle: "RSA TEAM — Siamo Matti",
    siteDescription:
      "The team that attacks because defending is too much effort. Squad, fixtures and league table of RSA TEAM, amateur football from Bergamo, Italy.",
  },
  nav: {
    home: "Home",
    squad: "Squad",
    matches: "Matches",
    club: "The Club",
    contact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
    switchLabel: "Italiano",
    switchAria: "Passa all'italiano",
  },
  footer: {
    rights: "All rights reserved",
    navLabel: "Legal and contact",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
  },
  common: {
    round: (n: number) => `Matchday ${n}`,
    kickoffAt: (time: string) => `${time} kick-off`,
    postponed: "Postponed",
    share: "Share",
    shareAria: (title: string) => `Share: ${title}`,
    linkCopied: "Link copied",
  },
  positions: {
    short: { GK: "GK", DEF: "DEF", MID: "MID", FWD: "FWD" },
    long: { GK: "Goalkeeper", DEF: "Defender", MID: "Midfielder", FWD: "Forward" },
    plural: { GK: "Goalkeepers", DEF: "Defenders", MID: "Midfielders", FWD: "Forwards" },
  },
  results: {
    short: { W: "W", D: "D", L: "L" },
    long: { W: "Win", D: "Draw", L: "Defeat" },
  },
  content: {
    competitions: { Andata: "First leg", Ritorno: "Return leg" },
    staffRoles: {
      Allenatore: "Manager",
      "Assistente Allenatore": "Assistant Manager",
      Presidente: "President",
    },
  },
  notFound: {
    title: "Offside.",
    body: "This page has strayed offside. Not even VAR can save it.",
    cta: "Back to the home page",
  },
  hero: {
    since: (year: number) => `Since ${year}`,
    squadCta: "Meet the squad",
    matchesCta: "The matches",
  },
  home: {
    situationLabel: "Results & fixtures",
    situationTitle: "Who we're up against",
    noFixturesTitle: "“A team that doesn't play can't lose”",
    noFixturesBody: (season: string) =>
      `The ${season} fixtures aren't out yet. In the meantime you can relive last season. Spoiler: we didn't finish bottom.`,
    noFixturesCta: "See past seasons",
    lastResult: "Last result",
    nextMatch: "Next match",
    seasonOver: "Season over. See you at the next draw.",
    thenComes: "Up after that",
    allMatches: "All matches",
    shirtLabel: "The shirt",
    shirtTitle: "Dressed like a real team",
    sponsorsLabel: "Who backs us",
    sponsorsTitle: "Sponsors",
    featuredLabel: "The squad",
    featuredTitle: "Hot Players",
  },
  shirt: {
    alt: "The RSA TEAM shirt: midnight blue with a white and pink band, pink collar and SIAMO MATTI across the back",
    dragHint: "Drag to spin it",
    viewsLabel: "Shirt views",
    front: "Front",
    back: "Back",
    rotate: "Spin",
    zoomOut: "Zoom out",
    zoomIn: "Zoom in",
  },
  instagram: {
    label: "Behind the scenes",
    titleWithPosts: "Photographic evidence",
    titleWithoutPosts: "Follow us on Instagram",
    postAlt: (date: string) => `Instagram post from ${date}`,
    video: "Video",
    album: "Gallery",
    open: "Open preview",
    close: "Close preview",
    previous: "Previous",
    next: "Next",
    openOnInstagram: "Open on Instagram",
    pitchTitle: "Don't miss a second of our “preparation”",
    pitchBody:
      "Training (when we turn up), the terzo tempo — the post-match drinks, which we have never once skipped — and behind-the-scenes footage nobody asked for. More aperitivo than tactics: it's the only way you'll ever see us run.",
    follow: (handle: string) => `Follow @${handle}`,
  },
  sponsorInvite: {
    title: "This space could be yours",
    body: (club: string) =>
      `Fancy backing ${club}? Become a sponsor: your logo right here, in front of everyone (including the ones who don't run).`,
    cta: "Become a sponsor",
  },
  squad: {
    metaTitle: "Squad",
    metaDescription:
      "The full RSA TEAM squad: goalkeepers, defenders, midfielders and forwards, with numbers, positions and stats.",
    title: "The Squad",
  },
  player: {
    metaFallbackTitle: "Player",
    metaDescription: (name: string, role: string, number: number, nationality?: string) =>
      `${name}: ${role}, number ${number} for RSA TEAM${nationality ? ` (${nationality})` : ""}.`,
    back: "← Back to the squad",
    nationality: "Nationality",
    age: "Age",
    since: "Since",
    appearances: "Appearances",
    goals: "Goals",
    assists: "Assists",
    cleanSheets: "Clean sheets",
    motm: "Man of the match",
  },
  matches: {
    metaTitle: "Matches",
    metaDescription:
      "Fixtures, results and league table for RSA TEAM, season by season. Every match played by the amateur club from Bergamo.",
    seasonMetaTitle: (season: string) => `Matches ${season}`,
    seasonMetaDescription: (season: string) =>
      `Fixtures, results and league table for RSA TEAM in the ${season} season.`,
    srTitle: (club: string) => `Matches, results and league table — ${club}`,
    season: "Season",
    league: "League",
    emptyTitle: "“A team that doesn't play can't lose”",
    emptyBody: (season: string) =>
      `The ${season} fixtures will be drawn in September. Check back later; we'll be training in the meantime. Probably.`,
    emptyFooter: "We're mad, not psychic.",
    calendarLabel: "Fixtures",
    calendarTitle: "Coming up",
    playedQuote: "Could have gone better. Could also have gone worse.",
    resultsLabel: "Results",
    resultsTitle: "Played",
    standingsLabel: "Standings",
    standingsTitle: "The Table",
    restLine: "Bye week — the one matchday we can't possibly lose.",
  },
  standings: {
    team: "Team",
    columns: ["Pts", "P", "W", "D", "L", "GF", "GA", "GD"],
  },
  calendar: {
    eyebrow: "Never miss one",
    title: "Take the fixtures with you",
    body: (club: string) =>
      `Add ${club}'s matches to your calendar — this season and the ones before. It updates itself: if a kick-off moves, a match is called off or a result comes in, it's there without you lifting a finger.`,
    preferFile: "Rather have a file? Download",
    allSeasons: "every season",
    or: "or",
    onlySeason: (season: string) => `just ${season}`,
    googleNote: "Google re-checks external calendars every so often, not instantly.",
    languageNote: "The calendar entries themselves are in Italian.",
  },
  match: {
    metaFallbackTitle: "Match",
    metaDescription: (fixture: string, competition: string, season: string) =>
      `${fixture} · ${competition}, RSA TEAM's ${season} season.`,
    back: "← Back to the matches",
    wasScheduled: "Was scheduled for",
    scorers: "Scorers",
    noGoals: "No goals",
    ground: "The Ground",
    kickoff: "Kick-off",
    detailsSoon: "Ground and scorers coming soon.",
    ogAlt: "RSA TEAM match",
  },
  club: {
    metaTitle: "The Club",
    metaDescription:
      "Who RSA TEAM are: the club's story, the staff and the home ground in Bergamo. More heart than tactics, as ever.",
    label: "The Club",
    title: "Who we are",
    founded: "Founded in",
    home: "Home ground",
    staff: "The staff",
  },
  contact: {
    metaTitle: "Contact",
    metaDescription:
      "Get in touch with RSA TEAM: to become a sponsor, arrange a friendly, play with us or anything else.",
    label: "Contact",
    title: "Give us a shout",
    intro:
      "Want to take us on in a friendly, play for us, put your logo on the shirts, or just tell us we played badly? Write to us: we read everything, criticism included (that one a bit more slowly).",
    dmWithForm: "Not a forms person? Send us a DM, we answer there too.",
    dmOnly: "Send us a DM on Instagram: that's where we answer.",
    dmCta: "Message us on Instagram",
  },
  sponsorPage: {
    metaTitle: "Become a sponsor",
    metaDescription:
      "Fancy backing RSA TEAM? Become a sponsor: your logo in front of everyone, including the ones who don't run.",
    label: "Who backs us",
  },
  form: {
    topicLabel: "What's this about",
    topics: {
      sponsor: "Becoming a sponsor",
      amichevole: "Arranging a friendly",
      giocare: "Playing with you",
      altro: "Something else",
    },
    name: "Your name",
    organization: "Company or team",
    optional: "(if any)",
    email: "Your email",
    message: "What did you have in mind",
    honeypot: "Website",
    privacyLead: "We only use these details to reply to you. The rest is in the ",
    privacyLink: "privacy notice",
    submit: "Send the message",
    sending: "Sending…",
    sentTitle: "Message received",
    sentBody: "We'll reply as soon as the post-match drinks are over. So, no rush — but we will reply.",
    errors: {
      name: "Tell us your name, at least.",
      email: "That email doesn't look right.",
      messageShort: "Give us a couple more lines.",
      messageLong: "Love the enthusiasm, but keep it under 2000 characters.",
      invalid: "Something in the form doesn't add up. Check it and try again.",
      send: "That didn't go through: ball lost in midfield. Try again shortly, or message us on Instagram.",
    },
  },
  cookie: {
    aria: "Cookie notice",
    title: "Legally required cookie notice",
    close: "Close the notice",
    body: "The only cookies we like are the ones you can eat. No profiling here, no third parties, no data sold to anyone: the only thing we jot down is that you closed this notice.",
    aside: "(The data protection authority would be proud. The manager, less so.)",
    details: "Details",
  },
  legal: {
    eyebrow: "The serious bit",
    privacyTitle: "Privacy notice",
    privacyMetaTitle: "Privacy",
    privacyMetaDescription:
      "What personal data the RSA TEAM website collects, why, for how long, and how to have it deleted. Spoiler: very little, and no tracking cookies.",
    termsTitle: "Terms of use",
    termsMetaTitle: "Terms",
    termsMetaDescription:
      "The terms of use of the RSA TEAM website: who owns the content and photos, where results and tables come from, and what we do (not) guarantee.",
    updated: (date: string) => `Last updated: ${date}.`,
  },
};
