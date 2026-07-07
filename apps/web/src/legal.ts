// src/legal.ts — contenu des documents légaux (CGU + politique de confidentialité).
// Partagé entre les pages publiques (/conditions, /confidentialite) et le wizard d'inscription.

export interface DocLegal {
  titre: string
  sections: Array<{ h: string; p: string[] }>
}

export const CONDITIONS: DocLegal = {
  titre: "Conditions d'utilisation",
  sections: [
    {
      h: '1. Objet',
      p: [
        "KADY est une plateforme de rencontres sérieuses destinée aux personnes majeures résidant en Côte d'Ivoire. Les connexions naissent dans des Cercles thématiques de 6 à 10 personnes : aucun message privé n'est possible entre deux membres qui ne partagent pas au moins un Cercle actif.",
        "En créant un compte, tu acceptes les présentes conditions dans leur intégralité.",
      ],
    },
    {
      h: '2. Conditions d\'accès',
      p: [
        "L'inscription est strictement réservée aux personnes âgées de 18 ans ou plus. Toute fausse déclaration d'âge entraîne la suppression immédiate du compte.",
        'Un seul compte par personne. Le numéro de téléphone et l\'adresse email fournis doivent être personnels et valides.',
      ],
    },
    {
      h: '3. Vérification du profil',
      p: [
        "Un selfie de vérification est demandé à l'inscription. Il sert exclusivement à confirmer que ton profil correspond à une personne réelle : il n'est jamais affiché publiquement et n'est pas utilisé comme photo de profil.",
        'Ta photo de profil est choisie parmi les photos que tu ajoutes librement à ton profil.',
      ],
    },
    {
      h: '4. Comportement et modération',
      p: [
        'Respect, bienveillance et authenticité sont exigés. Sont interdits : harcèlement, propos haineux ou discriminatoires, contenus à caractère sexuel non sollicités, usurpation d\'identité, arnaques et sollicitations commerciales.',
        "L'équipe de modération peut avertir, suspendre ou bannir définitivement tout compte contrevenant. Un bannissement bloque définitivement l'email et le numéro de téléphone associés.",
        'Le partage de coordonnées personnelles (numéros, réseaux sociaux, liens) est filtré dans les Cercles pour protéger tous les membres.',
      ],
    },
    {
      h: '5. Abonnement Premium',
      p: [
        "L'abonnement Premium (3 000 FCFA / mois) se règle par mobile money via CinetPay. Il est sans engagement et n'est pas remboursable une fois la période entamée.",
      ],
    },
    {
      h: '6. Responsabilités',
      p: [
        "KADY met en relation des personnes mais ne garantit aucun résultat. Reste prudent·e lors des rencontres physiques : privilégie les lieux publics et informe un proche.",
        'Tu es seul·e responsable des contenus que tu publies. KADY se réserve le droit de retirer tout contenu contraire aux présentes conditions.',
      ],
    },
    {
      h: '7. Résiliation',
      p: [
        'Tu peux supprimer ton compte à tout moment depuis les réglages. KADY peut résilier un compte en cas de manquement grave aux présentes conditions.',
      ],
    },
  ],
}

export const CONFIDENTIALITE: DocLegal = {
  titre: 'Politique de confidentialité',
  sections: [
    {
      h: '1. Données collectées',
      p: [
        "À l'inscription : prénom, email, numéro de téléphone, date de naissance, genre, ville, centres d'intérêt, selfie de vérification et photos de profil.",
        "À l'usage : messages dans les Cercles et conversations privées, évaluations de relations, signalements, données techniques de connexion.",
      ],
    },
    {
      h: '2. Utilisation des données',
      p: [
        'Tes données servent uniquement à faire fonctionner KADY : proposer des Cercles pertinents, sécuriser la plateforme, vérifier les profils et améliorer le service.',
        "Elles ne sont jamais vendues à des tiers. Aucune publicité ciblée n'est pratiquée.",
      ],
    },
    {
      h: '3. Photos et selfie',
      p: [
        'Tes photos sont stockées de manière privée et servies via des liens signés à durée limitée : aucune photo n\'est accessible par une URL publique permanente.',
        "Le selfie de vérification n'est visible que par l'équipe de modération, uniquement pour valider ton profil.",
      ],
    },
    {
      h: '4. Qui voit quoi',
      p: [
        'Ton prénom, ton âge, ta ville, ta bio et ta photo de profil sont visibles des membres de tes Cercles. Tes photos supplémentaires se déverrouillent progressivement selon le niveau de confiance établi avec chaque personne.',
        'Ton email et ton numéro de téléphone ne sont jamais visibles des autres membres.',
      ],
    },
    {
      h: '5. Conservation et suppression',
      p: [
        'Tes données sont conservées tant que ton compte est actif. La suppression du compte entraîne la désactivation immédiate du profil et la suppression des photos.',
        'Conformément à la réglementation ivoirienne (ARTCI), tu disposes d\'un droit d\'accès, de rectification et de suppression de tes données : contacte-nous depuis les réglages de l\'application.',
      ],
    },
    {
      h: '6. Sécurité',
      p: [
        'Mots de passe hachés (argon2), connexions chiffrées (HTTPS), verrouillage anti-force-brute, limitation de débit : la sécurité de tes données est une priorité de conception.',
      ],
    },
  ],
}
