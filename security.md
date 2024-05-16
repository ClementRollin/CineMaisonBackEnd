# Politique de Sécurité de CineMaison

## Signalement des Vulnérabilités

Si vous découvrez une vulnérabilité de sécurité dans ce projet, merci de nous en informer immédiatement. Nous apprécions votre aide pour assurer la sécurité de notre projet et de nos utilisateurs.

**Pour signaler une vulnérabilité, veuillez envoyer un email à :** [votre-email@example.com]

## Pratiques de Sécurité

1. **Stockage Sécurisé des Mots de Passe**
    - Les mots de passe des utilisateurs doivent être hachés en utilisant un algorithme de hachage sécurisé comme bcrypt.

2. **Gestion des Tokens**
    - Utilisation de JSON Web Tokens (JWT) pour l'authentification.
    - Les tokens doivent être renouvelés régulièrement et invalidés après une période d'inactivité.

3. **Communication Sécurisée**
    - Utiliser HTTPS pour toutes les communications entre le client et le serveur pour prévenir les attaques de type man-in-the-middle.
    - Mettre en place HSTS (HTTP Strict Transport Security) pour forcer l'utilisation de HTTPS.

4. **Prévention des Attaques Courantes**
    - Protéger contre les injections SQL en utilisant des ORM comme TypeORM.
    - Protéger contre les attaques XSS (Cross-Site Scripting) en validant et en échappant correctement les entrées des utilisateurs.
    - Protéger contre les attaques CSRF (Cross-Site Request Forgery) en utilisant des tokens CSRF.

5. **Tests de Sécurité**
    - Effectuer régulièrement des tests de pénétration et des audits de sécurité.
    - Utiliser des outils automatisés pour scanner les vulnérabilités.

## Mise à Jour de la Sécurité

Nous nous engageons à maintenir notre projet à jour avec les dernières corrections de sécurité et bonnes pratiques. Les dépendances doivent être régulièrement mises à jour pour inclure les dernières versions sécurisées.