import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSession } from '@/lib/session-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MHMark } from '@/components/Logo';
import { LeoTagline } from '@/components/LeoTagline';
import { TRACKS, type TrackId } from '@/lib/types';
import { tr } from '@/lib/i18n';
import { LangSwitch } from '@/components/LangSwitch';

export default function Welcome() {
  const { state, dispatch } = useSession();
  const [, navigate] = useLocation();
  const [client, setClient] = useState(state.clientName);
  const [project, setProject] = useState(state.projectName);
  const [selectedTrack, setSelectedTrack] = useState<TrackId | null>(state.track);

  const start = () => {
    if (!client.trim() || !project.trim() || !selectedTrack) return;
    dispatch({
      type: 'init',
      clientName: client.trim(),
      projectName: project.trim(),
      track: selectedTrack,
    });
    navigate('/modules');
  };

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
      <div className="space-y-12">
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="font-mono text-tag text-muted-foreground">
              MARCEL HAUPT · CREATIVE ATHLETE
            </div>
            <LangSwitch />
          </div>
          <MHMark className="h-24 w-24 text-foreground" />

          <div>
            <div className="text-tag text-muted-foreground">
              {tr('01 / Briefing-Werkstatt für Social-First Marken', '01 / Briefing workshop for social-first brands')}
            </div>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] mt-3 tracking-tight">
              Strategy
              <br />
              <span className="italic text-primary">Lab</span>
            </h1>
          </div>

          <p className="font-sans text-lg leading-relaxed max-w-2xl text-foreground/90">
            {tr(
              'Sieben Frameworks. Achtundzwanzig Prinzipien. Ein Strategie-Report. Beantworte die Fragen so, wie du sie deinem besten Freund beantworten würdest — schnell, ehrlich, ohne Marketing-Sprech. Am Ende stehen Hooks, Formate und eine Persona, mit denen wir wirklich arbeiten können.',
              'Seven frameworks. Twenty-eight principles. One strategy report. Answer the questions the way you would answer your best friend: fast, honest, no marketing speak. At the end you get hooks, formats and a persona we can actually work with.',
            )}
          </p>

          <div className="pt-2">
            <LeoTagline className="w-full max-w-md text-primary" />
          </div>
        </div>

        {/* Tiny Mode — Schnellstart */}
        <a
          href="#/tiny"
          className="group grid grid-cols-1 md:grid-cols-12 gap-4 items-center border border-border bg-card p-6 hover-elevate"
          data-testid="link-welcome-tiny"
        >
          <div className="md:col-span-3">
            <div className="font-mono text-tag text-primary">TINY MODE</div>
            <div className="font-mono text-tag text-muted-foreground mt-1">{tr('6 Schritte · ≈ 15 Min', '6 steps · ≈ 15 min')}</div>
          </div>
          <div className="md:col-span-7">
            <h2 className="font-serif text-3xl leading-tight tracking-tight">
              {tr('Wenig Zeit, klares', 'Little time, clear')} <span className="italic text-primary">Briefing?</span>
            </h2>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
              {tr(
                'Ziel, Plattform, Zielgruppe, Grenze. Daraus werden Problem-Satz, Hooks, Format, Mini-CRISP und die nächsten 72 Stunden.',
                'Goal, platform, audience, constraint. That becomes a problem sentence, hooks, a format, a mini CRISP and the next 72 hours.',
              )}
            </p>
          </div>
          <div className="md:col-span-2 md:text-right font-mono text-sm uppercase text-primary group-hover:underline">
            {tr('Tiny starten →', 'Start Tiny →')}
          </div>
        </a>

        {/* Track-Auswahl */}
        <div className="border-t border-border pt-10 space-y-6">
          <div>
            <div className="text-tag text-muted-foreground">{tr('SCHRITT 01', 'STEP 01')}</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 tracking-tight">
              {tr('Welcher', 'Which')} <span className="italic text-primary">Track?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border">
            {(Object.values(TRACKS) as Array<typeof TRACKS[TrackId]>).map((track) => {
              const isActive = selectedTrack === track.id;
              const isDimmed = selectedTrack !== null && !isActive;
              return (
                <button
                  type="button"
                  key={track.id}
                  onClick={() => setSelectedTrack(track.id)}
                  className={`group block text-left bg-card p-6 transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-primary ring-inset opacity-100'
                      : isDimmed
                        ? 'opacity-50 hover:opacity-90'
                        : 'opacity-100 hover-elevate'
                  }`}
                  data-testid={`card-track-${track.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span
                      className={`font-mono text-tag ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {track.code}
                    </span>
                    <span className="font-mono text-tag text-muted-foreground">
                      ≈ {track.questionCount} {tr('Fragen', 'questions')}
                    </span>
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl mt-4 leading-tight tracking-tight">
                    {track.name}
                  </h3>
                  <p className="font-serif italic text-sm text-muted-foreground mt-1">
                    {track.subtitle}
                  </p>
                  <p className="text-sm text-foreground/85 mt-4 leading-relaxed">
                    {track.description}
                  </p>
                </button>
              );
            })}
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            {tr('Dein Track entscheidet, welche Fragen du siehst. Du kannst ihn später wechseln.', 'Your track decides which questions you see. You can switch it later.')}
          </p>
        </div>

        {/* Inputs erscheinen erst nach Track-Auswahl */}
        <div
          className={`border-t border-border pt-10 space-y-6 transition-opacity duration-500 ${
            selectedTrack ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden border-t-0 pt-0'
          }`}
        >
          <div>
            <div className="text-tag text-muted-foreground">{tr('SCHRITT 02', 'STEP 02')}</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 tracking-tight">
              {tr('Wer und', 'Who and')} <span className="italic text-primary">{tr('was?', 'what?')}</span>
            </h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="client" className="text-tag text-muted-foreground">
              {tr('WER BIST DU? (KLIENT-NAME)', 'WHO ARE YOU? (CLIENT NAME)')}
            </label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder={tr('z.B. Marke Müller', 'e.g. Brand Miller')}
              className="font-serif text-2xl h-14 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
              data-testid="input-client-name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project" className="text-tag text-muted-foreground">
              {tr('WAS IST DAS PROJEKT?', 'WHAT IS THE PROJECT?')}
            </label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder={tr("z.B. Launch Spring '26", "e.g. Launch Spring '26")}
              className="font-serif text-2xl h-14 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
              data-testid="input-project-name"
            />
          </div>

          <Button
            type="button"
            onClick={start}
            disabled={!client.trim() || !project.trim() || !selectedTrack}
            className="font-mono uppercase tracking-widest text-sm h-12 px-6"
            data-testid="button-start"
          >
            {tr('Loslegen →', 'Get started →')}
          </Button>

          <div className="pt-4">
            <a
              href="#/about"
              className="font-mono text-tag text-muted-foreground hover:text-primary"
              data-testid="link-about"
            >
              {tr('Worum es im Lab geht →', 'What the Lab is about →')}
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-mono text-xs text-muted-foreground">
            {tr('Alles bleibt in deinem Browser. Bei Reload weg. Am Ende exportieren.', 'Everything stays in your browser. Gone on reload. Export at the end.')}
          </p>
        </div>
      </div>
    </div>
  );
}
