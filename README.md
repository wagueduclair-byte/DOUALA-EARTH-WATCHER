# Douala Earth Watchers

Maquette interactive d'un tableau de bord environnemental pour **Douala (Cameroun)**, réalisée pour le **NASA Space Apps Challenge 2026**.
Elle présente, pour la zone de Bonamoussadi et deux zones de comparaison, l'évolution des **précipitations**, de la **température de surface** et de la **végétation (NDVI)** entre 2015 et 2025, avec les limites d'interprétation.

> ⚠️ **ÉTAT ACTUEL : MAQUETTE.** Toutes les valeurs (courbes, cartes, statistiques) sont **fictives**. Elles servent à valider le design et la structure. Aucune conclusion scientifique ne doit en être tirée. Voir la section « Brancher les vraies données ».

Technologies : Expo / React Native (une seule base de code pour le web et le téléphone), `react-native-svg` (graphiques), Leaflet + OpenStreetMap (carte, dans une WebView / iframe).

---

## 1. Lancer le projet chez vous (pas à pas)

### Prérequis
- **Node.js version LTS** : https://nodejs.org . Vérifier dans un terminal : `node -v` (doit afficher un numéro de version).
- **Git** : `git --version`.
- Une **connexion internet** (la carte charge Leaflet et le fond OpenStreetMap).
- Pour tester sur téléphone : l'application **Expo Go** (App Store / Google Play), le téléphone et l'ordinateur sur le **même Wi-Fi**.

### Étapes
1. Récupérer le dépôt :
   ```
   git clone git@github.com:wagueduclair-byte/DOUALA-EARTH-WATCHER.git
   cd DOUALA-EARTH-WATCHER
   ```
2. Installer les dépendances :
   ```
   npm install
   ```
   Si `react-native-svg`, `react-native-webview`, `react-dom`, `react-native-web` ou `@expo/metro-runtime` manquent, ou en cas d'avertissement de version :
   ```
   npx expo install react-native-svg react-native-webview react-dom react-native-web @expo/metro-runtime
   ```
3. Démarrer :
   ```
   npx expo start
   ```
4. Ouvrir l'application :
   - **Navigateur (ordinateur)** : appuyer sur la touche **w** dans le terminal.
   - **Téléphone** : scanner le QR code avec Expo Go (iOS : appareil photo ; Android : depuis Expo Go).

### Problèmes fréquents
| Symptôme | Solution |
|---|---|
| Le QR code ne fonctionne pas | `npx expo start --tunnel` |
| Écran blanc ou ancienne version | `npx expo start -c` (vide le cache) |
| Un autre écran que le nôtre s'affiche | Le projet a été créé avec un autre modèle : vérifier qu'il n'y a pas de dossier `app/` ; utiliser le modèle `blank` |
| La carte est vide / grise | Vérifier la connexion internet ; ouvrir la console du navigateur (F12) |
| Erreur de module introuvable | Relancer `npm install`, puis la commande `npx expo install ...` ci-dessus |
| Écran rouge d'erreur | Faire une capture complète et l'envoyer à l'équipe avec la commande utilisée |

---

## 2. Structure du code

| Fichier | Rôle |
|---|---|
| `App.js` | Navigation, écrans : Aperçu, Carte, Indicateurs, Tendances, Limites, Sources |
| `theme.js` | **Charte graphique** : couleurs, police, emplacement du logo. Un seul fichier à modifier |
| `data.js` | Données de démonstration (`series()`), métadonnées des indicateurs, **calculs statistiques** |
| `charts.js` | Graphiques : série temporelle, cycle saisonnier, anomalies (interactifs) |
| `mapHtml.js` | Carte Leaflet (fond OpenStreetMap + couches de cellules) |
| `MapEmbed.web.js` / `MapEmbed.native.js` | Affichage de la carte : iframe sur le web, WebView sur téléphone |

Affichage adaptatif : à partir de 900 px de large, menu latéral (ordinateur) ; en dessous, barre d'onglets en bas (téléphone).

## 3. Ce que montre l'application

- **Aperçu** : question centrale, chiffres clés par indicateur, aperçu de la carte, direction du projet.
- **Carte** : couches précipitations (pixel ≈ 0,1°), température (≈ 1 km), NDVI (≈ 250 m) ; légende, échelle, valeur au clic, contours des trois zones.
- **Indicateurs** : choix de l'indicateur, de la zone et de la période ; comparaison de zones ; comparaison 2015–2019 / 2020–2025 ; statistiques.
- **Tendances** : tableau zones × indicateurs, avec rappel que plusieurs tests augmentent le risque de faux positifs.
- **Limites** : limites propres à chaque indicateur ; le « niveau d'attention » est volontairement **non calculé** (aucune prédiction).
- **Sources** : jeux de données, méthode en 7 étapes, références, équipe.

## 4. Méthode statistique (réellement implémentée)

1. Calcul de la **moyenne par mois** (climatologie) puis des **anomalies** (valeur − moyenne du même mois) pour retirer la saisonnalité.
2. **Pente de Theil-Sen** sur les anomalies, avec **intervalle de confiance à 95 %** (méthode des pentes ordonnées).
3. **Test de Mann-Kendall** (seuil 0,05). Limite connue : pas de correction d'autocorrélation ni de valeurs ex æquo.
4. Une tendance « non détectable » **ne prouve pas** l'absence de changement.

## 5. Brancher les vraies données (à faire avant la soumission)

1. Produire (script Python, notebook…) une série **mensuelle** par indicateur et par zone : **132 valeurs, de janvier 2015 à décembre 2025**, sans trou (ou documenter et traiter les valeurs manquantes).
2. Dans `data.js`, remplacer le contenu de `series(k, z)` pour qu'il renvoie ces valeurs (par exemple depuis un fichier JSON importé). Les statistiques et les graphiques se mettent à jour d'eux-mêmes.
3. Dans `mapHtml.js`, remplacer les fonctions `f` de `CFG` (valeurs fictives) par les cellules réelles ; appliquer un **masque terre/eau** (estuaire du Wouri).
4. Remplacer les **emprises** des zones (tableau `Z` dans `mapHtml.js`) par les limites définies et documentées par l'équipe.
5. Renseigner dans « Sources » : dates d'accès, dépôt, versions des produits, résolutions confirmées dans la documentation NASA.
6. Retirer les bandeaux « MAQUETTE · valeurs fictives » **uniquement** quand les vraies données sont en place.

Règle de l'équipe : **aucun chiffre inventé dans la version finale.**

## 5. Charte graphique

Les couleurs de `theme.js` sont **provisoires**. Remplacer par la charte officielle fournie à l'équipe (couleurs, police, règles du logo). Ne pas ajouter de logo NASA sans le fichier officiel et sans respecter ses règles d'usage.

## 6. Limites connues de cette maquette

- Données fictives ; zones et emprises approximatives.
- Pas de masque terre/eau sur les couches de la carte.
- Interface testée en priorité sur navigateur et Expo Go ; pas d'application native publiée (hors périmètre du projet).
- Fond de carte OpenStreetMap : vérifier ses conditions d'usage avant diffusion large.
