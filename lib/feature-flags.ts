// Testversion: next.config.ts setzt NEXT_PUBLIC_IS_STAGING=true für jeden Cloudflare-Branch außer `main` → keine Google-Indexierung (kein sichtbarer Hinweis, damit der Eindruck echt bleibt)
export const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'

export const SITE_URL = process.env.SITE_URL || 'https://www.weitmarer-brillenstudio.de'
