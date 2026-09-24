import type { Principle } from './types';

export const PRINCIPLES: Principle[] = [
  {
    id: 'P01',
    name: 'Smartly Unpolished',
    source: 'Tiah Slattery, Dept',
    rule:
      'Je polierter, desto weniger Vertrauen. Lo-fi, chaotisch, ehrlich schlägt Over-Production. In einer Welt voller AI-Slop ist Unperfektion der Beweis von Menschlichkeit. Das heißt nicht faul — es heißt bewusst unpoliert.',
    leosCheck:
      'Sieht das aus wie ein Ad? Dann ist es falsch. Sieht es aus wie ein Gedanke, den jemand teilen musste? Dann weiter.',
    triggers: ['lo-fi', 'rough', 'roh', 'hand', 'ehrlich', 'imperfekt', 'unpoliert', 'real'],
    antiTriggers: ['hochglanz', 'studio', 'render', 'cgi', 'corporate'],
  },
  {
    id: 'P02',
    name: 'Post-Post Thinking',
    source: 'Alexandra Mathieu, Open Influence',
    rule:
      'Der Post ist nur der Teaser. Was zählt, sind die Reaktionen danach: Comments, Stitches, Duets, DMs, Screenshots, Remixes. Jede Idee muss mit dem Ziel entwickelt werden, was NACH dem Post passiert — nicht was beim Post passiert.',
    leosCheck:
      'Was soll jemand mit diesem Content tun? Screenshotten, weiterleiten, remixen, antworten? Wenn die Antwort „liken“ ist, reicht es nicht.',
    triggers: ['comment', 'kommentar', 'remix', 'screenshot', 'dm', 'reaktion', 'duet', 'stitch', 'weiterleit'],
    antiTriggers: ['reichweite', 'impressions', 'awareness'],
  },
  {
    id: 'P03',
    name: 'Single-Frame Ambush',
    source: 'Emily Charlton-Smith, Anything is Possible',
    rule:
      'Das erste Frame IST die ganze Geschichte. Kein Warm-up, kein sanfter Einstieg. Bold Typography, harte Crops, unerwartete Farben — irgendetwas, das den Scroll gewaltsam unterbricht. Wenn Frame 1 keine Wirkung hat, hat nichts Wirkung.',
    leosCheck:
      'Was passiert in Frame 1? Wenn die Antwort „Intro, Logo, Musik“ ist — zurück zum Start.',
    triggers: ['hook', 'frame 1', 'erstes bild', 'pattern interrupt', 'bold', 'crop', 'typografie', 'thumbnail'],
    antiTriggers: ['intro', 'logo-stinger', 'aufwärm', 'einleitung'],
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
  },
  {
    id: 'P17',
    name: 'Vertical-First',
    source: 'LEO Playbook',
    rule:
      'Mobile als Default, nicht als Anpassung. Wer im Querformat denkt, denkt für 2014. 9:16 ist kein Format — es ist DIE Bühne. Alles andere ist Resteverwertung.',
    leosCheck:
      'Sieht der Hero-Frame auf einem 6-Zoll-Display sauber aus? Oder ist der wichtigste Text gerade abgeschnitten?',
    triggers: ['vertikal', '9:16', 'mobile', 'reels', 'shorts', 'tiktok', 'stories'],
    antiTriggers: ['querformat', '16:9', 'landscape', 'desktop-first'],
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
  },
  {
    id: 'P24',
    name: 'Polarization Tax',
    source: 'LEO Playbook',
    rule:
      'Bewusst Position beziehen. Wer allen gefällt, bewegt niemanden. Eine starke These hat ihren Preis — manche werden gehen. Das ist der Kaufpreis für die, die bleiben und dich verteidigen.',
    leosCheck:
      'Welcher Teil deiner Zielgruppe darf gehen, damit der Rest bleibt? Wenn niemand gehen darf, ist die Position nicht stark genug.',
    triggers: ['these', 'position', 'meinung', 'standpunkt', 'unbeliebt', 'kontrovers', 'mut'],
    antiTriggers: ['neutral', 'für jeden okay', 'safe', 'unverbindlich', 'inoffensive'],
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
  },
];

export const PRINCIPLES_BY_ID: Record<string, Principle> = Object.fromEntries(
  PRINCIPLES.map((p) => [p.id, p]),
);

// Module → relevant principles (for side-panel display)
export const MODULE_PRINCIPLES: Record<string, string[]> = {
  starter: ['P04', 'P05', 'P12', 'P24'],
  madlibs: ['P03', 'P12', 'P19'],
  product: ['P23', 'P25', 'P07', 'P14'],
  casestudy: ['P23', 'P02', 'P11'],
  brief: ['P04', 'P05', 'P09', 'P10', 'P20'],
  style: ['P14', 'P15', 'P16'],
  copyedit: ['P13', 'P25'],
};
