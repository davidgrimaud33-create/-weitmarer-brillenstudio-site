/**
 * Die geprüften Monatsangebote – einmal beim Bauen geladen, von /angebote und der Startseite genutzt.
 * Beim Bauen der Live-Seite (Branch main) sind Beispiel-Angebote ("entwurf": true) gesperrt.
 */
import daten from '@/content/angebote.json'
import { pruefeAngebote } from './angebote'

export const monatsangebote = pruefeAngebote(daten, 'content/angebote.json', {
  live: process.env.WORKERS_CI_BRANCH === 'main',
})
