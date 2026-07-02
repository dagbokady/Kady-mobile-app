export const NIVEAUX_RENCONTRE = ["L'Inconnu", 'La Connaissance', "L'Ami(e)", 'La Confiance', "L'Intimité"]
export const NIVEAUX_AMITIE = ["L'Inconnu", 'La Connaissance', 'Le Camarade', 'L’Ami Proche', 'Les Complices']

export function labelNiveau(mode: string, niveau: number): string {
  const liste = mode === 'amitie' ? NIVEAUX_AMITIE : NIVEAUX_RENCONTRE
  return liste[Math.min(Math.max(niveau, 1), liste.length) - 1]
}
