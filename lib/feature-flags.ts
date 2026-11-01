// Staging-Site setzt NEXT_PUBLIC_IS_STAGING=true im Netlify-UI → keine Google-Indexierung (kein sichtbarer Hinweis, damit der Eindruck echt bleibt)
export const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'

export const SITE_URL = process.env.SITE_URL || 'https://www.weitmarer-brillenstudio.de'
