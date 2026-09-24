import { useState } from 'react';
import { useLocation } from 'wouter';
import { useSession } from '@/lib/session-store';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MHMark } from '@/components/Logo';
import { LeoTagline } from '@/components/LeoTagline';
import { TRACKS, type TrackId } from '@/lib/types';

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
          <div className="font-mono text-tag text-muted-foreground">
            MARCEL HAUPT · CREATIVE ATHLETE
          </div>
          <MHMark className="h-24 w-24 text-foreground" />

          <div>
            <div className="text-tag text-muted-foreground">
              01 / Briefing-Werkstatt für Social-First Marken
            </div>
            <h1 className="font-serif text-6xl md:text-8xl leading-[0.9] mt-3 tracking-tight">
              Strategy
              <br />
              <span className="italic text-primary">Lab</span>
            </h1>
          </div>

          <p className="font-sans text-lg leading-relaxed max-w-2xl text-foreground/90">
            Sieben Frameworks. Fünfundzwanzig Prinzipien. Ein Strategie-Report.
            Beantworte die Fragen so, wie du sie deinem besten Freund beantworten würdest — schnell, ehrlich, ohne Marketing-Sprech.
            Am Ende stehen Hooks, Formate und eine Persona, mit denen wir wirklich arbeiten können.
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
            <div className="font-mono text-tag text-muted-foreground mt-1">6 Schritte · ≈ 15 Min</div>
          </div>
          <div className="md:col-span-7">
            <h2 className="font-serif text-3xl leading-tight tracking-tight">
              Wenig Zeit, klares <span className="italic text-primary">Briefing?</span>
            </h2>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">
              Ziel, Plattform, Zielgruppe, Grenze. Daraus werden Problem-Satz, Hooks, Format, Mini-CRISP und die nächsten 72 Stunden.
            </p>
          </div>
          <div className="md:col-span-2 md:text-right font-mono text-sm uppercase text-primary group-hover:underline">
            Tiny starten →
          </div>
        </a>

        {/* Track-Auswahl */}
        <div className="border-t border-border pt-10 space-y-6">
          <div>
            <div className="text-tag text-muted-foreground">SCHRITT 01</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 tracking-tight">
              Welcher <span className="italic text-primary">Track?</span>
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
                      ≈ {track.questionCount} Fragen
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
            Dein Track entscheidet, welche Fragen du siehst. Du kannst ihn später wechseln.
          </p>
        </div>

        {/* Inputs erscheinen erst nach Track-Auswahl */}
        <div
          className={`border-t border-border pt-10 space-y-6 transition-opacity duration-500 ${
            selectedTrack ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 overflow-hidden border-t-0 pt-0'
          }`}
        >
          <div>
            <div className="text-tag text-muted-foreground">SCHRITT 02</div>
            <h2 className="font-serif text-3xl md:text-4xl mt-1 tracking-tight">
              Wer und <span className="italic text-primary">was?</span>
            </h2>
          </div>

          <div className="space-y-2">
            <label htmlFor="client" className="text-tag text-muted-foreground">
              WER BIST DU? (KLIENT-NAME)
            </label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="z.B. Marke Müller"
              className="font-serif text-2xl h-14 border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
              data-testid="input-client-name"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="project" className="text-tag text-muted-foreground">
              WAS IST DAS PROJEKT?
            </label>
            <Input
              id="project"
              value={project}
              onChange={(e) => setProject(e.target.value)}
              placeholder="z.B. Launch Spring '26"
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
            Loslegen →
          </Button>

          <div className="pt-4">
            <a
              href="#/about"
              className="font-mono text-tag text-muted-foreground hover:text-primary"
              data-testid="link-about"
            >
              Worum es im Lab geht →
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-mono text-xs text-muted-foreground">
            Alles bleibt in deinem Browser. Bei Reload weg. Am Ende exportieren.
          </p>
        </div>
      </div>
    </div>
  );
}
