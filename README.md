# Weitmarer Brillenstudio – Website

Website des Weitmarer Brillenstudios (Bochum-Weitmar). Next.js 16 (statischer Export) + Tailwind 4,
Hosting bei Cloudflare (Worker mit statischen Dateien und Terminformular-Funktion).

- **Pflege:** per Claude Code – Regeln in [`CLAUDE.md`](CLAUDE.md), Anleitung in [`docs/02-pflege-per-vibe-coding.md`](docs/02-pflege-per-vibe-coding.md), Beispielsätze in [`docs/05-beispielsaetze.md`](docs/05-beispielsaetze.md)
- **Technik:** [`docs/03-technik.md`](docs/03-technik.md)
- **Dienste und Zugänge:** [`docs/01-zugaenge.md`](docs/01-zugaenge.md)

```bash
npm install
npm run dev        # lokal auf http://localhost:3000
npm run vorschau   # Build + Cloudflare-Worker lokal (inkl. /api/termin)
npm test
```

Branches: `staging` (Testversion, hier wird gearbeitet) → `main` (Live-Seite).
