import type { Principle } from './types';
import { localized } from './i18n';
import { PRINCIPLES_EN } from './playbook.en';

const PRINCIPLES_DE: Principle[] = [
  {
    id: 'P01',
    name: 'Smartly Unpolished',
    source: 'Tiah Slattery, Dept',
    rule:
      'Unpolished. Not unmade. Je polierter, desto weniger Vertrauen. Aber roh heißt nicht hingeworfen. Sichtbar wird der Aufwand, nicht die Glätte: Handschrift, Prozess, echte Orte, echte Menschen. Zwischen lauter KI-Bildern ist erkennbare Arbeit der Beweis, dass jemand dahintersteht.',
    leosCheck:
      'Sieht das aus wie ein Ad? Dann ist es falsch. Sieht es hingeworfen aus? Auch falsch. Man muss sehen, dass hier jemand Zeit reingesteckt hat.',
    triggers: ['lo-fi', 'rough', 'roh', 'hand', 'ehrlich', 'imperfekt', 'unpoliert', 'real', 'aufwand', 'handgemacht'],
    antiTriggers: ['hochglanz', 'studio', 'render', 'cgi', 'corporate', 'ki-bild', 'generiert'],
    signal2027: {
      text: 'Nur jede:r Dritte sieht klar KI-gemachtes Marketing positiv.',
      source: 'DoubleVerify (via The Trend File 2027)',
    },
  },
  {
    id: 'P02',
    name: 'Post-Post Thinking',
    source: 'Alexandra Mathieu, Open Influence',
    rule:
      'Der Post ist nur der Teaser. Was zählt, passiert danach: Kommentare, Stitches, DMs, Screenshots, Remixe. Und seit 2027 auch die KI-Abfrage: Wer euch gesehen hat, fragt oft ChatGPT oder Gemini, bevor er kauft. Die KI verwandelt vor allem Bekanntheit, die schon da ist. Jede Idee wird darauf gebaut, was nach dem Post passiert.',
    leosCheck:
      'Was soll jemand mit diesem Content tun? Screenshotten, weiterleiten, antworten? „Liken“ reicht nicht. Und was antwortet eine KI, wenn jemand danach nach euch fragt?',
    triggers: ['comment', 'kommentar', 'remix', 'screenshot', 'dm', 'reaktion', 'duet', 'stitch', 'weiterleit', 'chatgpt', 'weiterempfehl'],
    antiTriggers: ['reichweite', 'impressions', 'awareness'],
    signal2027: {
      text: 'Bei 37 % der Erstkäufe war ein KI-Assistent beteiligt. 73 % dieser Käufe gingen an Marken, die man schon kannte (USA/UK).',
      source: 'Attest 2027 Consumer Trends (via The Trend File 2027)',
    },
  },
  {
    id: 'P03',
    name: 'Single-Frame Ambush',
    source: 'Emily Charlton-Smith, Anything is Possible',
    rule:
      'Das erste Frame ist die ganze Geschichte. Kein Warm-up, kein Logo-Intro. Bold Typography, harte Crops, unerwartete Farben. Und der erste Satz ist eine Aussage, keine Frage: „Dieses Brot braucht 48 Stunden“ schlägt „Hast du dich je gefragt …?“. Wenn Frame 1 nicht wirkt, wirkt nichts.',
    leosCheck:
      'Was passiert in Frame 1, was sagt Satz 1? Wenn die Antwort „Intro, Logo, Musik“ oder eine Frage ist: zurück zum Start.',
    triggers: ['hook', 'frame 1', 'erstes bild', 'pattern interrupt', 'bold', 'crop', 'typografie', 'thumbnail', 'aussage', 'statement'],
    antiTriggers: ['intro', 'logo-stinger', 'aufwärm', 'einleitung', 'hast du dich'],
    signal2027: {
      text: '1,2 Mio. Markenposts: Eine klare Aussage als Einstieg schneidet auf allen sieben Netzwerken besser ab, die Frage auf allen sieben schlechter.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P04',
    name: 'Subculture over Broadcast',
    source: 'Nadine Müller, Jung von Matt',
    rule:
      'Der erfolgreichste Post ist nicht der mit den meisten Likes. Es ist der, der in den Group-Chat geschickt wird. Marken müssen aufhören, wie Broadcaster zu denken, und anfangen, wie Subkulturen zu fühlen. Content muss als Social-Rohmaterial funktionieren — mit Lücken, die zum Remixen einladen.',
    leosCheck:
      'Würde dieser Content in einen Telegram-Kanal oder Discord landen? Oder bleibt er brav auf dem Feed?',
    triggers: ['szene', 'subkultur', 'community', 'insider', 'group chat', 'discord', 'nische', 'fanbase'],
    antiTriggers: ['mainstream', 'jeder', 'breite zielgruppe', 'massenmarkt', 'tv'],
    signal2027: {
      text: '52 % der Gen Z und Millennials bevorzugen Events, die sich „unter dem Radar“ anfühlen.',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P05',
    name: 'Listen First — Elevate What\'s Already There',
    source: 'Judith Tulkens, Adam&EveDDB London',
    rule:
      'Nicht in Kultur eintauchen — die Kultur heben, die in der eigenen Community bereits existiert. Was steht in den Comments? Was sind die DMs? Was ist die unhinged Wahrheit der Zielgruppe? Brief das in dein Creative Team.',
    leosCheck:
      'Wurde die Community gefragt, bevor diese Idee entstanden ist? Wenn nicht: erst hören, dann machen.',
    triggers: ['comments', 'dm', 'community', 'fragen', 'umfrage', 'feedback', 'zuhören', 'voice of'],
    antiTriggers: ['top-down', 'wir glauben', 'aus dem bauch', 'pitch'],
    signal2027: {
      text: '72 % vertrauen Empfehlungen von Freunden und Familie, Werbung nur 46 %.',
      source: 'Euromonitor Top Global Consumer Trends 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P06',
    name: 'BTS-First — Drama vor dem Reveal',
    source: 'Kat Lee, Kettle',
    rule:
      'Poste das Behind-the-Scenes ZUERST — komplett aus dem Kontext gerissen. Das verwackelte Mood Board. Den Team-Meltdown. Den cursed Draft. Lass Menschen emotional investiert werden, bevor du zeigst, worum es geht. Spannung ist das unterschätzte Content-Tool.',
    leosCheck:
      'Wo ist die Spannung? Wer fiebert beim Ergebnis mit? Wenn niemand auf den nächsten Post wartet, fehlt ein Drama-Loop.',
    triggers: ['bts', 'behind', 'making-of', 'prozess', 'rohmaterial', 'cliffhanger', 'spannung', 'teaser', 'draft'],
    antiTriggers: ['fertig', 'reveal-only', 'launch-day-only'],
    signal2027: {
      text: 'Transparenz wird zum Kaufgrund: Balenciaga zeigte die Entstehung seiner Kampagne über einen Burner-Account.',
      source: 'IA Retail Futures 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P07',
    name: 'Fan Fuel — Real Life First',
    source: 'James Kirkham, Iconic',
    rule:
      'Das Einzige, was wirklich funktioniert: mit etwas außerhalb von Social anfangen. Ein echter Moment, ein echter Ort, echte Menschen. So viszeral, freudig oder weird, dass jemand es filmen MUSS. Social Media ist nur das letzte Echo — nie der Startschuss.',
    leosCheck:
      'Würde dieser Moment auch ohne Kamera existieren? Wenn nein: Es ist kein Moment. Es ist eine Produktion.',
    triggers: ['live', 'event', 'irl', 'echt', 'real', 'ort', 'moment', 'pop-up', 'spontan'],
    antiTriggers: ['inszeniert', 'studio', 'gestellt', 'für die kamera'],
    signal2027: {
      text: '69 % entdecken Erlebnisse über ihr persönliches Netzwerk, nicht über Werbung (Eventbrite-Daten).',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P08',
    name: 'TV-Format Logic for Social',
    source: 'Richard Boon, Oh Six',
    rule:
      'Die Zutaten eines guten TV-Formats funktionieren auch auf Social. Serials, Teaser, episodischer Content. Bring Humor rein, Jeopardy, eine Reise, Coming-Up-Elemente, Recaps, Easter Eggs. Verpack TV-Watchability in plattform-native Logik.',
    leosCheck:
      'Hat dieses Format eine nächste Folge? Hat es einen Reason-to-Return? Wenn nicht, ist es ein Post — kein Format.',
    triggers: ['serie', 'serial', 'episode', 'folge', 'staffel', 'recap', 'cliffhanger', 'format'],
    antiTriggers: ['einzelpost', 'one-off', 'einmalig'],
    signal2027: {
      text: '29 % der Video-Podcast-Zuschauer:innen kaufen nach einer Anzeige, bei reinen Audio-Hörer:innen 25 %.',
      source: 'Nielsen Annual Marketing Report 2026 (via The Trend File 2027)',
    },
  },
  {
    id: 'P09',
    name: 'Co-Creation — Audience as Co-Conspirator',
    source: 'Daniel Hirsch, Left Field Labs',
    rule:
      'Serialisierter Content, bei dem die Community entscheidet, was als Nächstes passiert. Behandle Content wie einen Live-Group-Chat, nicht wie ein fertiges Produkt. Marken werden vom Broadcaster zum Co-Conspirator. Was nicht repliziert werden kann, gewinnt.',
    leosCheck:
      'Welche Entscheidung übergibst du der Community? Wenn keine, machst du immer noch Broadcast.',
    triggers: ['voting', 'abstimm', 'co-creation', 'choose', 'community decides', 'duet', 'remix', 'einreichen'],
    antiTriggers: ['final', 'abgeschlossen', 'wir entscheiden'],
    signal2027: {
      text: '43 % wollen mit Marken an neuen Produkten mitwirken.',
      source: 'Euromonitor Top Global Consumer Trends 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P10',
    name: 'Native Beats Adapted',
    source: 'LEO Playbook',
    rule:
      'Plattformlogik schlägt Content-Recycling. Derselbe Schnitt auf TikTok, Instagram und LinkedIn ist eine Beleidigung für alle drei. Jede Plattform hat ihre eigene Grammatik — Tempo, Format, Tonalität. Wer adaptiert, verliert.',
    leosCheck:
      'Würde dieser Post in genau dieser Form auch auf einer anderen Plattform funktionieren? Wenn ja, ist er auf keiner zu Hause.',
    triggers: ['tiktok-native', 'plattform', 'vertikal', 'native', 'plattformgerecht', 'platform-first'],
    antiTriggers: ['cross-post', 'überall gleich', 'einmal produzieren', 'adaptiert', 'recycelt'],
    signal2027: {
      text: 'Dieselbe Entscheidung hilft auf einem Netzwerk und schadet auf einem anderen: Video schlägt Bild auf Instagram um 20 %, auf X verliert es 36 %.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P11',
    name: 'Comment-Section as the Real Show',
    source: 'LEO Playbook',
    rule:
      'Die Bühne sind die Reaktionen, nicht der Post. Ein guter Post öffnet eine Tür — die Comments sind das Wohnzimmer dahinter. Schreib so, dass die spannendste Antwort von jemand anderem kommt.',
    leosCheck:
      'Hast du Lücken gelassen, in die jemand reinspringen muss? Oder hast du alles selbst beantwortet?',
    triggers: ['kommentar', 'reaktion', 'antwort', 'frage gestellt', 'streit', 'these', 'lücke'],
    antiTriggers: ['rundum-versorgt', 'alles erklärt', 'keine fragen offen'],
    signal2027: {
      text: 'Eine Frage in der Caption bringt keine Antworten, eher weniger Interaktion. Gespräche entstehen über Inhalte, nicht über Aufforderungen.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P12',
    name: 'Niche Down to Scale Up',
    source: 'LEO Playbook',
    rule:
      'Kleine, scharfe Zielgruppen schlagen breite. Wer für alle da ist, ist für niemanden da. Eine Nische ist kein Limit — sie ist die einzige Möglichkeit, von außen sichtbar zu werden. Der Rest folgt von selbst.',
    leosCheck:
      'Wer würde dich verteidigen, wenn jemand dich angreift? Wenn das niemand wäre, ist die Nische nicht scharf genug.',
    triggers: ['nische', 'niche', 'spezifisch', 'kerngruppe', 'fanbase', 'spezial', 'eng'],
    antiTriggers: ['für jeden', 'breit', 'massenmarkt', 'alle'],
    signal2027: {
      text: 'Popularität und Superfan-Anteil hängen nicht zusammen: 38 % der BTS-Hörer:innen im Panel sind Superfans, bei Rihanna 2,1 %.',
      source: 'Social Discovery: The Culture Match 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P13',
    name: 'Frequency over Polish',
    source: 'LEO Playbook',
    rule:
      'Konsistenz schlägt Perfektion. Drei mittelmäßige Posts pro Woche schlagen einen brillanten pro Monat. Der Algorithmus belohnt Atem, nicht Atemnot. Mach es schneller, häufiger, roher.',
    leosCheck:
      'Kannst du dieses Format dreimal pro Woche machen, ohne dass dein Team durchdreht? Wenn nein, ist es kein Format — es ist ein Stunt.',
    triggers: ['konsistent', 'regelmäßig', 'wöchentlich', 'täglich', 'frequenz', 'rhythmus', 'serie'],
    antiTriggers: ['quartal', 'kampagne', 'einmalig', 'jährlich'],
    signal2027: {
      text: '77 % der Marketer sagen, Authentizität schlägt Produktionswert (HubSpot 2026).',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P14',
    name: 'Sound-On Strategy',
    source: 'LEO Playbook',
    rule:
      'Audio ist das unterschätzte Unterscheidungsmerkmal. Eine eigene Stimme, ein eigener Sound, ein eigener Rhythmus — das macht dich erkennbar im Daumen-Strom. Der Ton ist die schnellste Wiedererkennung.',
    leosCheck:
      'Erkennt dich jemand, wenn nur die ersten zwei Sekunden Audio laufen? Wenn nicht, klingst du wie alle anderen.',
    triggers: ['audio', 'sound', 'voice-over', 'musik', 'jingle', 'ton', 'sonisch', 'asmr'],
    antiTriggers: ['ohne ton', 'mute', 'stumm', 'untertitel-only'],
    signal2027: {
      text: 'Videos, in denen jemand spricht: bis zu +18 % Interaktion. Nur Musik ohne Stimme: 10 bis 15 % schwächer.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P15',
    name: 'Pattern Interrupt',
    source: 'LEO Playbook',
    rule:
      'Brüche in Format, Farbe, Tempo. Wenn alle in deiner Kategorie aussehen wie A, mach B. Der Algorithmus liebt Konsistenz, der Mensch liebt Überraschung. Beide musst du bedienen.',
    leosCheck:
      'Wo überrascht dieser Post jemanden, der deine Kategorie schon kennt? Wenn nirgends, scrollt er weiter.',
    triggers: ['unerwartet', 'bruch', 'überraschend', 'gegenläufig', 'kontrast', 'twist', 'anders'],
    antiTriggers: ['standard', 'wie immer', 'üblich', 'safe'],
    signal2027: {
      text: '79 % sagen, Events sollten sich spontan oder unvorhersehbar anfühlen (Eventbrite-Daten).',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P16',
    name: 'Insider Codes',
    source: 'LEO Playbook',
    rule:
      'Zeichen, die nur Eingeweihte verstehen. Ein Inside-Joke, ein wiederkehrendes Symbol, ein Wort, das deine Community geprägt hat. Der Code ist Eintrittskarte und Belohnung zugleich.',
    leosCheck:
      'Gibt es etwas in deinem Content, das nur ein Stamm-Follower versteht? Wenn nein, hast du keine Stammgäste — nur Passanten.',
    triggers: ['inside-joke', 'code', 'symbol', 'wiederkehrend', 'easter egg', 'running gag', 'meme'],
    antiTriggers: ['erklärbar für alle', 'selbsterklärend', 'tutorial'],
    signal2027: {
      text: '58 % wollen Erlebnisse, die es nur einmal gibt. 36 % jagen gern versteckte Orte.',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P17',
    name: 'Vertical-First',
    source: 'LEO Playbook',
    rule:
      'Mobile als Default, nicht als Anpassung. 9:16 ist die Bühne, alles andere Resteverwertung. Hochkant heißt aber nicht kurz: Videos von ein bis drei Minuten mit Stimme schlagen 15-Sekunden-Loops. Lang genug, um etwas zu sagen.',
    leosCheck:
      'Sieht der Hero-Frame auf dem Handy sauber aus? Und ist das Video lang genug, um wirklich etwas zu sagen, oder nur ein Loop?',
    triggers: ['vertikal', '9:16', 'mobile', 'reels', 'shorts', 'tiktok', 'stories'],
    antiTriggers: ['querformat', '16:9', 'landscape', 'desktop-first'],
    signal2027: {
      text: '1 bis 3 Minuten: +36 % Interaktion auf YouTube, +14 % auf Instagram, +10 % auf TikTok. Unter 15 Sekunden schneiden Videos auf allen drei schwächer ab.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P18',
    name: 'Creator Collab > Brand Solo',
    source: 'LEO Playbook',
    rule:
      'Communities haben eigene Stimmen. Wer als Marke allein spricht, klingt wie eine Pressemitteilung. Wer mit Creators arbeitet, leiht sich Vertrauen, das er sich selbst nicht erarbeiten kann. Aber: keine Werbedeals — echte Co-Authorship.',
    leosCheck:
      'Wer aus der Szene würde diesen Post ohne Geld machen? Wenn niemand, dann fehlt dem Content die kulturelle Stimme.',
    triggers: ['creator', 'kollab', 'collaboration', 'partner', 'feat.', 'guest', 'einladen'],
    antiTriggers: ['solo', 'allein', 'nur die marke', 'in-house only'],
    signal2027: {
      text: '62 % der Marketer erwarten steigende Creator-Budgets, 18 % sogar um mehr als die Hälfte.',
      source: 'Nielsen Annual Marketing Report 2026 (via The Trend File 2027)',
    },
  },
  {
    id: 'P19',
    name: 'Memetic Surfaces',
    source: 'LEO Playbook',
    rule:
      'Content als Vorlage zum Remixen. Wenn dein Post nicht repliziert, parodiert oder weiterverarbeitet werden kann, ist er eine Sackgasse. Memes sind keine Witze — sie sind Container, die andere füllen.',
    leosCheck:
      'Kann jemand mit Smartphone und drei Minuten Zeit aus diesem Post seinen eigenen machen? Wenn nein, fehlt die Vorlage.',
    triggers: ['template', 'meme', 'remix', 'vorlage', 'format', 'replizier', 'duet', 'stitch', 'capcut'],
    antiTriggers: ['einmalig', 'nur original', 'nicht kopierbar', 'geschlossen'],
  },
  {
    id: 'P20',
    name: 'Story Arc Across Posts',
    source: 'LEO Playbook',
    rule:
      'Narrative über mehrere Beiträge. Ein Post ist ein Satz, ein Feed ist ein Buch. Plan die Bögen — Setup, Konflikt, Auflösung — über Wochen. Wer nur in Einzelposts denkt, baut keine Welt.',
    leosCheck:
      'Worum ging es vor zwei Wochen, und wie hängt es mit heute zusammen? Wenn gar nicht: Dein Feed ist eine Schublade, kein Roman.',
    triggers: ['arc', 'narrativ', 'story', 'kapitel', 'fortsetzung', 'callback', 'aufbau'],
    antiTriggers: ['einzelpost', 'isoliert', 'one-off'],
  },
  {
    id: 'P21',
    name: 'Anti-Algorithm Moves',
    source: 'LEO Playbook',
    rule:
      'Bewusst gegen die Plattform spielen. Lange Texte auf TikTok. Schweigen auf X. Statische Bilder im Reels-Feed. Was der Algorithmus nicht erwartet, sticht heraus — wenn der Inhalt stark genug ist, das Risiko zu tragen.',
    leosCheck:
      'Was ist der unintuitive Move auf dieser Plattform — und hast du den Mumm, ihn zu machen?',
    triggers: ['anti', 'gegen den strom', 'unerwartet', 'nicht trend', 'still', 'langsam', 'gegenläufig'],
    antiTriggers: ['trend reiten', 'algorithmus optimieren', 'best practice'],
    signal2027: {
      text: '72 % der Social-Media-Nutzer:innen fühlen sich von der Menge an Content überfordert.',
      source: 'IA Retail Futures 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P22',
    name: 'First-Person Camera',
    source: 'LEO Playbook',
    rule:
      'Ego-Perspektive für Nähe. Die Kamera ist keine Zuschauerin — sie ist Mitläuferin. POV-Shots, Selfie-Mode, Hand im Bild — alles, was die Distanz zwischen Zuschauer und Geschehen kollabieren lässt.',
    leosCheck:
      'Sitzt der Zuschauer neben mir oder schaut er aus zehn Metern Entfernung zu? Wenn Letzteres, fehlt die Nähe.',
    triggers: ['pov', 'selfie', 'first person', 'ego', 'mitläufer', 'aus meiner sicht', 'hand'],
    antiTriggers: ['totale', 'wide shot', 'beobachter', 'distanz'],
    signal2027: {
      text: 'Eine Person, die in die Kamera spricht: +9 % auf YouTube und TikTok. Ein Gesicht im Bild allein bringt nur 1 bis 5 %.',
      source: 'Vista Social 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P23',
    name: 'Receipts and Proof',
    source: 'LEO Playbook',
    rule:
      'Echte Belege, echte Screenshots. Zahlen, DMs, Lieferscheine, Whiteboards, schmutzige Werkbänke. Beweis schlägt Behauptung. In einer Welt voller Fakes ist der unerwartet detailreiche Beleg die schärfste Waffe.',
    leosCheck:
      'Was ist der Beweis, dass das, was du sagst, stimmt? Wenn keiner da ist: Es ist Marketing, nicht Story.',
    triggers: ['beleg', 'screenshot', 'beweis', 'zahlen', 'metriken', 'rohdaten', 'whiteboard', 'echt'],
    antiTriggers: ['behauptung', 'wir sagen', 'angeblich', 'rendering'],
    signal2027: {
      text: '75 % prüfen KI-Ergebnisse nach, weil sie ihnen nicht trauen.',
      source: 'Nielsen Annual Marketing Report 2026 (via The Trend File 2027)',
    },
  },
  {
    id: 'P24',
    name: 'Polarization Tax: Widerspruch halten',
    source: 'LEO Playbook',
    rule:
      'Bewusst Position beziehen, aber nicht als Lagerwahl. Spannung bleibt: Wer allen gefällt, bewegt niemanden. Eine starke Position hält aber auch den Widerspruch aus, mit „Ja, und“ statt „Pick a side“. Wer nur Lager bedient, landet beim Rage Bait.',
    leosCheck:
      'Wo ist die Reibung? Und hält eure Position eine ehrliche Gegenfrage aus, ohne einzuknicken oder lauter zu werden?',
    triggers: ['these', 'position', 'meinung', 'standpunkt', 'unbeliebt', 'kontrovers', 'mut', 'widerspruch', 'spannung', 'reibung'],
    antiTriggers: ['neutral', 'für jeden okay', 'safe', 'unverbindlich', 'inoffensive', 'rage bait', 'empörung'],
    signal2027: {
      text: '„Fierce Nuances“: Haltung mit Zwischentönen statt Lagerdenken.',
      source: 'Nextatlas Future in Sight 2027 (via The Trend File 2027)',
    },
  },
  {
    id: 'P25',
    name: 'The Texture of Real',
    source: 'LEO Playbook',
    rule:
      'Körnig, schief, lebendig. Im Zeitalter perfekter AI-Bilder sind menschliche Imperfektionen die neue Luxusware. Die Schramme, der Schweißfleck, das versehentliche Lachen — das ist die Textur, die niemand fälschen kann.',
    leosCheck:
      'Was an diesem Inhalt könnte eine Maschine nie hinbekommen? Wenn nichts: Er hat keinen Anker im Echten.',
    triggers: ['körnig', 'analog', 'film', 'rauschen', 'schramme', 'schweiß', 'lachen', 'schief', 'imperfekt'],
    antiTriggers: ['ai-render', 'glatt', 'makellos', 'cgi', 'studio-clean'],
    signal2027: {
      text: '55 % der Gen Z wünschen sich Erlebnisse mit Geruch, Klang und Interaktion.',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },
  // ───── Neu im Playbook 2027 (ersetzen im Board P26, P29, P32) ─────
  {
    id: 'P33',
    name: 'Listen Below the Feed',
    source: 'LEO Playbook 2027',
    rule:
      'Die ehrlichsten Gespräche laufen nicht mehr im Feed. Newsletter, Podcasts, Gruppenchats, Foren, kleine Communities. Wer nur die Kommentare unter den eigenen Posts liest, hört die Hälfte. Zuhören heißt 2027: dort hingehen, wo kein Algorithmus zuschaut.',
    leosCheck:
      'Wo reden eure Leute, wenn kein Algorithmus zuschaut? Warst du da schon, und was hast du gehört?',
    triggers: ['newsletter', 'podcast', 'whatsapp', 'discord', 'gruppenchat', 'forum', 'reddit', 'substack', 'telegram'],
    antiTriggers: ['nur feed', 'algorithmus-hack'],
    signal2027: {
      text: '50 % finden ihre Feeds zunehmend irrelevant. 32 % folgen Creatorn direkt über Newsletter oder Podcast, 27 % in kleineren Communities.',
      source: 'Accenture Life Trends 2027 (via The Trend File 2027)',
    },
  },

  {
    id: 'P34',
    name: 'Presence Beats Capture',
    source: 'LEO Playbook 2027',
    rule:
      'Viral und präsent sind nicht mehr derselbe Brief. Plane Momente, in denen niemand filmen muss, und halte sie trotzdem fest: eine Person mit Kamera statt hundert Handys. Der Content kommt danach, und alle wollen ihn sehen, weil sie dabei waren.',
    leosCheck:
      'Was erleben die Leute, wenn das Handy in der Tasche bleibt? Und wer hält es trotzdem fest?',
    triggers: ['handyfrei', 'phone-free', 'präsenz', 'vor ort', 'live', 'konzert', 'offline', 'zusammen erleben'],
    antiTriggers: ['instagrammable', 'selfie-wall', 'fotobox'],
    signal2027: {
      text: 'Handyfreie Events sind weltweit um 567 % gewachsen (Eventbrite-Daten).',
      source: 'SENSE Human Rebellion 2027 (via The Trend File 2027)',
    },
  },

  {
    id: 'P35',
    name: 'Say How Much Is AI',
    source: 'LEO Playbook 2027',
    rule:
      'Sagt, wie viel KI drinsteckt: ganz, teilweise oder gar nicht. Wer es offenlegt, gewinnt Vertrauen. Wer es versteckt, verliert es beim ersten Kommentar. Gilt für Bild, Text, Stimme und Musik.',
    leosCheck:
      'Wenn jemand fragt „Ist das KI?“, was antwortet ihr? Steht die Antwort schon im Post?',
    triggers: ['chatgpt', 'midjourney', 'generiert', 'künstliche intelligenz', 'ki-bild', 'ki-video', 'ki-text', 'kennzeichn', 'transparenz'],
    antiTriggers: ['heimlich', 'verstecken', 'niemand merkt'],
    signal2027: {
      text: '82 % in Großbritannien und 80 % in den USA wollen KI-Inhalte gekennzeichnet sehen. Nextatlas nennt das „Honest Ratios“.',
      source: 'Foresight Factory Control Shift 2027 · Nextatlas Future in Sight 2027 (via The Trend File 2027)',
    },
  },
];

// Englische Fassung als Getter darüber; Stichworte beider Sprachen werden immer gematcht
export const PRINCIPLES: Principle[] = PRINCIPLES_DE.map((p) => {
  const en = PRINCIPLES_EN[p.id];
  const base: Principle = {
    ...p,
    triggers: [...p.triggers, ...(en?.triggersEn ?? [])],
    antiTriggers: [...p.antiTriggers, ...(en?.antiTriggersEn ?? [])],
    signal2027: p.signal2027 && localized(p.signal2027, en?.signal2027 ? { text: en.signal2027 } : undefined),
  };
  return localized(base, en ? { name: en.name, rule: en.rule, leosCheck: en.leosCheck } : undefined);
});

export const PRINCIPLES_BY_ID: Record<string, Principle> = Object.fromEntries(
  PRINCIPLES.map((p) => [p.id, p]),
);

// Module → relevant principles (for side-panel display)
export const MODULE_PRINCIPLES: Record<string, string[]> = {
  starter: ['P04', 'P05', 'P33', 'P12', 'P24'],
  madlibs: ['P03', 'P12', 'P19'],
  product: ['P23', 'P25', 'P07', 'P14'],
  casestudy: ['P23', 'P02', 'P11'],
  brief: ['P04', 'P05', 'P09', 'P10', 'P20', 'P34'],
  style: ['P14', 'P15', 'P16'],
  copyedit: ['P13', 'P25', 'P35'],
  deepdive: ['P16', 'P24', 'P12', 'P05', 'P33'],
};
