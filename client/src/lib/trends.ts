// LEO Trend-Radar — kuratierte Trend-Signale mit Quelle und Ablaufdatum.
// Recherche-Stand: Oktober 2026 (Nachtrag 08.10.2026). Jedes Signal stützt sich auf eine veröffentlichte Quelle.
// Pflege: monatlich per geplanter Aufgabe (1. des Monats) – abgelaufene Signale raus, neue Signale rein, Quellen prüfen.
// Abgelaufene Signale (expires < heute) werden automatisch ignoriert.

export type TrendDomain =
  | 'kommunikation'
  | 'design'
  | 'kultur'
  | 'marketing'
  | 'musik'
  | 'gesundheit'
  | 'lifestyle';

export const TREND_DOMAINS: Record<TrendDomain, string> = {
  kommunikation: 'Kommunikation',
  design: 'Design',
  kultur: 'Kultur',
  marketing: 'Marketing',
  musik: 'Musik',
  gesundheit: 'Gesundheit',
  lifestyle: 'Lifestyle',
};

export type TrendGoal = 'reach' | 'community' | 'positioning' | 'conversion';

export type TrendSource = {
  label: string;
  url: string;
  /** YYYY, YYYY-MM oder YYYY-MM-DD */
  date: string;
};

export type TrendSignal = {
  id: string;
  domain: TrendDomain;
  title: string;
  /** Was die Quelle sagt — mit Zahl, wenn es eine gibt */
  insight: string;
  /** Was man daraus machen kann */
  move: string;
  /** Wann man die Finger davon lässt */
  skip: string;
  principles: string[];
  platforms: string[];
  goals: TrendGoal[];
  /** kleingeschriebene Stichworte (de/en), gegen die Antworten gematcht */
  keywords: string[];
  sources: TrendSource[];
  /** YYYY-MM-DD — danach fällt das Signal raus */
  expires: string;
};

const SHORT = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'Instagram Stories'];

export const TREND_SIGNALS: TrendSignal[] = [
  // ───────────── KOMMUNIKATION ─────────────
  {
    id: 'k-reali-tea',
    domain: 'kommunikation',
    title: 'Reali-TEA: Alltag schlägt Fantasie',
    insight:
      'TikTok sieht Eskapismus auf dem Rückzug. Hashtags wie #lockedin, #hygiene und #joblife wachsen, #delulu und #digitalescapism verlieren.',
    move: 'Routine, Arbeit und Rückschläge zeigen, nicht nur das Ergebnis. Der Trainingstag statt des Siegerfotos.',
    skip: 'Wenn das Produkt vom Traum lebt (Reisen, Luxus) und der Alltag nichts Spannendes hergibt.',
    principles: ['P01', 'P06', 'P25'],
    platforms: SHORT,
    goals: ['community', 'positioning'],
    keywords: ['alltag', 'routine', 'ehrlich', 'echt', 'authentisch', 'rückschlag', 'disziplin', 'training', 'arbeit', 'job', 'prozess', 'behind'],
    sources: [{ label: 'TikTok Next 2026 Trend Report', url: 'https://ads.tiktok.com/business/library/TikTok_Next_2026_Trend_Report.pdf', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-curiosity-detours',
    domain: 'kommunikation',
    title: 'Curiosity Detours: Entdeckt wird auf Umwegen',
    insight:
      'Laut TikTok finden zwei von drei Suchenden etwas Nützliches jenseits ihrer ursprünglichen Suche. Jede:r Vierte sucht innerhalb von 30 Sekunden nach App-Start. Duracell wuchs, indem es der K-Pop-Community folgte, die Batterien für Lightsticks braucht.',
    move: 'Fragen: In welcher Nachbar-Nische wird euer Produkt schon benutzt, ohne dass ihr es wisst? Dorthin Content bauen.',
    skip: 'Wenn die Nische nicht zur Marke passt und nur Reichweite geborgt wird.',
    principles: ['P04', 'P12', 'P16'],
    platforms: ['TikTok', 'YouTube Shorts'],
    goals: ['reach'],
    keywords: ['nische', 'szene', 'suche', 'entdecken', 'community', 'fans', 'subkultur', 'zweckentfremd'],
    sources: [{ label: 'TikTok Next 2026, zusammengefasst von Segwise', url: 'https://segwise.ai/blog/tiktok-next-2026-trend-report-performance-marketer-playbook', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-comments-script',
    domain: 'kommunikation',
    title: 'Kommentare sind das Skript',
    insight:
      'TikTok und Kantar: Millennials und Gen Z probieren 1,5-mal häufiger eine neue Marke wegen ihrer Community. Oreo nutzte Kommentare als Skript für Kooperationen und steigerte die Shares um 12 %.',
    move: 'Die nächste Folge aus den Kommentaren der letzten bauen und das sichtbar machen.',
    skip: 'Wenn es noch keine Kommentare gibt. Dann erst P05: zuhören, wo die Leute schon reden.',
    principles: ['P11', 'P05', 'P09'],
    platforms: SHORT,
    goals: ['community'],
    keywords: ['kommentar', 'community', 'feedback', 'dm', 'fragen', 'dialog', 'antwort'],
    sources: [{ label: 'TikTok Next 2026, zusammengefasst von Segwise', url: 'https://segwise.ai/blog/tiktok-next-2026-trend-report-performance-marketer-playbook', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-social-search',
    domain: 'kommunikation',
    title: 'Social ist Suchmaschine',
    insight:
      'Hootsuite: Google indexiert öffentliche Instagram- und Kurzvideo-Inhalte, Social SEO und Answer Engine Optimisation werden Planungsthema. Trends brennen schneller ab und sind nischiger als früher.',
    move: 'Hook und On-Screen-Text in den Worten formulieren, die eure Leute wirklich suchen. Ein Video beantwortet eine Frage.',
    skip: 'Wenn das Format von Überraschung lebt und kein Suchbedürfnis dahinter steht.',
    principles: ['P10', 'P03'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube', 'YouTube Shorts'],
    goals: ['reach', 'conversion'],
    keywords: ['suche', 'google', 'seo', 'finden', 'frage', 'erklär', 'tutorial', 'how to', 'anleitung'],
    sources: [{ label: 'Hootsuite Social Trends 2026', url: 'https://www.thinkdigital.travel/research-directory/hootsuite-social-trends-2026', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-snowball',
    domain: 'kommunikation',
    title: 'Follower zählen weniger, Themen mehr',
    insight:
      'Hootsuite beschreibt den Wechsel von Rabbit-Hole- zu Snowball-Mechanik: Reichweite entsteht, wenn ein Thema über viele Creator hinweg wiederholt auftaucht. Die Followerzahl wird ein schwächerer Reichweiten-Indikator.',
    move: 'Ein Thema über mehrere Stimmen streuen (Athletinnen, Trainer, Fans) statt nur den eigenen Kanal hochzuziehen.',
    skip: 'Wenn die Marke noch keinen klaren Kern hat. Dann wird aus Streuung Rauschen.',
    principles: ['P18', 'P13', 'P20'],
    platforms: SHORT,
    goals: ['reach'],
    keywords: ['follower', 'reichweite', 'creator', 'influencer', 'kanal', 'wachstum', 'kollab'],
    sources: [{ label: 'Hootsuite Social Trends 2026', url: 'https://www.thinkdigital.travel/research-directory/hootsuite-social-trends-2026', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-news-creators',
    domain: 'kommunikation',
    title: 'Menschen sind die neuen Absender',
    insight:
      'Reuters Digital News Report 2026: Social und Video überholen TV und Publisher-Seiten als Nachrichtenquelle. Mehr als die Hälfte der 18- bis 24-Jährigen nennt Social, Video oder KI als Hauptquelle. 27 % bekommen News von News-Creators.',
    move: 'Fachleute aus dem eigenen Haus als Gesichter aufbauen. Eine Person, die erklärt, statt einer Pressemitteilung.',
    skip: 'Wenn niemand intern vor die Kamera will. Erzwungene Gesichter wirken schlimmer als keine.',
    principles: ['P22', 'P07', 'P18'],
    platforms: ['YouTube', 'TikTok', 'Instagram Reels', 'LinkedIn'],
    goals: ['positioning'],
    keywords: ['news', 'nachricht', 'experte', 'expertise', 'presse', 'erklär', 'wissen', 'gesicht', 'gründer', 'ceo'],
    sources: [{ label: 'Reuters Institute Digital News Report 2026', url: 'https://www.newscaststudio.com/2026/06/18/reuters-https-reutersinstitute-politics-ox-ac-uk-digital-news-report-2026-how-news-creators-are-impacting-politics-and-media-around-world-2026/', date: '2026-06-16' }],
    expires: '2027-06-30',
  },
  {
    id: 'k-trust-near',
    domain: 'kommunikation',
    title: 'Vertrauen gibt es nur noch im Nahfeld',
    insight:
      'Edelman Trust Barometer 2026: Rund 70 % zögern, Menschen mit anderen Werten zu vertrauen, in Deutschland 81 %. Vertrauen in Nachbarn, Familie und Kolleg:innen steigt, in große Medien und Regierungen sinkt.',
    move: 'Die sprechen lassen, denen man schon vertraut: Mitarbeitende, Kundschaft, Vereinskolleg:innen. Keine Botschaft von oben.',
    skip: 'Nie. Aber Testimonials müssen echt sein, sonst kippt es ins Gegenteil.',
    principles: ['P07', 'P23', 'P05'],
    platforms: [],
    goals: ['positioning', 'conversion'],
    keywords: ['vertrauen', 'glaubwürdig', 'testimonial', 'mitarbeiter', 'kunden', 'nachbar', 'lokal', 'verein', 'team'],
    sources: [{ label: 'Edelman Trust Barometer 2026', url: 'https://www.edelman.com/index.php/news-awards/2026-edelman-trust-barometer-society-slides-into-insularity', date: '2026-01-18' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-de-platforms',
    domain: 'kommunikation',
    title: 'Deutschland: YouTube vorn, Instagram stagniert',
    insight:
      'ARD/ZDF-Medienstudie 2025: YouTube erreicht 72 % der Menschen ab 14. Instagram liegt bei 40 % Wochenreichweite und verliert bei Jüngeren, TikTok wächst auf 20 %. Podcasts nutzen 48 % der 14- bis 29-Jährigen regelmäßig, das stärkste Wachstum gibt es bei den über 50-Jährigen.',
    move: 'Für Zielgruppen ab 30 YouTube und Podcast mitdenken. Instagram nicht automatisch als Hauptbühne setzen.',
    skip: 'Wenn die Zielgruppe klar unter 20 ist. Dann zählen WhatsApp und Snapchat mehr (siehe JIM).',
    principles: ['P10'],
    platforms: ['YouTube', 'Podcast'],
    goals: ['reach'],
    keywords: ['deutschland', 'erwachsene', 'podcast', 'youtube', 'ältere', 'eltern', 'best ager'],
    sources: [{ label: 'ARD/ZDF-Medienstudie 2025 (onlinemarketing.de)', url: 'https://onlinemarketing.de/cases/ard-zdf-medienstudie-2025', date: '2025-10-01' }],
    expires: '2026-12-31',
  },
  {
    id: 'k-teens-dm',
    domain: 'kommunikation',
    title: 'Teens leben in Chats, KI ist Alltag',
    insight:
      'JIM-Studie 2025: WhatsApp ist mit Abstand die wichtigste App, Snapchat liegt vor TikTok. 70 % der 12- bis 19-Jährigen nutzen KI zur Informationssuche (plus 27 Prozentpunkte). Knapp vier Stunden Smartphone-Zeit am Tag, 68 % fällt es schwer, sie zu begrenzen.',
    move: 'Für unter 20-Jährige Content bauen, der in Gruppenchats weitergeleitet wird: Screenshot-tauglich, kurz, mit Insider-Code.',
    skip: 'Wenn die Zielgruppe Eltern sind und nicht die Jugendlichen selbst.',
    principles: ['P02', 'P04', 'P16'],
    platforms: ['Instagram Stories', 'TikTok'],
    goals: ['community', 'reach'],
    keywords: ['jugend', 'teen', 'schüler', 'u18', 'u20', 'kinder', 'jugendliche', 'whatsapp', 'snapchat', 'gruppe'],
    sources: [{ label: 'JIM-Studie 2025, mpfs', url: 'https://mpfs.de/app/uploads/2025/11/PM_JIM-2025.pdf', date: '2025-11' }],
    expires: '2026-12-31',
  },
  {
    id: 'k-rage-bait',
    domain: 'kommunikation',
    title: 'Rage Bait ist verbrannt',
    insight: 'Oxford wählte „rage bait“ zum Wort des Jahres 2025. Empörung als Reichweiten-Trick ist benannt und durchschaut.',
    move: 'Reibung ja, Köder nein. Eine klare Position mit Begründung, die man teilen will, nicht eine, über die man sich nur aufregt.',
    skip: 'Warnsignal, kein Trend zum Nachmachen.',
    principles: ['P24', 'P11'],
    platforms: [],
    goals: ['positioning'],
    keywords: ['provok', 'kontrovers', 'polarisier', 'aufreg', 'meinung', 'hot take', 'empör'],
    sources: [{ label: 'Oxford Word of the Year 2025', url: 'https://www.westhawaiitoday.com/2025/12/01/nation-world-news/the-oxford-2025-word-of-the-year-is-rage-bait', date: '2025-12-01' }],
    expires: '2026-12-31',
  },

  // ───────────── DESIGN ─────────────
  {
    id: 'd-imperfect',
    domain: 'design',
    title: 'Imperfect by Design',
    insight:
      'Canva Design Trends 2026: Suchen nach Lo-fi-Ästhetik +527 %, DIY und Collage +90 %, Zine- und Substack-Layouts +85 %. 80 % der befragten Creator sagen, 2026 holen sie sich die kreative Kontrolle zurück.',
    move: 'Scrapbook, Notizen-App-Screens, Handschrift, sichtbare Skizzen. Der Prozess als Gestaltung.',
    skip: 'Wenn Präzision das Produktversprechen ist (Medizin, Finanzen, Luxus-Handwerk).',
    principles: ['P01', 'P25', 'P06'],
    platforms: ['Instagram', 'TikTok', 'Instagram Stories'],
    goals: ['community', 'positioning'],
    keywords: ['lo-fi', 'roh', 'handgemacht', 'skizze', 'collage', 'zine', 'scrapbook', 'diy', 'unperfekt', 'imperfekt'],
    sources: [{ label: 'Canva 2026 Design Trends', url: 'https://ecommercenews.com.au/story/canva-backs-imperfect-by-design-trend-in-2026-report', date: '2026-01-12' }],
    expires: '2027-03-31',
  },
  {
    id: 'd-surreal',
    domain: 'design',
    title: 'Surreal und verspielt',
    insight:
      'Adobe Creative Trends 2026 nennt surreales, humorvolles Design als Treiber. Canva misst +220 % Suchen nach „liminal“ und „uncanny“. Laut VICE-Daten (zitiert bei PPC Land) suchen 68 % der Jugendlichen weltweit aktiv nach Humor als Flucht.',
    move: 'Ein bewusster Bruch in Frame 1: falscher Maßstab, falscher Ort, falsches Objekt.',
    skip: 'Wenn es nach generischer KI-Optik aussieht (siehe Signal „Sichtbare KI kostet“).',
    principles: ['P15', 'P03', 'P19'],
    platforms: SHORT,
    goals: ['reach'],
    keywords: ['humor', 'lustig', 'absurd', 'surreal', 'witz', 'verspielt', 'überraschung', 'bruch'],
    sources: [
      { label: 'Adobe 2026 Creative Trends (PPC Land)', url: 'https://ppc.land/adobe-forecasts-four-creative-trends-shaping-2026-advertising-campaigns/', date: '2025-12-20' },
      { label: 'Canva 2026 Design Trends', url: 'https://ecommercenews.com.au/story/canva-backs-imperfect-by-design-trend-in-2026-report', date: '2026-01-12' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'd-multisensory',
    domain: 'design',
    title: 'Multisensorisch: Textur, Ton, Bewegung',
    insight:
      'Adobe 2026: Content, der mehrere Sinne anspricht (Textur, Bewegung, Sound). Laut einer bei PPC Land zitierten Studie erwarten 82 % der Konsument:innen, dass neue Inhalte ihre Sinne ansprechen. Canva misst +30 % Suchen nach realistischen Texturen.',
    move: 'Makro-Aufnahmen von Material, Geräusche im Vordergrund. Der Griff an den Judogi, das Klatschen auf der Matte.',
    skip: 'Wenn es keinen physischen Gegenstand gibt, den man zeigen kann.',
    principles: ['P14', 'P25', 'P03'],
    platforms: SHORT,
    goals: ['reach', 'conversion'],
    keywords: ['material', 'stoff', 'textur', 'sound', 'ton', 'haptik', 'produkt', 'handwerk', 'gefühl'],
    sources: [
      { label: 'Adobe 2026 Creative Trends (PPC Land)', url: 'https://ppc.land/adobe-forecasts-four-creative-trends-shaping-2026-advertising-campaigns/', date: '2025-12-20' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'd-local',
    domain: 'design',
    title: 'Lokal ist das neue Global',
    insight:
      'Adobe 2026 setzt auf lokale Creator und regionales Handwerk. Canva meldet regionale Bewegungen wie Zinegeist in Mexiko (+77 % für Brutalismus und Typo-Poster) und Block Party in Spanien (Folklore Urbano).',
    move: 'Regionale Codes nutzen: Dialekt, Orte, die nur Einheimische kennen, lokale Handwerker:innen als Partner.',
    skip: 'Wenn die Marke bewusst ortlos und global auftreten muss.',
    principles: ['P16', 'P04', 'P18'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['lokal', 'regional', 'stadt', 'heimat', 'dialekt', 'nrw', 'ruhrgebiet', 'verein', 'handwerk', 'vor ort'],
    sources: [
      { label: 'Adobe 2026 Creative Trends (PPC Land)', url: 'https://ppc.land/adobe-forecasts-four-creative-trends-shaping-2026-advertising-campaigns/', date: '2025-12-20' },
      { label: 'Canva 2026 Design Trends', url: 'https://ecommercenews.com.au/story/canva-backs-imperfect-by-design-trend-in-2026-report', date: '2026-01-12' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'd-quiet',
    domain: 'design',
    title: 'Ruhe als Unterbrechung',
    insight:
      'Pantone wählte „Cloud Dancer“ (11-4201), ein Weiß, zur Farbe 2026, als Gegengewicht zu einer hektischen Gesellschaft. Canva meldet +54 % Suchen nach „clean layout“, „serif“ und „simple branding“.',
    move: 'Im lauten Feed ist Leere der Pattern Interrupt: viel Weißraum, eine Zeile, ein Bild.',
    skip: 'Wenn die Zielgruppe Energie und Lautstärke erwartet (Esports, Kampfsport-Events).',
    principles: ['P15', 'P03'],
    platforms: ['Instagram', 'LinkedIn'],
    goals: ['positioning'],
    keywords: ['ruhe', 'minimal', 'klar', 'weiß', 'reduziert', 'premium', 'ruhig', 'achtsam'],
    sources: [
      { label: 'Pantone Colour of the Year 2026 (Creative Review)', url: 'https://www.creativereview.co.uk/pantone-colour-of-the-year-2026-cloud-dancer/', date: '2025-12-04' },
      { label: 'Canva 2026 Design Trends', url: 'https://ecommercenews.com.au/story/canva-backs-imperfect-by-design-trend-in-2026-report', date: '2026-01-12' },
    ],
    expires: '2026-12-31',
  },
  {
    id: 'd-ai-visible',
    domain: 'design',
    title: 'Sichtbare KI kostet Vertrauen',
    insight:
      'Hootsuite 2026: 79 % der Social-Media-Manager nutzen KI täglich, aber mehr als 3 von 10 Konsument:innen wählen eine Marke seltener, wenn ihre Ads sichtbar KI-generiert wirken. Merriam-Webster wählte „slop“ zum Wort des Jahres 2025.',
    move: 'KI im Prozess ja, im Ergebnis unsichtbar. Echte Gesichter, echte Orte, echte Fehler.',
    skip: 'Wenn KI selbst das Thema ist und offen gezeigt wird.',
    principles: ['P01', 'P25', 'P23'],
    platforms: [],
    goals: ['positioning', 'conversion'],
    keywords: ['ki', 'ai', 'künstliche intelligenz', 'generiert', 'render', 'cgi', 'automatisier'],
    sources: [
      { label: 'Hootsuite Social Trends 2026', url: 'https://www.thinkdigital.travel/research-directory/hootsuite-social-trends-2026', date: '2026-01' },
      { label: 'Merriam-Webster Word of the Year 2025 (FOX 9)', url: 'https://www.fox9.com/news/merriam-webster-word-year-2025-slop', date: '2025-12-15' },
    ],
    expires: '2027-03-31',
  },

  // ───────────── KULTUR ─────────────
  {
    id: 'c-comfort',
    domain: 'kultur',
    title: 'Comfort Zone: Sicherheit gesucht',
    insight: 'Euromonitor Global Consumer Trends 2026: 58 % erleben moderaten bis extremen Alltagsstress. Menschen suchen Beruhigung und Einfachheit.',
    move: 'Im Ton beruhigen, im Inhalt klar sein. Wiederkehrende Formate geben Halt.',
    skip: 'Wenn die Marke von Adrenalin und Risiko lebt. Dann ist Sicherheit nicht euer Versprechen.',
    principles: ['P13', 'P20'],
    platforms: [],
    goals: ['community'],
    keywords: ['stress', 'sicherheit', 'einfach', 'ruhe', 'halt', 'routine', 'entlast'],
    sources: [{ label: 'Euromonitor Global Consumer Trends 2026', url: 'https://euromonitor.com/newsroom/press-releases/november-2025/euromonitor-international-unveils-global-consumer-trends-for-2026', date: '2025-11-05' }],
    expires: '2027-03-31',
  },
  {
    id: 'c-unfiltered',
    domain: 'kultur',
    title: 'Fiercely Unfiltered',
    insight: 'Euromonitor 2026: Die Hälfte sucht Produkte, die ihre Identität spiegeln. 65 % fühlen sich von der Gesellschaft akzeptiert, wie sie sind.',
    move: 'Kantige Typen zeigen statt Durchschnitt. Die Zielgruppe nicht glätten.',
    skip: 'Wenn die Marke in einer konservativen Branche ihr Vertrauen gerade erst aufbaut.',
    principles: ['P24', 'P22', 'P01'],
    platforms: [],
    goals: ['positioning'],
    keywords: ['identität', 'selbstausdruck', 'individuell', 'anders', 'mutig', 'ehrlich', 'kantig', 'eigensinn'],
    sources: [{ label: 'Euromonitor Global Consumer Trends 2026', url: 'https://euromonitor.com/newsroom/press-releases/november-2025/euromonitor-international-unveils-global-consumer-trends-for-2026', date: '2025-11-05' }],
    expires: '2027-03-31',
  },
  {
    id: 'c-new-young',
    domain: 'kultur',
    title: 'Lebenslage statt Alter',
    insight:
      'Mintel 2026 („The New Young“): Lebensphasen verschwimmen, die Mitte des Lebens wird länger. WARC Marketer’s Toolkit 2026: 59 % der Marketer sagen, Segmentierung nach Alter, Einkommen und Familie funktioniert nicht mehr gut.',
    move: 'Zielgruppe über Situation definieren („Erwachsene, die nach 20 Jahren wieder anfangen“), nicht über Jahrgänge.',
    skip: 'Wenn rechtliche Altersgrenzen gelten (Jugendschutz, Alkohol).',
    principles: ['P12', 'P04'],
    platforms: [],
    goals: ['reach', 'positioning'],
    keywords: ['alter', 'generation', 'gen z', 'millennials', 'erwachsene', 'wiedereinstieg', 'lebensphase', 'eltern', 'senior'],
    sources: [
      { label: 'Mintel 2026 Global Consumer Predictions', url: 'https://tools.prnewswire.com/en-us/live/20823/release/20251008EN92048', date: '2025-10-08' },
      { label: 'WARC Marketer’s Toolkit 2026 (Advanced Television)', url: 'https://www.advanced-television.com/2025/11/11/report-61-marketers-plan-to-increase-creator-marketing-in-2026/', date: '2025-11-11' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'c-affection',
    domain: 'kultur',
    title: 'Affection Deficit: Nähe ist knapp',
    insight: 'Mintel 2026: Interaktionen werden transaktionaler und distanzierter. Marken sollen emotionale Verbindung und kulturelle Bedeutung vor Sichtbarkeit stellen.',
    move: 'Wiederkehrende Rituale bauen: feste Uhrzeit, fester Satz, feste Gesichter.',
    skip: 'Wenn es nur um einen einmaligen Abverkauf geht.',
    principles: ['P20', 'P16', 'P13'],
    platforms: [],
    goals: ['community'],
    keywords: ['nähe', 'beziehung', 'einsam', 'gemeinschaft', 'zugehörig', 'familie', 'ritual'],
    sources: [{ label: 'Mintel 2026 Global Consumer Predictions', url: 'https://tools.prnewswire.com/en-us/live/20823/release/20251008EN92048', date: '2025-10-08' }],
    expires: '2027-03-31',
  },
  {
    id: 'c-anti-algorithm',
    domain: 'kultur',
    title: 'Anti-Algorithmus',
    insight:
      'Mintel 2026: Menschen wehren sich gegen algorithmischen Einfluss und suchen menschlichere, intuitive Erfahrungen. Strava 2025: Mehr als die Hälfte der Gen Z will Strava 2026 mehr nutzen, Instagram und TikTok gleich viel oder weniger.',
    move: 'Kuratierte, menschliche Auswahl zeigen („Was unser Trainer diese Woche liest“), Newsletter und Community-Räume außerhalb des Feeds.',
    skip: 'Wenn Reichweite in kurzer Zeit das einzige Ziel ist.',
    principles: ['P21', 'P05'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['algorithmus', 'kuratier', 'newsletter', 'empfehlung', 'menschlich', 'digital detox', 'offline'],
    sources: [
      { label: 'Mintel 2026 Global Consumer Predictions', url: 'https://tools.prnewswire.com/en-us/live/20823/release/20251008EN92048', date: '2025-10-08' },
      { label: 'Strava Year in Sport 2025 (Pressemitteilung)', url: 'https://www.webull.com/news/13961203642123264', date: '2025-12-03' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'c-analog',
    domain: 'kultur',
    title: 'Analog ist zurück',
    insight:
      'Kommentar in Fortune (Feb. 2026) mit Daten von Nielsen Book UK: 80 % der 14- bis 25-Jährigen bevorzugen gedruckte Bücher. Live Nation meldete 2025 die höchste Konzertbesucherzahl. Laut IFPI wuchs Vinyl 2025 um 13,7 %.',
    move: 'Zum digitalen Format ein physisches Artefakt: Zine, Print, Postkarte, Event.',
    skip: 'Wenn Logistik und Kosten das Budget sprengen. Lieber ein gutes Artefakt als fünf halbe.',
    principles: ['P25', 'P07', 'P21'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['print', 'analog', 'vinyl', 'buch', 'magazin', 'zine', 'film', 'foto', 'event', 'offline', 'konzert'],
    sources: [
      { label: 'Fortune: Gen Z resurrects the analog economy', url: 'https://fortune.com/2026/02/24/gen-z-resurrects-analog-economy-music-print-book-vinyl-concerts', date: '2026-02-24' },
      { label: 'IFPI Global Music Report 2026 (MBW)', url: 'https://musicbusinessworldwide.com/10-quick-and-crucial-takeaways-from-ifpis-global-music-report-2026', date: '2026-03-18' },
    ],
    expires: '2027-06-30',
  },
  {
    id: 'c-human-effort',
    domain: 'kultur',
    title: 'Menschliche Anstrengung als Premium',
    insight:
      'YouTube Culture & Trends 2025: In Südkorea wachsen ungeschnittene Room-Tours und körperlich fordernde Challenges als Gegenpol zu KI-Content. In Mexiko wird Kampf zu Content, in Frankreich zog eine live gestreamte 900-km-Wanderung Millionen an.',
    move: 'Echte Anstrengung zeigen: lang, live, ohne Schnitt. Der Schweiß ist der Beweis.',
    skip: 'Wenn die Anstrengung gestellt ist. Das merkt man sofort.',
    principles: ['P22', 'P07', 'P08'],
    platforms: ['YouTube', 'TikTok'],
    goals: ['community', 'reach'],
    keywords: ['sport', 'athlet', 'training', 'challenge', 'kampf', 'judo', 'boxen', 'wandern', 'lauf', 'live', 'anstrengung', 'schweiß'],
    sources: [{ label: 'YouTube 2025 Culture & Trends (Tubefilter)', url: 'https://www.tubefilter.com/2025/12/15/youtube-2025-culture-and-trends/amp/', date: '2025-12-15' }],
    expires: '2026-12-31',
  },
  {
    id: 'c-de-search',
    domain: 'kultur',
    title: 'Deutschland will verstehen',
    insight:
      'Google Jahresrückblick 2025: Die Top-Frage war „Wie wähle ich bei der Bundestagswahl?“. Rapper Haftbefehl stand vor dem Kanzler. KI ging von „Was ist das?“ zu „Was kann es für mich?“. Im Wellbeing trendeten Proteinrezepte, Matcha und Melatonin.',
    move: 'Erklär-Formate, die eine konkrete Alltagsfrage lösen. Popkultur und Ernst dürfen nebeneinanderstehen.',
    skip: 'Wenn ihr nichts zu erklären habt, was andere nicht schon besser erklären.',
    principles: ['P23', 'P05'],
    platforms: ['YouTube', 'TikTok'],
    goals: ['reach', 'positioning'],
    keywords: ['erklär', 'frage', 'wissen', 'deutschland', 'protein', 'politik', 'rap'],
    sources: [{ label: 'Google Jahresrückblick 2025', url: 'https://blog.google/intl/de-de/produkte/suchen-entdecken/google-jahresrueckblick-2025/', date: '2025-12-04' }],
    expires: '2026-12-31',
  },

  // ───────────── MARKETING ─────────────
  {
    id: 'm-emotional-roi',
    domain: 'marketing',
    title: 'Emotional ROI: erst Warum, dann Angebot',
    insight:
      'TikTok Next 2026 formuliert „Why to Buy = 2(E²) + T“. Marken müssen den Wert vor dem Angebot begründen. Audible steigerte mit einem Community-Post, der nach Fünf-Sterne-Empfehlungen fragte, die Leistung um 376 % über dem Kanal-Schnitt.',
    move: 'Die Community den Kaufgrund liefern lassen: Empfehlungen, Bewertungen, Vorher-Nachher. Das Angebot kommt danach.',
    skip: 'Wenn es keine zufriedene Kundschaft gibt, die man zeigen kann.',
    principles: ['P23', 'P09', 'P02'],
    platforms: SHORT,
    goals: ['conversion'],
    keywords: ['kauf', 'verkauf', 'conversion', 'angebot', 'preis', 'shop', 'buchung', 'bewertung', 'empfehlung'],
    sources: [{ label: 'TikTok Next 2026, zusammengefasst von Segwise', url: 'https://segwise.ai/blog/tiktok-next-2026-trend-report-performance-marketer-playbook', date: '2026-01' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-creator-brand-link',
    domain: 'marketing',
    title: 'Creator-Budgets steigen, Markenbezug fehlt',
    insight:
      'WARC Marketer’s Toolkit 2026: 61 % erhöhen ihr Creator-Budget. Laut Kantar verknüpfen nur 27 % der Creator-Inhalte die Marke wirksam, laut CreativeX verpuffen 45 % des Creator-Spends auf Meta durch schwache Umsetzung.',
    move: 'In jedes Creator-Briefing ein unverwechselbares Marken-Asset (Farbe, Sound, Satz, Objekt), das in den ersten Sekunden sichtbar ist.',
    skip: 'Wenn der Creator nicht zur Szene gehört. Dann hilft auch kein Asset.',
    principles: ['P18', 'P16', 'P03'],
    platforms: SHORT,
    goals: ['reach', 'conversion'],
    keywords: ['creator', 'influencer', 'kooperation', 'kollab', 'partner', 'ambassador', 'botschafter'],
    sources: [{ label: 'WARC Marketer’s Toolkit 2026 (Advanced Television)', url: 'https://www.advanced-television.com/2025/11/11/report-61-marketers-plan-to-increase-creator-marketing-in-2026/', date: '2025-11-11' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-experiences',
    domain: 'marketing',
    title: 'Erlebnisse schlagen Anzeigen',
    insight: 'WARC 2026: 74 % der Marketer investieren in Präsenz-Events, 78 % in digitale Kanäle. Beides wächst zusammen.',
    move: 'Das Event als Content-Maschine planen: vorher BTS, währenddessen live, danach die Kommentare als nächste Folge.',
    skip: 'Wenn niemand das Event filmen und schneiden kann. Dann ist es nur ein Event.',
    principles: ['P06', 'P07', 'P02'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['event', 'veranstaltung', 'turnier', 'workshop', 'messe', 'festival', 'live', 'vor ort'],
    sources: [{ label: 'WARC Marketer’s Toolkit 2026 (Advanced Television)', url: 'https://www.advanced-television.com/2025/11/11/report-61-marketers-plan-to-increase-creator-marketing-in-2026/', date: '2025-11-11' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-zero-click',
    domain: 'marketing',
    title: 'Zero-Click: KI beantwortet die Suche',
    insight:
      'WARC 2026: Nur 11 % der Marketer sind nicht besorgt über KI in der Suche. 24 % verlagern Budget von SEO zu Generative Engine Optimisation. Shopify Q2 2026: KI-vermittelte Shop-Besuche +197 % zum Vorjahr, Conversion in Recherche-Kategorien etwa doppelt so hoch wie organisch. ChatGPT empfiehlt bei Kategorie-Fragen vor allem aus Trainingswissen, der Gratis-Index speichert pro Seite nur Titel und rund 200 Zeichen.',
    move: 'Inhalte so bauen, dass KI-Antworten euch zitieren: eigene Zahlen, klare Fakten, wiedererkennbare Formulierungen. Die ersten zwei Sätze jeder Seite sagen, wer ihr seid und wofür.',
    skip: 'Wenn euer Geschäft komplett über Empfehlung und Vor-Ort läuft.',
    principles: ['P23', 'P10'],
    platforms: ['YouTube', 'LinkedIn'],
    goals: ['conversion', 'positioning'],
    keywords: ['seo', 'google', 'website', 'suche', 'ki', 'chatgpt', 'blog', 'fakten', 'daten'],
    sources: [
      { label: 'WARC Marketer’s Toolkit 2026 (Advanced Television)', url: 'https://www.advanced-television.com/2025/11/11/report-61-marketers-plan-to-increase-creator-marketing-in-2026/', date: '2025-11-11' },
      { label: 'GPO: September 2026 State of Search & AI', url: 'https://gpo.com/blog/september-2026-state-of-search-ai/', date: '2026-09' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'm-middle',
    domain: 'marketing',
    title: 'Die Mitte bricht weg',
    insight: 'WARC 2026: 73 % der Marketer sagen, der Begriff „Mittelschicht“ verliert Bedeutung. Ausgaben verschieben sich zu den Rändern: Premium oder preiswert.',
    move: 'Klar entscheiden, auf welcher Seite ihr steht, und das im Content zeigen: Material, Preis, Haltung.',
    skip: 'Wenn ihr bewusst beides bedient. Dann zwei Linien, zwei Geschichten.',
    principles: ['P24', 'P12'],
    platforms: [],
    goals: ['positioning', 'conversion'],
    keywords: ['preis', 'premium', 'günstig', 'luxus', 'qualität', 'teuer', 'budget', 'mittelklasse'],
    sources: [{ label: 'WARC Marketer’s Toolkit 2026 (Advanced Television)', url: 'https://www.advanced-television.com/2025/11/11/report-61-marketers-plan-to-increase-creator-marketing-in-2026/', date: '2025-11-11' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-fans',
    domain: 'marketing',
    title: 'Fans statt Zielgruppen',
    insight:
      'Deloitte Digital Media Trends 2026: Fans verbringen rund sechs Stunden täglich mit Medien und suchen zwischen großen Releases nach Companion-Podcasts, Videos und Fan-Communities.',
    move: 'Content für die Zeit zwischen den Launches: Companion-Formate, BTS, Fan-Fragen.',
    skip: 'Wenn es keinen Release-Rhythmus gibt, den man begleiten kann.',
    principles: ['P20', 'P06', 'P09'],
    platforms: ['YouTube', 'Podcast', 'Instagram Stories'],
    goals: ['community'],
    keywords: ['fans', 'launch', 'release', 'staffel', 'saison', 'drop', 'community', 'superfan'],
    sources: [{ label: 'Deloitte Digital Media Trends 2026 (Inside Radio)', url: 'https://www.insideradio.com/free/year-round-engagement-key-deloitte-finds-in-2026-digital-media-trends/article_3c7901e8-2272-4b72-8075-5e9dcf0658f7.html', date: '2026-04-02' }],
    expires: '2027-06-30',
  },

  // ───────────── MUSIK ─────────────
  {
    id: 'mu-physical',
    domain: 'musik',
    title: 'Physisch wächst wieder',
    insight:
      'IFPI Global Music Report 2026: Weltweite Umsätze +6,4 % auf 31,7 Mrd. USD. Physische Formate +8 %, Vinyl +13,7 % im 19. Wachstumsjahr in Folge. Lateinamerika +17,1 %, China jetzt auf Platz vier vor Deutschland.',
    move: 'Fan-Artefakte mitdenken: limitierte Editionen, Merch mit Geschichte, Dinge zum Anfassen.',
    skip: 'Wenn das Artefakt nur Merch ohne Bedeutung wäre.',
    principles: ['P07', 'P16', 'P25'],
    platforms: [],
    goals: ['community', 'conversion'],
    keywords: ['musik', 'vinyl', 'merch', 'edition', 'limitiert', 'album', 'artist', 'label', 'band'],
    sources: [{ label: 'IFPI Global Music Report 2026 (MBW)', url: 'https://musicbusinessworldwide.com/10-quick-and-crucial-takeaways-from-ifpis-global-music-report-2026', date: '2026-03-18' }],
    expires: '2027-06-30',
  },
  {
    id: 'mu-language',
    domain: 'musik',
    title: 'Sprache ist keine Hürde mehr',
    insight:
      'Luminate Midyear 2026: Spanischsprachige Inhalte machen 9,4 % der US-Streams aus, Englisch fällt auf ein Rekordtief von 87,1 %. Südkorea ist auf Platz 3, Brasilien auf Platz 8 im Export-Ranking.',
    move: 'Die eigene Sprache, den Dialekt, die regionale Musik bewusst einsetzen statt glattes Englisch.',
    skip: 'Wenn die Zielgruppe international ist und keine gemeinsame Sprache teilt.',
    principles: ['P16', 'P04'],
    platforms: [],
    goals: ['positioning', 'community'],
    keywords: ['sprache', 'deutsch', 'dialekt', 'englisch', 'international', 'latin', 'k-pop', 'musik'],
    sources: [{ label: 'Luminate 2026 Midyear Report', url: 'https://luminatedata.com/blog/luminate-2026-midyear-report-trends-in-music-television-film/', date: '2026-07-15' }],
    expires: '2027-06-30',
  },
  {
    id: 'mu-genz-audio',
    domain: 'musik',
    title: 'Gen Z: Sound als Identität',
    insight:
      'Spotify Culture Next: Gen Z stellt 35 % der Spotify-Hörerschaft und streamt im Schnitt zwei Stunden täglich. Horror, True Crime, Brazilian Funk und Wellness-Kultur gewinnen. Luminate: Dance/Electronic ist das am schnellsten wachsende US-Genre.',
    move: 'Einen eigenen Sound definieren (Jingle, Geräusch, Genre) und konsequent wiederholen.',
    skip: 'Wenn die Zielgruppe deutlich älter ist. Dann eher Podcast als Playlist.',
    principles: ['P14', 'P16'],
    platforms: ['TikTok', 'Instagram Reels', 'Podcast'],
    goals: ['reach', 'positioning'],
    keywords: ['sound', 'musik', 'audio', 'playlist', 'podcast', 'gen z', 'jung', 'beat', 'jingle'],
    sources: [
      { label: 'Spotify Culture Next (Interspace Music)', url: 'https://interspacemusic.com/blog/spotify-culture-next-report-gen-z-streams-2-hours-daily-drives-trends/', date: '2026-06-12' },
      { label: 'Luminate 2026 Midyear Report', url: 'https://luminatedata.com/blog/luminate-2026-midyear-report-trends-in-music-television-film/', date: '2026-07-15' },
    ],
    expires: '2027-06-30',
  },
  {
    id: 'mu-superfans',
    domain: 'musik',
    title: 'Superfans tragen alles',
    insight:
      'Luminate Midyear 2026: 20 % der US-Musikhörer:innen sind Superfans (fünf oder mehr Arten der Beteiligung). 63 % davon sind Gen Z oder Millennials. US-CD-Verkäufe +16 %, getrieben von K-Pop-Fandom.',
    move: 'Stufen für die Treuesten bauen: früherer Zugang, exklusive Inhalte, Mitsprache.',
    skip: 'Wenn noch keine Fans da sind. Erst Publikum, dann Stufen.',
    principles: ['P09', 'P16', 'P20'],
    platforms: [],
    goals: ['community', 'conversion'],
    keywords: ['fans', 'superfan', 'treue', 'community', 'mitglied', 'club', 'exklusiv', 'membership'],
    sources: [{ label: 'Luminate 2026 Midyear Report', url: 'https://luminatedata.com/blog/luminate-2026-midyear-report-trends-in-music-television-film/', date: '2026-07-15' }],
    expires: '2027-06-30',
  },
  {
    id: 'mu-wrapped',
    domain: 'musik',
    title: 'Wrapped-Mechanik: Daten als Spiegel',
    insight: 'Spotify Wrapped 2025 brachte „Listening Age“ und „Clubs“: persönliche Daten als teilbares Identitäts-Objekt.',
    move: 'Ein eigenes „Wrapped“ für eure Community: Jahreszahlen, Trainingsstunden, Lieblingsmomente als teilbare Karte.',
    skip: 'Wenn ihr keine Daten über eure Community habt oder sie nicht nutzen dürft.',
    principles: ['P02', 'P19', 'P23'],
    platforms: ['Instagram Stories', 'TikTok'],
    goals: ['community', 'reach'],
    keywords: ['daten', 'jahresrückblick', 'statistik', 'zahlen', 'rückblick', 'persönlich', 'teilen', 'share'],
    sources: [{ label: 'Spotify Wrapped 2025 (CHCH)', url: 'https://www.chch.com/chch-news/spotify-wrapped-2025-drops-with-new-listening-age-and-music-trend-clubs', date: '2025-12-03' }],
    expires: '2026-12-31',
  },
  {
    id: 'mu-ai',
    domain: 'musik',
    title: 'KI im Studio, nicht in den Charts',
    insight:
      'Luminate 2026: 54 % der US-Musiker:innen sehen generative KI positiv, aber einzelne KI-Tracks haben das Hörverhalten bisher nicht nachhaltig verändert. IFPI warnt vor Streaming-Betrug und arbeitet an KI-Lizenzmodellen.',
    move: 'KI für Workflow und Skizzen, die Stimme bleibt menschlich. Das offen sagen ist ein Statement.',
    skip: 'Wenn KI das Kernprodukt ist.',
    principles: ['P25', 'P01'],
    platforms: [],
    goals: ['positioning'],
    keywords: ['ki', 'ai', 'musik', 'produktion', 'studio', 'kreativ', 'tool'],
    sources: [
      { label: 'Luminate 2026 Midyear Report', url: 'https://luminatedata.com/blog/luminate-2026-midyear-report-trends-in-music-television-film/', date: '2026-07-15' },
      { label: 'IFPI Global Music Report 2026 (MBW)', url: 'https://musicbusinessworldwide.com/10-quick-and-crucial-takeaways-from-ifpis-global-music-report-2026', date: '2026-03-18' },
    ],
    expires: '2027-06-30',
  },

  // ───────────── GESUNDHEIT ─────────────
  {
    id: 'h-over-optimization',
    domain: 'gesundheit',
    title: 'Schluss mit Über-Optimierung',
    insight:
      'Global Wellness Summit 2026: Gegenbewegung zu datenlastigem Performance-Wellness, hin zu emotionaler Sicherheit, Genuss und Verbindung. Dazu Neurowellness: ein überlastetes Nervensystem beruhigen, etwa mit Atemarbeit.',
    move: 'Gesundheit über Gefühl erzählen, nicht über Messwerte. Der Moment nach dem Training statt der Pulskurve.',
    skip: 'Wenn euer Produkt ein Messgerät ist. Dann die Daten menschlich machen.',
    principles: ['P25', 'P22'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['gesundheit', 'wellness', 'stress', 'atem', 'mental', 'erholung', 'achtsam', 'nerven', 'balance'],
    sources: [{ label: 'Global Wellness Summit: 10 Trends 2026', url: 'https://globalwellnessinstitute.org/press-room/press-releases/global-wellness-summit-releases-10-wellness-trends-for-2026', date: '2026-01-27' }],
    expires: '2027-03-31',
  },
  {
    id: 'h-together',
    domain: 'gesundheit',
    title: 'Bewegung ist das neue Treffen',
    insight:
      'Strava Year in Sport 2025: Neue Clubs haben sich fast vervierfacht, Laufclubs ×3,5. Gen Z nutzt Sport 39 % häufiger als Gen X, um Gleichgesinnte zu treffen. Global Wellness Summit 2026 nennt die „Festivalisierung“ von Wellness.',
    move: 'Ein offenes, regelmäßiges Gemeinschaftsformat (Lauftreff, offenes Training, Probetag) als Content-Quelle und Einstieg.',
    skip: 'Wenn niemand jede Woche verlässlich da sein kann.',
    principles: ['P07', 'P09', 'P04'],
    platforms: ['Instagram Stories', 'TikTok'],
    goals: ['community', 'conversion'],
    keywords: ['sport', 'verein', 'club', 'laufen', 'training', 'gruppe', 'gemeinschaft', 'treff', 'kennenlernen', 'event'],
    sources: [
      { label: 'Strava Year in Sport 2025 (Pressemitteilung)', url: 'https://www.webull.com/news/13961203642123264', date: '2025-12-03' },
      { label: 'Global Wellness Summit: 10 Trends 2026', url: 'https://globalwellnessinstitute.org/press-room/press-releases/global-wellness-summit-releases-10-wellness-trends-for-2026', date: '2026-01-27' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'h-women-sport',
    domain: 'gesundheit',
    title: 'Frauensport: die Revolution läuft',
    insight:
      'Global Wellness Summit 2026: Frauenligen, Fandom und Athletinnen werden wirtschaftliche und kulturelle Kraft, Longevity-Medizin richtet sich stärker auf Frauen aus. Strava: Frauen tracken 21 % häufiger Krafttraining als Männer.',
    move: 'Athletinnen als Hauptfiguren erzählen, nicht als Nebenrolle oder Quote.',
    skip: 'Nie, aber ohne Alibi-Kampagne. Lieber dauerhaft als einmal im März.',
    principles: ['P07', 'P22', 'P24'],
    platforms: [],
    goals: ['positioning', 'community'],
    keywords: ['frauen', 'athletin', 'sportlerin', 'mädchen', 'women', 'female', 'gleichberechtigung'],
    sources: [
      { label: 'Global Wellness Summit: 10 Trends 2026', url: 'https://globalwellnessinstitute.org/press-room/press-releases/global-wellness-summit-releases-10-wellness-trends-for-2026', date: '2026-01-27' },
      { label: 'Strava Year in Sport 2025 (Pressemitteilung)', url: 'https://www.webull.com/news/13961203642123264', date: '2025-12-03' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'h-active-aging',
    domain: 'gesundheit',
    title: 'Erwachsene und Ältere als Sport-Zielgruppe',
    insight:
      'ACSM Fitness Trends 2026: Platz 1 Wearables, Platz 2 Fitness für Ältere, dazu Krafttraining, Bewegung für mentale Gesundheit und Sportvereine für Erwachsene in den Top 10.',
    move: 'Den Einstieg für Erwachsene ernst nehmen: eigene Kurse, eigene Gesichter, eigene Sprache. Kein Kinderprogramm in groß.',
    skip: 'Wenn euer Angebot bewusst Nachwuchs und Leistungssport ist.',
    principles: ['P12', 'P07'],
    platforms: ['Instagram', 'YouTube', 'Facebook'],
    goals: ['conversion', 'reach'],
    keywords: ['erwachsene', 'ältere', 'senior', 'wiedereinstieg', 'anfänger', 'fitness', 'kraft', 'verein', 'kurs', 'mental'],
    sources: [{ label: 'ACSM Top Fitness Trends 2026', url: 'https://acsm.org/top-fitness-trends-2026', date: '2025-10-22' }],
    expires: '2026-12-31',
  },
  {
    id: 'h-rewired',
    domain: 'gesundheit',
    title: 'Wellness mit Beleg',
    insight:
      'Euromonitor 2026 („Rewired Wellness“): Die Nachfrage nach technologisch und medizinisch fundierten Produkten steigt. 49 % würden 10 % oder mehr für wissenschaftlich formulierte Beauty-Produkte zahlen.',
    move: 'Wirkversprechen belegen: Studie, Test, Messung. Und die Belege zeigen, nicht nur erwähnen.',
    skip: 'Wenn es keine Belege gibt. Dann lieber über Gefühl erzählen (siehe Über-Optimierung).',
    principles: ['P23'],
    platforms: [],
    goals: ['conversion', 'positioning'],
    keywords: ['studie', 'wissenschaft', 'beweis', 'beleg', 'medizin', 'beauty', 'pflege', 'wirkung', 'test'],
    sources: [{ label: 'Euromonitor Global Consumer Trends 2026', url: 'https://euromonitor.com/newsroom/press-releases/november-2025/euromonitor-international-unveils-global-consumer-trends-for-2026', date: '2025-11-05' }],
    expires: '2027-03-31',
  },
  {
    id: 'h-glp1',
    domain: 'gesundheit',
    title: 'GLP-1 verändert, wie gegessen wird',
    insight:
      'OC&C (Juni 2026, USA): Rund 12 % der US-Erwachsenen nutzen GLP-1-Medikamente. Sie essen kleinere Portionen, snacken weniger, greifen zu Protein und Ballaststoffen, trinken weniger Alkohol. In Deutschland trendeten 2025 laut Google Proteinrezepte.',
    move: 'Food und Gastro: Qualität vor Menge, kleinere Portionen als Feature, Protein nicht als Gimmick.',
    skip: 'Achtung: US-Daten. Für Deutschland nur als Frühsignal lesen.',
    principles: ['P23', 'P12'],
    platforms: [],
    goals: ['positioning', 'conversion'],
    keywords: ['essen', 'ernährung', 'food', 'protein', 'diät', 'abnehmen', 'gewicht', 'gastro', 'snack', 'getränk'],
    sources: [
      { label: 'OC&C: GLP-1 and food & beverage demand', url: 'https://www.occstrategy.com/en/?p=80739', date: '2026-06-08' },
      { label: 'Google Jahresrückblick 2025', url: 'https://blog.google/intl/de-de/produkte/suchen-entdecken/google-jahresrueckblick-2025/', date: '2025-12-04' },
    ],
    expires: '2027-06-30',
  },

  // ───────────── LIFESTYLE ─────────────
  {
    id: 'l-stacking',
    domain: 'lifestyle',
    title: 'Stacking: Kombinieren statt Kaufen',
    insight:
      'Pinterest Predicts 2026: „Scent Stacking“, Suchen nach Nischenparfum-Sammlungen +500 %. „Gimme Gummy“: Jelly Blush +130 %. Auch der Global Wellness Summit nennt Fragrance Layering als Trend 2026.',
    move: 'Produkte als Baukasten zeigen: Welche Kombination bist du? Die Community zeigt ihre Mischung.',
    skip: 'Wenn das Sortiment nur aus einem Produkt besteht.',
    principles: ['P19', 'P09'],
    platforms: ['Pinterest', 'TikTok', 'Instagram'],
    goals: ['community', 'conversion'],
    keywords: ['parfum', 'duft', 'beauty', 'kombination', 'personalisier', 'mix', 'sets', 'sammlung', 'kosmetik'],
    sources: [
      { label: 'Pinterest Predicts 2026 (PPC Land)', url: 'https://ppc.land/pinterest-unveils-21-consumer-trends-for-2026-advertising-campaigns/', date: '2025-12-09' },
      { label: 'Global Wellness Summit: 10 Trends 2026', url: 'https://globalwellnessinstitute.org/press-room/press-releases/global-wellness-summit-releases-10-wellness-trends-for-2026', date: '2026-01-27' },
    ],
    expires: '2026-12-31',
  },
  {
    id: 'l-nostalgia',
    domain: 'lifestyle',
    title: 'Briefe, Spielzeug, Poesie: Nostalgie mit Hand',
    insight:
      'Pinterest Predicts 2026: „Pen Pals“ (Snail-Mail-Geschenke +110 %), „Throwback Kid“ (Nostalgie-Spielzeug +225 %), „Poetcore“ (Poet-Ästhetik +175 %).',
    move: 'Analoge Rituale als Community-Mechanik: handgeschriebene Karten, Brieffreundschaften, Erinnerungsstücke.',
    skip: 'Wenn es nur Retro-Filter ohne echtes Ritual ist.',
    principles: ['P25', 'P07', 'P16'],
    platforms: ['Pinterest', 'Instagram'],
    goals: ['community'],
    keywords: ['nostalgie', 'retro', 'brief', 'karte', 'kindheit', 'erinnerung', 'handschrift', 'poesie', 'vintage'],
    sources: [{ label: 'Pinterest Predicts 2026 (PPC Land)', url: 'https://ppc.land/pinterest-unveils-21-consumer-trends-for-2026-advertising-campaigns/', date: '2025-12-09' }],
    expires: '2026-12-31',
  },
  {
    id: 'l-wild-places',
    domain: 'lifestyle',
    title: 'Raue Orte und Adrenalin',
    insight:
      'Pinterest Predicts 2026: „Mystic Outlands“ (Scotland-Highlands-Ästhetik +465 %) und „Darecations“ (Abenteuertourismus +75 %). Dazu „Extra Celestial“: alien-inspiriertes Make-up +140 %.',
    move: 'Den Ort als Bühne nehmen: raue Landschaft statt Studio, Wetter als Mitspieler.',
    skip: 'Wenn der Ort nichts mit der Geschichte zu tun hat und nur Kulisse ist.',
    principles: ['P03', 'P15', 'P25'],
    platforms: ['Pinterest', 'Instagram', 'YouTube'],
    goals: ['reach', 'positioning'],
    keywords: ['reise', 'natur', 'outdoor', 'landschaft', 'abenteuer', 'berg', 'wetter', 'location', 'drehort'],
    sources: [{ label: 'Pinterest Predicts 2026 (PPC Land)', url: 'https://ppc.land/pinterest-unveils-21-consumer-trends-for-2026-advertising-campaigns/', date: '2025-12-09' }],
    expires: '2026-12-31',
  },
  {
    id: 'l-milestones',
    domain: 'lifestyle',
    title: 'Eigene Meilensteine feiern',
    insight:
      'Booking.com Travel Predictions 2026 („Era of You“): 75 % buchen Reisen, weil sie es sich verdient haben. 73 % interessieren sich für stille Hobbys wie Angeln oder Vogelbeobachtung. 69 % würden eine Reise nutzen, um zu testen, ob man zusammenpasst.',
    move: 'Persönliche Meilensteine der Community sichtbar machen: erste Prüfung, erster Wettkampf, zehntes Jahr.',
    skip: 'Wenn die Meilensteine nur eure eigenen sind (Firmenjubiläum).',
    principles: ['P07', 'P09', 'P20'],
    platforms: ['Instagram', 'Instagram Stories'],
    goals: ['community'],
    keywords: ['meilenstein', 'prüfung', 'erfolg', 'jubiläum', 'feiern', 'belohnung', 'reise', 'hobby', 'gürtel'],
    sources: [{ label: 'Booking.com Travel Predictions 2026 (Hospitality Net)', url: 'https://www.hospitalitynet.org/news/4129344.html', date: '2025-10-15' }],
    expires: '2026-12-31',
  },
  {
    id: 'l-clear-coding',
    domain: 'lifestyle',
    title: 'Clear-Coding: Klartext und Freundeskreis',
    insight:
      'Tinder Year in Swipe 2025: 60 % wollen klare Kommunikation über Absichten. 37 % planen Gruppen- oder Doppeldates (Friendfluence), lockere erste Treffen wie Spaziergang oder Kaffee sind vorn. Strava: 46 % sagen „heck yes“ zum Workout-Date.',
    move: 'In der Ansprache sagen, was ihr wollt. Den Einstieg über Freunde öffnen: „Bring jemanden mit.“',
    skip: 'Wenn der Kontext formal ist (B2B-Einkauf).',
    principles: ['P02', 'P04', 'P24'],
    platforms: ['Instagram', 'TikTok'],
    goals: ['conversion', 'community'],
    keywords: ['dating', 'freunde', 'einladen', 'mitbringen', 'klartext', 'ehrlich', 'probetraining', 'kennenlernen'],
    sources: [
      { label: 'Tinder Year in Swipe 2025 (DE-Pressemitteilung)', url: 'https://filecache.mediaroom.com/mr5mr_tinder_de/181322/download/FINAL_Year%20In%20Swipe%202025%20-%20DE%20Press%20Release.pdf', date: '2025' },
      { label: 'Strava Year in Sport 2025 (Pressemitteilung)', url: 'https://www.webull.com/news/13961203642123264', date: '2025-12-03' },
    ],
    expires: '2026-12-31',
  },
  // ═════════════ NACHTRAG OKTOBER 2026 (Recherche 08.10.2026) ═════════════

  // ───────────── KOMMUNIKATION ─────────────
  {
    id: 'k-ai-disclosure',
    domain: 'kommunikation',
    title: 'KI-Kennzeichnung wird Vertrauensfrage',
    insight:
      'Deloitte Media Consumer Trends 2026 (DE, 2.000 Befragte): Zwei Drittel stört, dass sie KI-Inhalte nicht sicher erkennen, 56 % sehen immer öfter KI-Content ohne Mehrwert. LinkedIn bietet eine Meldefunktion für KI-Posts und ersetzt sein KI-Schreibtool für Premium durch einen reinen „Post Proofreader“. Eine NYT-Recherche fand hunderte KI-generierte Wellness-Personas.',
    move: 'Eine eigene, offene Regel formulieren und zeigen: was Mensch macht, was Maschine hilft. Making-of als Beleg.',
    skip: 'Wenn die Regel nur Marketing-Floskel ist und intern niemand sie einhält.',
    principles: ['P23', 'P01', 'P25'],
    platforms: ['LinkedIn', 'Instagram', 'TikTok'],
    goals: ['positioning'],
    keywords: ['ki', 'ai', 'kennzeichn', 'transparenz', 'echt', 'mensch', 'making-of', 'vertrauen', 'fake', 'deepfake'],
    sources: [
      { label: 'Deloitte Media Consumer Trends 2026 (Presseportal)', url: 'https://www.presseportal.de/pm/60247/6243676', date: '2026' },
      { label: 'Influencer Marketing Trends September 2026 (NewEngen)', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', date: '2026-09' },
      { label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' },
    ],
    expires: '2027-06-30',
  },
  {
    id: 'k-creator-verify',
    domain: 'kommunikation',
    title: 'Creator sind der letzte Check vor dem Kauf',
    insight:
      '43 % der Shopper kauften in den letzten drei Monaten etwas, das ein KI-Chatbot empfohlen hat. 83 % sagen „trust but verify“. Wer KI stark vertraut, vertraut Creators sechsmal häufiger. Creator-Content rutscht vom Awareness-Anfang an das Ende des Kaufwegs.',
    move: 'Creator für den Beweis-Moment briefen: Test, Vergleich, ehrliche Schwäche. Nicht für die Reichweite.',
    skip: 'Wenn es kein Produkt gibt, das man prüfen kann.',
    principles: ['P23', 'P18'],
    platforms: SHORT,
    goals: ['conversion'],
    keywords: ['kauf', 'test', 'review', 'vergleich', 'creator', 'empfehlung', 'chatgpt', 'ki', 'produkt'],
    sources: [{ label: 'Influencer Marketing Trends September 2026 (NewEngen)', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', date: '2026-09' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-two-way',
    domain: 'kommunikation',
    title: 'Zwei-Wege-Kanäle: WhatsApp und geschlossene Räume',
    insight:
      'OMR Festival 2026 (67.000 Besucher): WhatsApp-Newsletter mit höheren Öffnungs-, Conversion- und Interaktionsraten als E-Mail, aber nur im echten Dialog. Geschlossene Communities funktionieren, wenn sie auf Expertise und klarer Position stehen, nicht nur auf Interesse.',
    move: 'Einen Kanal aufmachen, in dem geantwortet wird: Fragen sammeln, Antworten als nächsten Post nutzen.',
    skip: 'Wenn niemand die Antworten pflegen kann. Ein stummer Kanal schadet mehr als keiner.',
    principles: ['P11', 'P09', 'P04'],
    platforms: ['WhatsApp', 'Instagram Stories'],
    goals: ['community', 'conversion'],
    keywords: ['whatsapp', 'newsletter', 'community', 'gruppe', 'kanal', 'dialog', 'mitglieder', 'broadcast'],
    sources: [{ label: 'OMR Festival 2026 Recap (Lenner Marketing)', url: 'https://www.lenner-marketing.de/omr-festival-2026-recap/', date: '2026-05' }],
    expires: '2027-03-31',
  },
  {
    id: 'k-niche-platforms',
    domain: 'kommunikation',
    title: 'Nischen-Plattformen als Rückzugsraum',
    insight:
      'Hootsuite zählt Substack (über 5 Mio. zahlende Abos), Lemon8 (über 77 Mio. Downloads, suchstark, langlebiger als Kurzvideo), Bluesky (40 Mio. Nutzer, werbefrei) und PI.FYI (Empfehlungen ohne Algorithmus) zu den Plattformen, die Marketer kennen sollten. Marken wie Ghia oder Tory Burch publizieren auf Substack unter Gründer- oder Themennamen.',
    move: 'Eine Nische wählen, die zur Szene passt, und dort eine Person sprechen lassen, nicht die Marke.',
    skip: 'Wenn die Zielgruppe dort nachweislich nicht ist. Nicht jede neue App ist eine Bühne.',
    principles: ['P04', 'P12', 'P21'],
    platforms: ['Substack', 'Lemon8', 'Bluesky'],
    goals: ['community', 'positioning'],
    keywords: ['newsletter', 'substack', 'blog', 'nische', 'community', 'plattform', 'text', 'essay', 'gründer'],
    sources: [
      { label: 'Hootsuite: New social media apps 2026', url: 'https://blog.hootsuite.com/new-social-media-apps-platforms/', date: '2026' },
      { label: 'Substack in 2026 (That Random Agency)', url: 'https://thatrandomagency.com/2026/04/13/substack-in-2026', date: '2026-04-13' },
    ],
    expires: '2027-03-31',
  },

  // ───────────── DESIGN ─────────────
  {
    id: 'd-anti-ai-craft',
    domain: 'design',
    title: 'Anti-AI Crafting: sichtbar von Hand',
    insight:
      'Creative Bloq Trends 2026: Stickerei, Tinte, Ton und physische Collage gegen die glatte KI-Optik. Beispiele: Burberrys Kreuzstich-Kampagne, Apples TV-Intro aus mundgeblasenem Glas. Parallel nutzen Studios KI, um alte Handwerke wie Holzschnitt wiederzubeleben.',
    move: 'Ein echtes Material ins Bild holen: genähter Titel, gedruckte Typo, analoges Foto. Den Herstellprozess mitfilmen.',
    skip: 'Wenn das Handwerk nur als Filter simuliert wird.',
    principles: ['P25', 'P01', 'P06'],
    platforms: ['Instagram', 'TikTok'],
    goals: ['positioning'],
    keywords: ['handgemacht', 'handwerk', 'material', 'print', 'stickerei', 'analog', 'collage', 'craft', 'film', 'foto'],
    sources: [{ label: 'Creative Bloq: Graphic design trends 2026', url: 'https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026', date: '2026' }],
    expires: '2027-03-31',
  },
  {
    id: 'd-type-identity',
    domain: 'design',
    title: 'Typo ist die Marke',
    insight:
      'Creative Bloq Trends 2026: Schrift trägt Identität und Ton, statt nur zu begleiten (Spotify Wrapped, Whitney Museum, Burberrys Serif-Refresh, Oatly).',
    move: 'Ein Satz in eigener Schrift als wiedererkennbares Asset in Frame 1. Typo kann ohne Bild stoppen.',
    skip: 'Wenn es keine eigene Typo-Haltung gibt und nur Standardschrift groß gesetzt wird.',
    principles: ['P03', 'P16', 'P15'],
    platforms: SHORT,
    goals: ['positioning', 'reach'],
    keywords: ['typo', 'schrift', 'font', 'claim', 'satz', 'logo', 'wortmarke', 'branding'],
    sources: [{ label: 'Creative Bloq: Graphic design trends 2026', url: 'https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026', date: '2026' }],
    expires: '2027-03-31',
  },
  {
    id: 'd-characters',
    domain: 'design',
    title: 'Maskottchen sind zurück',
    insight:
      'Creative Bloq Trends 2026: Markenfiguren geben Marken und KI-Agenten ein Gesicht, etwa der Charakter in Notion AI oder Dunkins „Spidey D“.',
    move: 'Eine Figur, die etwas darf, was die Marke nicht darf: frech sein, scheitern, kommentieren.',
    skip: 'Wenn die Figur nur Deko ist und keine Rolle in den Geschichten hat.',
    principles: ['P16', 'P08', 'P19'],
    platforms: SHORT,
    goals: ['community', 'reach'],
    keywords: ['maskottchen', 'figur', 'charakter', 'character', 'avatar', 'illustration', 'persona'],
    sources: [{ label: 'Creative Bloq: Graphic design trends 2026', url: 'https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026', date: '2026' }],
    expires: '2027-03-31',
  },
  {
    id: 'd-opulence',
    domain: 'design',
    title: 'Opulenz zurück: Deko, Bühne, Zirkus',
    insight:
      'Pinterest Predicts 2026: „Neodeco“ (Vintage-Barwagen +100 %, rote Marmorbäder +80 %), „Opera Aesthetic“ (Maskerade +95 %), „FunHaus“ (Zirkus-Interiors +130 %), „Glamoratti“ (80s Luxury +225 %).',
    move: 'Für Abend-, Event- und Gastro-Themen: Bühnenlicht, Vorhang, Theatralik als Gegenpol zur Weißraum-Ästhetik.',
    skip: 'Wenn die Marke von Reduktion lebt. Dann lieber „Ruhe als Unterbrechung“.',
    principles: ['P15', 'P03'],
    platforms: ['Pinterest', 'Instagram'],
    goals: ['reach', 'positioning'],
    keywords: ['interior', 'deko', 'bar', 'event', 'gala', 'party', 'luxus', 'bühne', 'theater', 'gastro'],
    sources: [{ label: 'Pinterest Predicts 2026 (nss magazine)', url: 'https://www.nssmag.com/en/lifestyle/43770/pinterest-predicts-2026-aesthetic-trends', date: '2025-12' }],
    expires: '2026-12-31',
  },
  {
    id: 'd-fashion-aw26',
    domain: 'design',
    title: 'Mode AW26: Pink, Karo, Plastik, Power-Anzug',
    insight:
      'Who What Wear AW26: sattes Fuchsia statt Millennial-Rosa, Karos von Reitsport bis Grunge, PVC-Optik, scharfe 80er/90er-Anzüge, 1920er-Silhouetten. Source Fashion beschreibt „Refined Clarity“ als Nachfolger von Quiet Luxury: klare Linien und Details, die man erst beim zweiten Blick sieht.',
    move: 'Styling für Shootings und Kampagnen saisonal anbinden: ein Farb- oder Musterakzent reicht.',
    skip: 'Wenn Mode nicht zum Thema gehört. Dann nicht krampfhaft einbauen.',
    principles: ['P15'],
    platforms: ['Instagram', 'Pinterest', 'TikTok'],
    goals: ['reach'],
    keywords: ['mode', 'fashion', 'outfit', 'styling', 'kleidung', 'look', 'shooting', 'farbe', 'pink'],
    sources: [
      { label: 'Who What Wear: Autumn/Winter 2026 Trends', url: 'https://www.whowhatwear.com/fashion/trends/autumn-winter-2026-trends', date: '2026' },
      { label: 'Source Fashion: New aesthetics of 2026', url: 'https://www.source-fashion.com/latest-articles/new-aesthetics-2026-reveal-shifting-consumer-values', date: '2026' },
    ],
    expires: '2027-02-28',
  },

  // ───────────── KULTUR ─────────────
  {
    id: 'c-2016',
    domain: 'kultur',
    title: '„2026 is the new 2016“',
    insight:
      'Seit Silvester 2025 läuft auf TikTok und YouTube die Nostalgie-Welle für 2016: Snapchat-Hundefilter, Mannequin Challenge, Bottle Flip, Pokémon Go, Playlists „2016“. Zara Larssons „Lush Life“ kam zurück in die Charts. Luminate: Dance/Electronic wächst in den USA am stärksten, auch durch Hits aus 2015 bis 2017.',
    move: 'Eigenes Archiv von vor zehn Jahren ausgraben: damals vs. heute, mit ehrlicher Distanz.',
    skip: 'Wenn die Marke 2016 noch nicht existierte oder die Zielgruppe zu jung dafür ist.',
    principles: ['P16', 'P20', 'P19'],
    platforms: ['TikTok', 'Instagram Reels', 'YouTube'],
    goals: ['reach', 'community'],
    keywords: ['nostalgie', 'retro', 'damals', 'archiv', 'jahre', 'früher', 'throwback', 'jubiläum', '2016'],
    sources: [
      { label: 'Wikipedia: 2026 is the new 2016', url: 'https://en.wikipedia.org/wiki/2026_is_the_new_2016', date: '2026' },
      { label: 'Luminate 2026 Midyear Report', url: 'https://luminatedata.com/blog/luminate-2026-midyear-report-trends-in-music-television-film/', date: '2026-07-15' },
    ],
    expires: '2026-12-31',
  },
  {
    id: 'c-youth-pressure-de',
    domain: 'kultur',
    title: 'Junge Menschen in Deutschland unter Druck',
    insight:
      'Trendstudie „Jugend in Deutschland 2026“ (14 bis 29 Jahre): 29 % sagen, sie brauchen psychologische Unterstützung, 23 % sind verschuldet, oft über Buy-now-pay-later. 41 % denken übers Auswandern nach, 21 % planen es. KI verunsichert beim Blick auf den Job.',
    move: 'Keine Fake-Leichtigkeit. Echten Nutzwert, Ehrlichkeit über Geld und Druck, Räume ohne Leistungszwang.',
    skip: 'Nie als Verkaufsargument missbrauchen. Druck nicht ästhetisieren.',
    principles: ['P05', 'P07', 'P24'],
    platforms: ['TikTok', 'Instagram', 'YouTube'],
    goals: ['community', 'positioning'],
    keywords: ['jugend', 'jung', 'gen z', 'studierende', 'azubi', 'ausbildung', 'job', 'geld', 'mental', 'druck', 'zukunft'],
    sources: [{ label: 'Trendstudie Jugend in Deutschland 2026 (Staatklar)', url: 'https://www.staatklar.org/artikel/trendstudie-jugend-in-deutschland-2026.html', date: '2026-03-26' }],
    expires: '2027-03-31',
  },
  {
    id: 'c-microdrama',
    domain: 'kultur',
    title: 'Microdramas: Serie im Minutentakt',
    insight:
      'Vertikale Serien mit 1 bis 2 Minuten pro Folge, 20 bis 100 Folgen, Cliffhanger am Ende jeder Folge. Weltweit geschätzt rund 11 Mrd. USD Umsatz 2025. ReelShort über 370 Mio. Downloads, Fox finanziert über 200 Serien für My Drama.',
    move: 'Markengeschichte als Mini-Serie mit Cliffhanger denken: Folge 1 heute, Auflösung erst in Folge 3.',
    skip: 'Wenn niemand die Kadenz halten kann. Eine abgebrochene Serie ist schlimmer als ein Einzelpost.',
    principles: ['P08', 'P20', 'P17'],
    platforms: SHORT,
    goals: ['community', 'reach'],
    keywords: ['serie', 'folge', 'episode', 'story', 'drama', 'fiktion', 'storytelling', 'cliffhanger', 'film'],
    sources: [{ label: 'Wikipedia: Microdrama', url: 'https://en.wikipedia.org/wiki/Microdrama', date: '2026' }],
    expires: '2027-06-30',
  },
  {
    id: 'c-streaming-fatigue-de',
    domain: 'kultur',
    title: 'Streaming-Müdigkeit in Deutschland',
    insight:
      'Deloitte Media Consumer Trends 2026: Video-Abos stagnieren erstmals, 64 % der Haushalte haben mindestens eins (im Schnitt 2,5). Die Hälfte findet das Angebot unübersichtlich. Social nutzen 78 %, bei unter 25-Jährigen 91 %.',
    move: 'Nicht um Aufmerksamkeit mit Streamern konkurrieren, sondern dort sein, wo sowieso geschaut wird: kurz, kostenlos, sofort.',
    skip: 'Wenn das Projekt bewusst langes Format ist (Doku, Film). Dann den Trailer social-first bauen.',
    principles: ['P10', 'P17'],
    platforms: ['YouTube', 'TikTok', 'Instagram Reels'],
    goals: ['reach'],
    keywords: ['streaming', 'serie', 'film', 'doku', 'video', 'netflix', 'tv', 'fernsehen'],
    sources: [{ label: 'Deloitte Media Consumer Trends 2026 (Presseportal)', url: 'https://www.presseportal.de/pm/60247/6243676', date: '2026' }],
    expires: '2027-03-31',
  },

  // ───────────── MARKETING ─────────────
  {
    id: 'm-creator-published',
    domain: 'marketing',
    title: 'Der Creator postet, die Marke kollaboriert',
    insight:
      'Emplifi (520.000 Posts, 3.791 Marken): Collabs, die der Creator veröffentlicht, schlagen Marken-Posts und von der Marke veröffentlichte Collabs. 73 % der Marken nutzen das Collab-Feature. Instagram erlaubt jetzt, getaggte Posts ins eigene Profil-Grid zu holen.',
    move: 'Den Post beim Creator lassen, die Marke als Co-Autor dazu. Danach in das eigene Grid holen.',
    skip: 'Wenn der Creator die Marke nicht wirklich nutzt.',
    principles: ['P18', 'P02'],
    platforms: ['Instagram', 'Instagram Reels'],
    goals: ['reach', 'conversion'],
    keywords: ['creator', 'influencer', 'kollab', 'collab', 'kooperation', 'partner', 'instagram', 'botschafter'],
    sources: [{ label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-ops-content',
    domain: 'marketing',
    title: 'Operations-Content: echte Probleme zeigen',
    insight:
      'Beispiel Colorful Natalie (pinker Laden in New York, rund 250.000 Follower): Updates über ausverkaufte Ware und geänderte Öffnungszeiten wurden ihr vertrauenswürdigster Content. LinkedIn testet Creator Discovery für B2B, laut LinkedIn nutzen 63 % der B2B-Käufer früh Creator-Content.',
    move: 'Das Problem posten, bevor es gelöst ist: Lieferung verspätet, Halle voll, Kamera kaputt. Dann die Lösung als Folge 2.',
    skip: 'Wenn es Probleme sind, die Kund:innen schaden und erst gelöst werden müssen.',
    principles: ['P06', 'P23', 'P20'],
    platforms: ['Instagram Stories', 'TikTok', 'LinkedIn'],
    goals: ['community', 'positioning'],
    keywords: ['gründer', 'team', 'alltag', 'laden', 'shop', 'behind', 'bts', 'problem', 'betrieb', 'mitarbeiter', 'b2b'],
    sources: [
      { label: 'Influencer Marketing Trends September 2026 (NewEngen)', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', date: '2026-09' },
      { label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'm-casting',
    domain: 'marketing',
    title: 'Unerwartetes Casting macht Claims glaubwürdig',
    insight:
      'Die Proteinriegel-Marke Prima ließ italienische Nonnas Zutatenlisten lesen und lud zu einem Dinner nur mit Nonnas. Laut NewEngen funktionierte das über Altersgruppen hinweg (ohne genaue Zahlen). Die Frage „Gäbe es das in meiner Küche?“ macht das Versprechen sofort klar.',
    move: 'Die Person casten, die das Versprechen am härtesten prüfen würde, nicht die, die es am schönsten verkauft.',
    skip: 'Wenn das Casting nur ein Gag ist und nichts mit dem Claim zu tun hat.',
    principles: ['P15', 'P23', 'P07'],
    platforms: SHORT,
    goals: ['reach', 'conversion'],
    keywords: ['casting', 'testimonial', 'protagonist', 'oma', 'ältere', 'kunden', 'zutaten', 'claim', 'beweis'],
    sources: [{ label: 'Influencer Marketing Trends September 2026 (NewEngen)', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', date: '2026-09' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-social-commerce',
    domain: 'marketing',
    title: 'Social Commerce wird teuer und groß',
    insight:
      '51 % haben schon über 100 USD in einem Kauf auf TikTok Shop ausgegeben, Pools und Spas wuchsen dort um 125 %. YouTube testet Produkt-Tags in Affiliate-Content, Google bringt One-Click-Ads auf YouTube Shorts. Reddit wird zur Kaufberatung.',
    move: 'Für teure Produkte wenige, passende Creator statt vieler. Fragen aus Reddit-Threads als Content-Briefing nutzen.',
    skip: 'Wenn es keinen Shop und keine Logistik gibt, die schnell liefert.',
    principles: ['P23', 'P10'],
    platforms: ['TikTok', 'YouTube Shorts', 'Reddit'],
    goals: ['conversion'],
    keywords: ['shop', 'kauf', 'verkauf', 'produkt', 'e-commerce', 'onlineshop', 'preis', 'conversion', 'reddit'],
    sources: [
      { label: 'Influencer Marketing Trends September 2026 (NewEngen)', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', date: '2026-09' },
      { label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' },
    ],
    expires: '2027-03-31',
  },
  {
    id: 'm-meta-paywall',
    domain: 'marketing',
    title: 'Meta zieht eine Bezahlschicht ein',
    insight:
      'Meta bietet mit „Meta One for Business“ Abo-Pakete mit KI-Tools und Wettbewerbs-Insights an. Facebook testet offenbar Limits für Link-Posts bei manchen Seiten, mehr Link-Funktion womöglich nur gegen Bezahlung (unbestätigt).',
    move: 'Nicht auf Outbound-Links bauen. Die Botschaft muss im Post selbst funktionieren.',
    skip: 'Wenn Facebook für die Zielgruppe keine Rolle spielt.',
    principles: ['P10', 'P21'],
    platforms: ['Facebook', 'Instagram'],
    goals: ['reach', 'conversion'],
    keywords: ['facebook', 'meta', 'link', 'traffic', 'website', 'anzeige', 'ads', 'reichweite'],
    sources: [{ label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' }],
    expires: '2027-01-31',
  },
  {
    id: 'm-gaming-worlds',
    domain: 'marketing',
    title: 'Gaming-Welten werden Mediakanal',
    insight:
      'GEEIQ 2026: 88 % der Marken-Aktivierungen in virtuellen Welten laufen auf Roblox und Fortnite. Roblox führt CPM-Werbeformate und Pflicht-Kennzeichnung für Brand-Deals ein, ab Januar 2027 eine Umsatzbeteiligung. 87 % der Roblox-Nutzer experimentieren mit dem Avatar-Stil. FIFA baute einen WM-Hub mit allen 48 Teams.',
    move: 'Für Gen Alpha und Gen Z Identität vor Werbung: Avatar-Items, Mitmach-Welten, Sport im Spiel.',
    skip: 'Wenn die Zielgruppe über 30 ist oder es kein Budget für eine echte, gepflegte Welt gibt.',
    principles: ['P09', 'P16', 'P19'],
    platforms: ['Roblox', 'Fortnite', 'Twitch'],
    goals: ['community', 'reach'],
    keywords: ['gaming', 'game', 'esports', 'roblox', 'fortnite', 'gamer', 'avatar', 'gen alpha', 'kinder', 'spiel'],
    sources: [{ label: 'Future Commerce: Roblox Brand Activations 2026', url: 'https://www.futurecommerce.com/posts/roblox-brand-activation-tracker', date: '2026' }],
    expires: '2027-06-30',
  },
  {
    id: 'm-brand-as-creator',
    domain: 'marketing',
    title: 'Marke benimmt sich wie ein Creator',
    insight:
      'OMR Festival 2026: Persönlichkeit, Nahbarkeit und Glaubwürdigkeit zählen mehr als Reichweite. Nano- und Micro-Creator gewinnen gegenüber Großaccounts, „Build in Public“ ersetzt Inszenierung. Mittelmäßiger KI-Content drückt laut vielen Unternehmen die Conversion.',
    move: 'Ein festes Gesicht, ein fester Ton, eine feste Kadenz. Lieber zehn Micro-Creator aus der Szene als ein Star.',
    skip: 'Wenn intern niemand die Stimme der Marke sein will.',
    principles: ['P22', 'P12', 'P13'],
    platforms: SHORT,
    goals: ['positioning', 'community'],
    keywords: ['marke', 'brand', 'gesicht', 'persönlichkeit', 'micro', 'nano', 'creator', 'build in public', 'gründer'],
    sources: [{ label: 'OMR Festival 2026 Recap (Lenner Marketing)', url: 'https://www.lenner-marketing.de/omr-festival-2026-recap/', date: '2026-05' }],
    expires: '2027-03-31',
  },
  {
    id: 'm-collectibles',
    domain: 'marketing',
    title: 'Sammelbares und Athlet:innen statt Promis',
    insight:
      'Trendhunter Branding September 2026: Trading Cards zu Musikgruppen, Blind Boxes, Co-Branding mit Kult-Franchises und 90er-Nostalgie. Sportler:innen und unabhängige Creator ersetzen zunehmend klassische Celebrity-Deals.',
    move: 'Ein Sammelobjekt zur Community bauen: Karten, Pins, Abzeichen. Echte Athlet:innen aus der Szene statt Prominenz.',
    skip: 'Wenn das Objekt keinen Bezug zur Geschichte hat.',
    principles: ['P16', 'P07', 'P18'],
    platforms: [],
    goals: ['community', 'conversion'],
    keywords: ['merch', 'sammel', 'karten', 'trading', 'edition', 'athlet', 'sportler', 'promi', 'kooperation'],
    sources: [{ label: 'Trendhunter: Top 100 Branding Trends September 2026', url: 'https://www.trendhunter.com/slideshow/september-2026-branding', date: '2026-09' }],
    expires: '2027-03-31',
  },

  // ───────────── MUSIK ─────────────
  {
    id: 'mu-reserved',
    domain: 'musik',
    title: 'Treue wird belohnt: Spotify „Reserved“',
    insight:
      'Spotify reserviert mit „Reserved“ Konzerttickets für die treuesten Premium-Hörer:innen, erkannt an Speichern, Teilen und Hördauer, Bots zählen nicht. Partner ist Live Nation, Start in den USA, weitere Märkte folgen. Kein Aufpreis, Teil von Premium.',
    move: 'Treue messbar machen und mit Zugang belohnen, nicht mit Rabatt: zuerst rein, zuerst dabei.',
    skip: 'Wenn ihr Treue nicht erkennen könnt. Dann erst ein einfaches Mitmach-Signal einführen.',
    principles: ['P09', 'P16'],
    platforms: [],
    goals: ['community', 'conversion'],
    keywords: ['fans', 'tickets', 'konzert', 'event', 'treue', 'loyalität', 'vorverkauf', 'exklusiv', 'zugang'],
    sources: [{ label: 'Music Business Worldwide: Spotify Reserved', url: 'https://www.musicbusinessworldwide.com/spotify-to-reserve-concert-tickets-for-superfans-on-premium-tier-live-nation-confirmed-as-launch-partner-as-companies-strike-multi-year-deal/', date: '2026-05-21' }],
    expires: '2027-06-30',
  },
  {
    id: 'mu-real-sounds',
    domain: 'musik',
    title: 'Rock-Revival und handgespielte Sounds',
    insight:
      'Epidemic Sound Trends 2026: Nu-Metal und Rock finden über TikTok neue Fans (Deftones, Korn, Limp Bizkit), Pollstar zählt Rock und Metal zu den umsatzstärksten Touren. Dazu PluggnB (Plugg trifft 90er-R&B) und organische, handgespielte Sounds als Gegenpol zu KI-Musik.',
    move: 'Bei Sport, Kampf und Energie: Gitarre statt Stock-Beat. Echte Instrumente, echte Räume.',
    skip: 'Wenn die Lizenz für den Sound nicht geklärt ist (siehe Sound-Recht).',
    principles: ['P14', 'P25'],
    platforms: SHORT,
    goals: ['reach', 'positioning'],
    keywords: ['musik', 'sound', 'rock', 'metal', 'gitarre', 'band', 'beat', 'audio', 'energie'],
    sources: [{ label: 'Epidemic Sound: Music trends 2026', url: 'https://www.epidemicsound.com/blog/music-trends-2026/', date: '2026' }],
    expires: '2027-03-31',
  },
  {
    id: 'mu-sound-rights',
    domain: 'musik',
    title: 'Sound-Recht: Business-Accounts dürfen weniger',
    insight:
      'Auf Instagram dürfen Business-Accounts nur kommerziell lizenzierte Musik nutzen, die meisten Trend-Songs fallen raus. Creator-Accounts haben die volle Bibliothek. Karussells mit Audio können im Reels-Feed auftauchen.',
    move: 'Eigenen Sound bauen: Stimme, Geräusch, Original-Audio. Bei Trend-Songs den Creator posten lassen.',
    skip: 'Wenn ihr ohnehin nur Original-Audio nutzt.',
    principles: ['P14', 'P18', 'P10'],
    platforms: ['Instagram Reels', 'Instagram'],
    goals: ['reach'],
    keywords: ['musik', 'song', 'sound', 'audio', 'lizenz', 'reels', 'instagram', 'business'],
    sources: [{ label: 'Instagram Trends October 2026 (NewEngen)', url: 'https://newengen.com/insights/instagram-trends/', date: '2026-10' }],
    expires: '2027-03-31',
  },

  // ───────────── GESUNDHEIT ─────────────
  {
    id: 'h-fitness-racing',
    domain: 'gesundheit',
    title: 'Fitness als Wettkampf-Event: Hyrox',
    insight:
      'Hyrox (gegründet 2017 in Hamburg) erwartet 2026 über 1,3 Mio. Teilnehmende in 85 Städten, rund 70 % sind Erstteilnehmende, fast ohne klassische Werbung. Geteilte Ergebnisse sind das Marketing, Puma ist Partner bis 2030. Pinterest: Hyrox-Suchen bei Männern +193 %, Padel-Events +47 %.',
    move: 'Ein standardisiertes, vergleichbares Format bauen, dessen Ergebnis man teilen will: Zeit, Rang, Foto im Ziel.',
    skip: 'Wenn es kein Ergebnis gibt, das stolz macht. Dann eher „Bewegung ist das neue Treffen“.',
    principles: ['P02', 'P07', 'P19'],
    platforms: ['Instagram', 'Strava', 'TikTok'],
    goals: ['community', 'reach'],
    keywords: ['sport', 'fitness', 'wettkampf', 'rennen', 'hyrox', 'padel', 'training', 'event', 'zeit', 'ergebnis', 'gym'],
    sources: [
      { label: 'European Business Magazine: Hyrox', url: 'https://europeanbusinessmagazine.com/weekend-read-hyrox-german-200-million-dollar-machine/', date: '2026-05-23' },
      { label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' },
    ],
    expires: '2027-06-30',
  },
  {
    id: 'h-drinking-less',
    domain: 'gesundheit',
    title: 'Weniger Alkohol, mehr Funktion',
    insight:
      'Datassential 2026 (USA): Knapp die Hälfte der Gen Z will weniger trinken. Funktionale Sodas kennen 66 %, 58 % sind interessiert. Tee wird zur neuen Happy Hour. Ein Grund ist auch der Preis: Über zwei Drittel finden Alkohol spürbar teurer.',
    move: 'Abende und Events ohne Alkohol als Hauptsache inszenieren, nicht als Ausnahme. Das alkoholfreie Getränk bekommt die Bühne.',
    skip: 'Achtung: US-Daten. Für Deutschland als Frühsignal lesen.',
    principles: ['P07', 'P24'],
    platforms: [],
    goals: ['positioning', 'conversion'],
    keywords: ['alkohol', 'alkoholfrei', 'bier', 'getränk', 'drink', 'bar', 'party', 'feier', 'gastro', 'event'],
    sources: [{ label: 'Datassential: Non-Alcoholic Beverage Trends 2026', url: 'https://datassential.com/resource/non-alcoholic-beverage-trends/', date: '2026' }],
    expires: '2027-06-30',
  },
  {
    id: 'h-mens-grooming',
    domain: 'gesundheit',
    title: 'Präzise Pflege für Männer',
    insight:
      'Pinterest-Daten zu Männern (Herbst 2026): Männer-Skincare +280 %, Rotlichtmasken +156 % im Jahresvergleich.',
    move: 'Pflege als Routine zeigen, nicht als Eitelkeit: vor dem Training, nach dem Kampf, vor dem Termin.',
    skip: 'Wenn die Zielgruppe keine Männer sind oder Pflege nichts mit dem Produkt zu tun hat.',
    principles: ['P22', 'P13'],
    platforms: ['TikTok', 'Instagram', 'Pinterest'],
    goals: ['reach', 'conversion'],
    keywords: ['männer', 'pflege', 'skincare', 'haut', 'grooming', 'routine', 'beauty', 'bart'],
    sources: [{ label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' }],
    expires: '2027-03-31',
  },

  // ───────────── LIFESTYLE ─────────────
  {
    id: 'l-analog-hosting',
    domain: 'lifestyle',
    title: 'Analog gastgeben, am Wochenende werkeln',
    insight:
      'Pinterest-Daten zu Männern (Herbst 2026): Plattenspieler-Setups +223 %, Charcuterie-Boards +390 %, Kaffeebar-Ecken +56 %, einfache Holzprojekte +316 %, Schnitzen für Anfänger +190 %, Wellness-Retreats +83 %, Roadtrip-Ideen +126 %.',
    move: 'Zuhause und Hände zeigen: Platte auflegen, Brett bauen, Gäste einladen. Der Abend als Format.',
    skip: 'Wenn es nur Kulisse ist und keiner wirklich etwas tut.',
    principles: ['P07', 'P25', 'P22'],
    platforms: ['Pinterest', 'Instagram', 'TikTok'],
    goals: ['community', 'reach'],
    keywords: ['zuhause', 'gastgeber', 'vinyl', 'platte', 'kaffee', 'holz', 'diy', 'werkstatt', 'männer', 'wochenende', 'roadtrip'],
    sources: [{ label: 'Social media updates October 2026 (Brandnation)', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', date: '2026-10-02' }],
    expires: '2027-03-31',
  },
  {
    id: 'l-offline-clubs',
    domain: 'lifestyle',
    title: 'Offline als Erlebnis',
    insight:
      'Offline Club ist in 19 Städten aktiv, der Digital-Detox-Anbieter Unplugged wuchs von wenigen Hütten 2020 auf über 50 im Jahr 2026. Junge Erwachsene nutzen Dumbphones als Zweitgerät. Laut Pew sehen 48 % der US-Teens die Wirkung von Social Media überwiegend negativ.',
    move: 'Ein Moment ohne Handy als Kern der Aktion, der Content entsteht davor und danach.',
    skip: 'Wenn das Angebot selbst ein Screen-Produkt ist. Dann nicht heucheln.',
    principles: ['P07', 'P21', 'P06'],
    platforms: [],
    goals: ['community', 'positioning'],
    keywords: ['offline', 'detox', 'handy', 'smartphone', 'pause', 'auszeit', 'retreat', 'analog', 'ruhe'],
    sources: [{ label: 'Fortune: Gen Z analog economy', url: 'https://fortune.com/2026/04/01/gen-z-analog-economy-5-billion-market-nostalgia', date: '2026-04-01' }],
    expires: '2027-06-30',
  },
];

// ───────────── RADAR-QUELLEN zum Nachlegen ─────────────

export type RadarSource = {
  name: string;
  url: string;
  domains: TrendDomain[];
  cadence: string;
  use: string;
};

export const RADAR_SOURCES: RadarSource[] = [
  { name: 'TikTok Creative Center', url: 'https://ads.tiktok.com/business/creativecenter', domains: ['kommunikation', 'musik'], cadence: 'laufend', use: 'Welche Sounds, Hashtags und Creator gerade steigen, nach Land filterbar.' },
  { name: 'Pinterest Trends', url: 'https://trends.pinterest.com', domains: ['lifestyle', 'design'], cadence: 'laufend', use: 'Suchkurven für Ästhetiken, Interiors, Beauty. Gut für Frühsignale.' },
  { name: 'Google Trends', url: 'https://trends.google.de', domains: ['kultur', 'marketing'], cadence: 'laufend', use: 'Ob ein Thema in Deutschland wirklich wächst oder nur in der eigenen Blase.' },
  { name: 'Know Your Meme', url: 'https://knowyourmeme.com', domains: ['kultur', 'kommunikation'], cadence: 'laufend', use: 'Woher ein Meme kommt, bevor eine Marke es anfasst.' },
  { name: 'Exploding Topics', url: 'https://explodingtopics.com', domains: ['marketing', 'lifestyle', 'gesundheit'], cadence: 'laufend', use: 'Themen, deren Suchvolumen gerade anzieht.' },
  { name: 'Are.na', url: 'https://www.are.na', domains: ['design', 'kultur'], cadence: 'laufend', use: 'Kuratierte Moodboards von Designer:innen. Nische statt Pinterest-Mainstream.' },
  { name: 'Garbage Day (Newsletter)', url: 'https://www.garbageday.email', domains: ['kultur', 'kommunikation'], cadence: 'mehrmals pro Woche', use: 'Internetkultur mit Haltung. Was hinter viralen Momenten steckt.' },
  { name: 'Embedded (Newsletter)', url: 'https://embedded.substack.com', domains: ['kultur', 'kommunikation'], cadence: 'wöchentlich', use: 'Creator-Ökonomie und Online-Kultur aus Nutzersicht.' },
  { name: 'Culture Study (Newsletter)', url: 'https://annehelen.substack.com', domains: ['kultur', 'lifestyle'], cadence: 'wöchentlich', use: 'Lange Analysen zu Arbeit, Alltag und Gesellschaft.' },
  { name: 'TikTok Next / What’s Next', url: 'https://ads.tiktok.com/business/library/TikTok_Next_2026_Trend_Report.pdf', domains: ['kommunikation', 'marketing'], cadence: 'jährlich (Januar)', use: 'Plattform-Sicht auf das kommende Jahr.' },
  { name: 'Pinterest Predicts', url: 'https://ppc.land/pinterest-unveils-21-consumer-trends-for-2026-advertising-campaigns/', domains: ['lifestyle', 'design'], cadence: 'jährlich (Dezember)', use: '21 Prognosen mit Suchdaten.' },
  { name: 'Reuters Digital News Report', url: 'https://reutersinstitute.politics.ox.ac.uk', domains: ['kommunikation'], cadence: 'jährlich (Juni)', use: 'Wie Menschen Nachrichten nutzen, mit Länderdaten für Deutschland (Hans-Bredow-Institut).' },
  { name: 'Edelman Trust Barometer', url: 'https://www.edelman.com/trust', domains: ['kommunikation', 'marketing'], cadence: 'jährlich (Januar)', use: 'Wem Menschen vertrauen und wem nicht.' },
  { name: 'ARD/ZDF-Medienstudie', url: 'https://onlinemarketing.de/cases/ard-zdf-medienstudie-2025', domains: ['kommunikation'], cadence: 'jährlich (Herbst)', use: 'Reichweiten in Deutschland nach Alter.' },
  { name: 'JIM-Studie (mpfs)', url: 'https://mpfs.de', domains: ['kommunikation', 'kultur'], cadence: 'jährlich (November)', use: 'Medienalltag der 12- bis 19-Jährigen in Deutschland.' },
  { name: 'Global Wellness Summit Trends', url: 'https://globalwellnessinstitute.org', domains: ['gesundheit', 'lifestyle'], cadence: 'jährlich (Januar)', use: 'Zehn Wellness-Trends mit Branchenhintergrund.' },
  { name: 'ACSM Fitness Trends', url: 'https://acsm.org/top-fitness-trends-2026', domains: ['gesundheit'], cadence: 'jährlich (Oktober)', use: 'Fitness-Prognosen aus Fachleute-Befragung.' },
  { name: 'Luminate Music Reports', url: 'https://luminatedata.com', domains: ['musik'], cadence: 'halbjährlich (Juli, Januar)', use: 'Streaming, Genres, Fandom mit harten Zahlen.' },
  { name: 'IFPI Global Music Report', url: 'https://musicbusinessworldwide.com/10-quick-and-crucial-takeaways-from-ifpis-global-music-report-2026', domains: ['musik'], cadence: 'jährlich (März)', use: 'Weltweite Musikumsätze nach Format und Region.' },
  { name: 'Euromonitor / Mintel Consumer Trends', url: 'https://euromonitor.com', domains: ['kultur', 'marketing'], cadence: 'jährlich (Oktober/November)', use: 'Große Konsumtrends, gut als Rahmen.' },
  { name: 'Canva / Adobe Design Trends', url: 'https://ecommercenews.com.au/story/canva-backs-imperfect-by-design-trend-in-2026-report', domains: ['design'], cadence: 'jährlich (Dezember/Januar)', use: 'Gestaltungstrends mit Suchdaten aus den Tools.' },
  { name: 'Strava Year in Sport', url: 'https://www.webull.com/news/13961203642123264', domains: ['gesundheit', 'lifestyle'], cadence: 'jährlich (Dezember)', use: 'Wie Menschen sich bewegen, mit wem und warum.' },
  { name: 'Google Jahresrückblick', url: 'https://blog.google/intl/de-de/produkte/suchen-entdecken/google-jahresrueckblick-2025/', domains: ['kultur'], cadence: 'jährlich (Dezember)', use: 'Was Deutschland wirklich gesucht hat.' },
  // Nachtrag Oktober 2026: monatliche und wöchentliche Quellen
  { name: 'Brandnation: Social media updates', url: 'https://brandnation.co.uk/news-insights/the-social-media-updates-to-know-in-october-2026', domains: ['kommunikation', 'marketing'], cadence: 'monatlich', use: 'Plattform-Updates des Monats mit Einordnung (Meta, LinkedIn, YouTube, Pinterest, Reddit).' },
  { name: 'NewEngen: Instagram Trends', url: 'https://newengen.com/insights/instagram-trends/', domains: ['kommunikation', 'musik'], cadence: 'wöchentlich', use: 'Aktuelle Reels-Formate mit Audio und Lizenz-Hinweis für Business-Accounts.' },
  { name: 'NewEngen: Influencer Marketing Trends', url: 'https://newengen.com/insights/influencer-marketing-trends-september/', domains: ['marketing'], cadence: 'monatlich', use: 'Creator-Ökonomie mit Daten und Fallbeispielen.' },
  { name: 'Pepper: TikTok & Instagram Trends', url: 'https://www.pepperagency.com/blog/tiktok-instagram-trends-for-october-2026-and-how-brands-can-actually-use-them', domains: ['kommunikation', 'kultur'], cadence: 'monatlich', use: 'Formate des Monats und wie Marken sie konkret nutzen.' },
  { name: 'Ramdam: TikTok Trends', url: 'https://www.ramd.am/blog/trends-tiktok', domains: ['kommunikation', 'kultur'], cadence: 'laufend', use: 'Neue TikTok-Formate mit Sound und Herkunft.' },
  { name: 'NapoleonCat: Trending Memes', url: 'https://napoleoncat.com/blog/trending-memes/', domains: ['kultur'], cadence: 'monatlich', use: 'Memes des Monats mit Ursprung und Mechanik.' },
  { name: 'GPO: State of Search & AI', url: 'https://gpo.com/blog/september-2026-state-of-search-ai/', domains: ['marketing', 'kommunikation'], cadence: 'monatlich', use: 'Was sich bei KI-Suche, ChatGPT und Google gerade verschiebt.' },
  { name: 'Trendhunter: Branding Trends', url: 'https://www.trendhunter.com/slideshow/september-2026-branding', domains: ['marketing', 'design'], cadence: 'monatlich', use: 'Viele Markenbeispiele auf einen Blick, gut zum Mustererkennen.' },
  { name: 'Creative Bloq: Design Trends', url: 'https://www.creativebloq.com/design/graphic-design/texture-warmth-and-tactile-rebellion-the-big-graphic-design-trends-for-2026', domains: ['design'], cadence: 'laufend', use: 'Grafik- und Branding-Trends mit Studio-Beispielen.' },
  { name: 'Epidemic Sound Blog', url: 'https://www.epidemicsound.com/blog/music-trends-2026/', domains: ['musik'], cadence: 'laufend', use: 'Musiktrends aus Creator-Sicht, mit lizenzfreien Beispielen.' },
  { name: 'Deloitte Media Consumer Trends (DE)', url: 'https://www.presseportal.de/pm/60247/6243676', domains: ['kommunikation', 'kultur'], cadence: 'jährlich', use: 'Mediennutzung in Deutschland: Social, Streaming, KI, Radio, Podcast.' },
  { name: 'Trendstudie Jugend in Deutschland', url: 'https://www.staatklar.org/artikel/trendstudie-jugend-in-deutschland-2026.html', domains: ['kultur', 'gesundheit'], cadence: 'halbjährlich', use: 'Stimmung, Sorgen und Werte der 14- bis 29-Jährigen in Deutschland.' },
  { name: 'OMR (Festival und Reviews)', url: 'https://omr.com', domains: ['marketing'], cadence: 'jährlich (Mai) und laufend', use: 'Was die DACH-Digitalbranche gerade umtreibt.' },
];

// ───────────── Matching ─────────────

export function activeSignals(now: Date = new Date()): TrendSignal[] {
  const today = now.toISOString().slice(0, 10);
  return TREND_SIGNALS.filter((s) => s.expires >= today);
}

export type TrendMatchInput = {
  text: string;
  goal?: TrendGoal | '';
  platforms?: string[];
  principles?: string[];
};

export type TrendMatch = { signal: TrendSignal; score: number; reasons: string[] };

export function matchTrends(input: TrendMatchInput, max = 4, now: Date = new Date()): TrendMatch[] {
  const text = input.text.toLowerCase();
  const matches: TrendMatch[] = [];

  for (const s of activeSignals(now)) {
    let score = 0;
    const reasons: string[] = [];
    // kurze Stichworte (ki, ai, dm, ton) nur als ganzes Wort, sonst trifft „ki“ auch „Kinder“
    const hits = s.keywords.filter((k) =>
      k.length <= 3 ? new RegExp(`(^|[^a-zäöüß0-9])${k}([^a-zäöüß0-9]|$)`).test(text) : text.includes(k),
    );
    if (hits.length) {
      score += Math.min(hits.length, 3) * 2;
      reasons.push(`Stichwort ${hits.slice(0, 2).map((h) => `„${h}“`).join(', ')}`);
    }
    if (input.goal && s.goals.includes(input.goal)) {
      score += 1.5;
      reasons.push('passt zum Ziel');
    }
    const plat = (input.platforms ?? []).filter((p) => s.platforms.includes(p));
    if (plat.length) {
      score += 1.5;
      reasons.push(plat[0]);
    }
    const pr = (input.principles ?? []).filter((p) => s.principles.includes(p));
    if (pr.length) {
      score += pr.length;
      reasons.push(pr.join(', '));
    }
    // Ohne Stichwort-Treffer nur, wenn Ziel UND Plattform passen
    if (!hits.length && !(input.goal && plat.length)) continue;
    if (score >= 3) matches.push({ signal: s, score, reasons });
  }

  matches.sort((a, b) => b.score - a.score);
  // höchstens 2 pro Feld, damit es breit bleibt
  const perDomain: Record<string, number> = {};
  const out: TrendMatch[] = [];
  for (const m of matches) {
    const d = m.signal.domain;
    if ((perDomain[d] ?? 0) >= 2) continue;
    perDomain[d] = (perDomain[d] ?? 0) + 1;
    out.push(m);
    if (out.length === max) break;
  }
  return out;
}

export function formatSourceDate(d: string): string {
  const [y, m, day] = d.split('-');
  if (day) return `${day}.${m}.${y}`;
  if (m) return `${m}/${y}`;
  return y;
}
