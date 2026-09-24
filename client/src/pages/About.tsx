import { Link } from 'wouter';
import { MHMark } from '@/components/Logo';
import { LeoWordmark } from '@/components/LeoWordmark';

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16 md:py-24">
      <article className="space-y-10">
        <MHMark className="h-16 w-16 text-foreground" />

        <div>
          <div className="text-tag text-muted-foreground">ÜBER DAS LAB</div>
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.9] mt-2 tracking-tight">
            Was ist das
            <br />
            <span className="italic text-primary">Strategy Lab?</span>
          </h1>
        </div>

        <div className="font-serif text-xl md:text-2xl leading-relaxed space-y-6 max-w-prose">
          <p>
            Ich bin Marcel — Creative Athlete in Storytelling. Vor jedem guten
            Foto, jeder guten Kampagne, jedem guten Format steht eine harte
            Frage: <em>Was willst du wirklich sagen?</em>
          </p>
        </div>

        {/* LEO Manifest */}
        <section
          className="border-t border-border pt-12 space-y-10"
          data-testid="section-leo-manifest"
        >
          <div>
            <LeoWordmark className="w-full max-w-xl text-primary" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-tag text-foreground">
                  LISTEN
                </span>
                <span className="font-mono text-tag text-primary">P05</span>
              </div>
              <p className="font-serif text-lg leading-snug">
                Ich höre zuerst in deine Community, deine Kultur, deine
                unhinged Comments. Kein Ego, keine Annahmen.
              </p>
              <p className="font-mono text-tag text-muted-foreground border-t border-border pt-3">
                P05 — LISTEN FIRST
              </p>
            </div>
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-tag text-foreground">
                  ELEVATE
                </span>
              </div>
              <p className="font-serif text-lg leading-snug">
                Dann hebe ich das Beste raus. Plattform-nativ. Emotional
                explosiv. Nichts wird produziert, was nicht verdient gepostet
                zu werden.
              </p>
              <p className="font-mono text-tag text-muted-foreground border-t border-border pt-3">
                PLATTFORM-NATIV
              </p>
            </div>
            <div className="bg-card p-6 space-y-4">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-tag text-foreground">OWN</span>
              </div>
              <p className="font-serif text-lg leading-snug">
                Wir ownen das Ergebnis. Dein Format. Deine Story. Dein Moment.
                Volle Accountability.
              </p>
              <p className="font-mono text-tag text-muted-foreground border-t border-border pt-3">
                ACCOUNTABILITY
              </p>
            </div>
          </div>

          <p className="font-serif italic text-xl md:text-2xl leading-relaxed text-foreground/90 max-w-2xl">
            Dein Social-Sparringspartner, der deine Storys stark macht.
          </p>
        </section>

        <div className="font-serif text-xl md:text-2xl leading-relaxed space-y-6 max-w-prose border-t border-border pt-12">
          <p>
            Dieses Lab ist der Werkzeugkasten, mit dem ich seit Jahren arbeite —
            sieben Frameworks aus der Welt der besten Texter und Strategen,
            gefiltert durch das, was auf Social heute wirklich funktioniert.
          </p>
          <p>
            Du füllst es aus, ich werte aus. Im Briefing-Call haben wir keinen
            leeren Tisch mehr, sondern eine Persona, fünf Hooks und drei
            Formate, mit denen wir sofort produzieren können.
          </p>
          <p>
            Es dauert 30 bis 60 Minuten. Antworte schnell. Du kannst jederzeit
            zurückkommen. Am Ende exportierst du deinen Report — der Rest
            passiert zwischen uns.
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-mono text-tag text-foreground">— LEO</p>
        </div>

        {/* Über die Tracks */}
        <section
          className="border-t border-border pt-12 space-y-4"
          data-testid="section-tracks"
        >
          <div className="text-tag text-muted-foreground">ÜBER DIE TRACKS</div>
          <p className="font-serif text-2xl md:text-3xl leading-snug">
            Vier Wege durch das Lab — je nachdem, was du baust.
          </p>
          <ul className="text-sm md:text-base text-foreground/85 leading-relaxed space-y-2 list-none">
            <li><span className="font-mono text-tag text-primary">01 / FB</span> <span className="font-serif italic">Founder Brand</span> · für Solos, Coaches, Personal Brands.</li>
            <li><span className="font-mono text-tag text-primary">02 / PL</span> <span className="font-serif italic">Product Launch</span> · wenn etwas Neues live geht.</li>
            <li><span className="font-mono text-tag text-primary">03 / AS</span> <span className="font-serif italic">Agency / Studio</span> · für Dienstleister mit Cases.</li>
            <li><span className="font-mono text-tag text-primary">04 / BR</span> <span className="font-serif italic">Brand Refresh</span> · etablierte Marken, die sich neu sortieren.</li>
          </ul>
          <p className="font-mono text-xs text-muted-foreground">
            Wähl deinen Track auf der Startseite. Du kannst ihn später wechseln.
          </p>
        </section>

        {/* Kontakt */}
        <section
          className="border-t border-border pt-12 space-y-4"
          data-testid="section-contact"
        >
          <div className="text-tag text-muted-foreground">KONTAKT</div>
          <p className="font-serif text-2xl md:text-3xl leading-snug">
            Marcel Haupt — Creative Athlete
          </p>
          <div className="font-mono text-sm text-foreground space-y-1">
            <a
              href="mailto:info@marcelhaupt.com"
              className="block hover:text-primary"
              data-testid="link-contact-email"
            >
              info@marcelhaupt.com
            </a>
            <a
              href="tel:+491627083570"
              className="block hover:text-primary"
              data-testid="link-contact-phone"
            >
              +49 162 7083570
            </a>
          </div>
        </section>

        <div className="border-t border-border pt-8">
          <Link href="/" data-testid="link-start">
            <a className="font-mono uppercase text-sm text-primary hover:underline">
              Loslegen →
            </a>
          </Link>
        </div>
      </article>
    </div>
  );
}
