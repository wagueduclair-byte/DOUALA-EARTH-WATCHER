# Douala Earth Watchers

Tableau de bord web (React + Vite) pour le **NASA Space Apps Challenge 2026** : évolution des **précipitations**, de la **température de surface** et de la **végétation (NDVI)** à Douala (Cameroun), 2015–2025, avec zone principale **Bonamoussadi** et deux zones de comparaison, et les limites d'interprétation.

> ⚠️ **ÉTAT ACTUEL : MAQUETTE.** Toutes les valeurs (courbes, cartes, statistiques) sont **fictives**. Aucune conclusion scientifique ne doit en être tirée. Voir « Brancher les vraies données ».

L'application s'ouvre dans un navigateur, sur ordinateur comme sur téléphone (affichage adaptatif). Une seule dépendance d'exécution : React. Les graphiques sont de l'SVG écrit à la main ; la carte est Leaflet dans une iframe.

---

## 1. Lancer le projet chez vous

### Prérequis
- **Node.js LTS** (version 22 recommandée) : https://nodejs.org — vérifier avec `node -v`. Si `npm run dev` refuse de démarrer avec un message de version, mettre Node à jour.
- **Git** : `git --version`
- Une **connexion internet** (polices Google Fonts, carte Leaflet, imagerie NASA GIBS, fond OpenStreetMap).

### Étapes
**Windows, le plus simple :** double-cliquer sur `LANCER.bat` (il installe puis ouvre le site).

**Ou en ligne de commande :**
```
git clone https://github.com/wagueduclair-byte/DOUALA-EARTH-WATCHER.git
cd DOUALA-EARTH-WATCHER
git switch react-web
npm install
npm run dev
```
Ouvrir ensuite **http://localhost:5173** dans le navigateur. Arrêter avec `Ctrl + C`.

Autres commandes : `npm run build` (version de production dans `dist/`), `npm run preview` (tester cette version).

### Problèmes fréquents
| Symptôme | Solution |
|---|---|
| `node` ou `npm` introuvable | Installer Node.js, puis **fermer et rouvrir** le terminal |
| Erreur de version de Node | Installer la dernière version LTS |
| Page blanche | Ouvrir la console du navigateur (F12) et envoyer l'erreur à l'équipe |
| Carte grise ou vide | Vérifier internet ; changer la date dans le panneau de la carte (nuages) |
| Port 5173 occupé | Vite propose un autre port : utiliser l'adresse affichée dans le terminal |

## 2. Structure

| Fichier | Rôle |
|---|---|
| `src/App.jsx` | Navigation et écrans : Aperçu, Carte, Indicateurs, Tendances, Limites, Sources |
| `src/charts.jsx` | Graphiques SVG interactifs : série temporelle, cycle saisonnier, anomalies, bandes annuelles |
| `src/data.js` | Données de démonstration (`series()`), métadonnées des indicateurs, **calculs statistiques** |
| `src/mapHtml.js` + `src/MapEmbed.jsx` | Carte Leaflet : imagerie NASA GIBS ou plan OpenStreetMap, couches de cellules |
| `src/theme.js` + `src/styles.css` | **Charte graphique** (couleurs, polices) |
| `index.html` | Page d'entrée, chargement des polices |

## 3. Méthode statistique (réellement implémentée)
1. Moyenne par mois (climatologie), puis **anomalies** (valeur − moyenne du même mois) pour retirer la saisonnalité.
2. **Pente de Theil-Sen** sur les anomalies, avec **intervalle de confiance à 95 %**.
3. **Test de Mann-Kendall** (seuil 0,05). Limites : pas de correction d'autocorrélation ni de valeurs ex æquo.
4. « Aucune tendance détectable » **ne prouve pas** l'absence de changement.

## 4. Brancher les vraies données (avant la soumission)
1. Produire (script Python, notebook…) une série **mensuelle** par indicateur et par zone : **132 valeurs, janvier 2015 → décembre 2025**, sans trou (ou documenter le traitement des valeurs manquantes).
2. Dans `src/data.js`, faire renvoyer ces valeurs par `series(k, z)` (par exemple depuis un fichier JSON). Statistiques et graphiques se mettent à jour seuls.
3. Dans `src/mapHtml.js`, remplacer les fonctions `f` de `CFG` (valeurs fictives) par les cellules réelles ; appliquer un **masque terre/eau** (estuaire du Wouri).
4. Remplacer les **emprises** des zones (tableau `Z` dans `mapHtml.js`) par les limites définies par l'équipe.
5. Renseigner « Sources » : dates d'accès, versions, résolutions confirmées dans la documentation NASA.
6. Retirer les bandeaux « MAQUETTE · valeurs fictives » **uniquement** quand les vraies données sont en place.

Règle : **aucun chiffre inventé dans la version finale.**

## 5. Charte graphique
Source : **NASA Space Apps Brand Guidelines** (25 juin 2026), https://www.spaceappschallenge.org/brand
- Couleurs : Deep Blue `#07173F`, Electric Blue `#0042A6`, Neon Blue `#0960E1`, Blue Yonder `#2E96F5`, Rocket Red `#E43700`, Martian Red `#8E1100`, Neon Yellow `#EAFE07` (accent, jamais en fond).
- Polices : **Fira Sans** (titres), **Overpass** (texte).
- Règles appliquées : texte sur blanc ou bleu foncé, contraste ≥ 4,5:1, jamais la couleur seule pour porter un sens.
- Approximation à vérifier : « Slate Gray » et les gris de fond n'ont pas de valeur dans le guide extrait.
- **Logo** : à télécharger sur la page /brand ; ne pas le redessiner ni le recolorer.

## 6. Limites connues
- Données fictives ; zones et emprises approximatives ; pas de masque terre/eau.
- Imagerie GIBS à 250 m : floue à l'échelle d'un quartier ; certaines dates sont nuageuses ou indisponibles.
- Pas de version anglaise, pas de lien carte ↔ graphique.
- Vérifier les conditions d'usage des fonds de carte avant diffusion large.

## 7. Travailler en équipe
- Ne pas travailler directement sur `main` : `git switch -c ma-branche`.
- Commits courts, en français : `git commit -m "Ajoute la page Tendances"`.
- Avant de commencer : `git pull`. Pour partager : `git push`, puis une **Pull Request** relue par un autre membre.
- Ne jamais committer `node_modules/`, `dist/`, mots de passe ni clés.

## 8. Équipe
**Chefs d'équipe** : Brian · Leroy Foko
**Membres** : Yann Raïs D.M · Foko Jorel · Nguela Tchigea Brayane Daryl · Kenmatsa Wague Josdrel Duclair

## 9. Crédits
- Données visées : NASA GPM IMERG (précipitations), MODIS MOD11 (température de surface), MODIS MOD13 (NDVI) — résolutions à confirmer dans la documentation officielle.
- Imagerie : NASA EOSDIS GIBS / Worldview (MODIS Terra). Plan : © contributeurs OpenStreetMap. Cartographie : Leaflet.
- NASA Space Apps Challenge 2026 : https://www.spaceappschallenge.org/2026/
