# Smart-exit — 5 contrôleurs, une seule validation

Cette branche contient un **socle serveur** non branché à l'interface actuelle. Ne pas le déployer tel quel.

## Base de données
Exécuter `server/sql/001_exit_controls.sql` dans PostgreSQL. L'import caisse doit alimenter `pos_tickets` depuis une source authentifiée. Aucun ticket ne doit être créé automatiquement à partir d'un QR code.

## Validation concurrente
`server/validateExit.ts` reçoit un contrôleur déjà authentifié et une affectation magasin/poste déjà vérifiée. La transaction verrouille la ligne ticket et la contrainte UNIQUE garantit qu'un seul des cinq contrôleurs pourra enregistrer la sortie.

## Travaux obligatoires avant branchement
- API HTTP authentifiée, contrôle des rôles, rate limiting, audit et TLS.
- Connecteur caisse réel, gestion des annulations/remboursements et du délai de synchronisation.
- UX de confirmation des articles, gestion des exceptions, réseau hors ligne = pas d'autorisation implicite.
- Tests d'intégration PostgreSQL sur deux validations simultanées, cinq tablettes et redémarrages.
- Supprimer les KPI de démonstration et localStorage pour l'usage réel.
- Installer `pg` et ses types dans le service serveur lorsqu'il sera créé.

Le moteur React existant reste un démonstrateur isolé. La validation serveur n'est pas encore appelée par l'UI.
