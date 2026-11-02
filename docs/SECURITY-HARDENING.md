# Smart-exit — Sécurisation progressive

## Correction P0 appliquée
- Un ticket absent de la liste des transactions connues est classé UNKNOWN, sans création automatique d'une transaction payée.
- La correspondance approximative `rawCode.includes(tx.ticketNumero)` a été supprimée : seule une identité exacte est admise.
- Les tickets impayés et les tickets déjà contrôlés continuent d'être refusés.

## Limites importantes (non résolues)
- Données dans localStorage : aucune synchronisation fiable entre postes.
- Pas de source de caisse authentifiée, pas de preuve cryptographique du paiement.
- Pas de validation atomique serveur : deux postes peuvent valider simultanément le même ticket.
- Comptes vigiles et postes sélectionnés localement, sans authentification.
- Statistiques enrichies de données fictives ; ne pas utiliser pour la comptabilité.
- Aucune preuve de compilation ni test sur tablette effectués dans cette intervention.

## Étapes avant production
1. API centrale authentifiée et PostgreSQL avec organisation/magasin/caisse/poste/vigile.
2. Import ou intégration POS avec statut de paiement et annulations à jour.
3. Validation de sortie atomique avec contrainte d'unicité et idempotence.
4. Journaux d'audit immuables, horodatage serveur et permissions par rôle.
5. Mode hors ligne explicite : aucun ticket inconnu autorisé automatiquement.
6. Remplacer les KPI fictifs par des requêtes serveur.
7. Tests automatisés : inconnu, impayé, déjà validé, codes partiels, deux postes concurrents, réseau indisponible.
8. Ajout progressif de preuves photo/audio/vidéo avec autorisations et rétention.

## Scénarios de vérification manuelle
- Scanner 458721 (ticket démo payé) : écran autorisé, puis validation possible.
- Scanner 458710 (ticket démo impayé) : refus.
- Scanner 458715 (ticket démo déjà contrôlé) : refus.
- Scanner 999999 (inconnu) : refus.
- Scanner un numéro contenant un ticket existant comme sous-chaîne : refus.
- Répéter un ticket validé : refus local sur le même appareil.
