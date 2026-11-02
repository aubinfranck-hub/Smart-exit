# Smart Exit — Registre autonome de sortie

Smart Exit **ne vérifie pas les paiements** et **n'est pas connecté à la caisse**. Il vérifie seulement si un numéro de ticket a déjà été enregistré à la sortie.

## Installation de développement
1. Installer Node.js 20+, PostgreSQL, puis lancer `npm install`.
2. Exécuter `server/sql/001_exit_controls.sql` dans la base Smart Exit (exemple : `psql "$DATABASE_URL" -f server/sql/001_exit_controls.sql`).
3. Créer un fichier `.env` local, non versionné, avec :
   - `DATABASE_URL=postgres://...`
   - `API_PORT=3001`
   - `CONTROLLERS_JSON=[{"id":"VIG-01","storeId":"MAG-01","gateId":"PORTE-01","token":"JETON_SECRET_LONG"}]`
4. Lancer `npm run start:api` et `npm run dev` dans deux terminaux.
5. Ouvrir le menu **Contrôle de sortie**. Connecter le poste avec son jeton, saisir/scanner un numéro de ticket, vérifier puis enregistrer.
6. Configurer cinq identifiants contrôleurs distincts dans CONTROLLERS_JSON et une base partagée. Le contrôle atomique s'effectue au moment de l'enregistrement.

## Limites et tests nécessaires
- Le formulaire actuel accepte un lecteur code-barres agissant comme clavier, pas encore le scan caméra.
- Les articles sont saisis manuellement ; la lecture OCR d'un ticket n'est pas implémentée.
- L'historique est disponible via `GET /api/history`, mais pas encore intégré au tableau de bord.
- Les autres écrans de l'ancienne démonstration affichent encore des données de caisse fictives : **ne pas les considérer comme des rapports réels**.
- La vérification préalable n'est qu'informative : seule la réponse à `POST /api/exit` confirme l'unicité. Tester impérativement cinq demandes concurrentes.
- Authentification par jeton statique : avant production, prévoir gestion et révocation des comptes, TLS, journalisation des tentatives et limitation de débit.
- Ne jamais utiliser de jeton court ou partagé. Les cinq contrôleurs doivent utiliser des identifiants distincts.
- Le déploiement doit router `/api` vers le serveur, avec le frontend sur la même origine.
- Aucune compilation ni test d'intégration n'a été effectué lors de cette modification GitHub.

## Cas de recette
1. Premier ticket : NOT_YET_CONTROLLED, puis VALIDATED.
2. Même ticket sur un autre contrôleur : ALREADY_CONTROLLED.
3. Deux validations simultanées : une seule VALIDATED.
4. Serveur indisponible : aucune sortie validée.
5. Un ticket de magasin A n'interfère pas avec le même numéro au magasin B.
