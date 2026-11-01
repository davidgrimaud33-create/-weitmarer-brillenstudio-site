// Staging-Site setzt NEXT_PUBLIC_IS_STAGING=true im Netlify-UI → Banner + noindex
export const isStaging = process.env.NEXT_PUBLIC_IS_STAGING === 'true'

export const SITE_URL = process.env.SITE_URL || 'https://www.weitmarer-brillenstudio.de'
