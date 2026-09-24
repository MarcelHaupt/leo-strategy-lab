export function SiteFooter() {
  return (
    <footer
      className="border-t border-border mt-16"
      data-testid="site-footer"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="font-mono text-tag text-foreground">
            MARCEL HAUPT — CREATIVE ATHLETE
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 font-mono text-tag text-muted-foreground">
            <a
              href="mailto:info@marcelhaupt.com"
              className="hover:text-primary"
              data-testid="link-footer-email"
            >
              info@marcelhaupt.com
            </a>
            <span className="hidden md:inline">·</span>
            <a
              href="tel:+491627083570"
              className="hover:text-primary"
              data-testid="link-footer-phone"
            >
              +49 162 7083570
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
