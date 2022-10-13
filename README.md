[![Netlify Status](https://api.netlify.com/api/v1/badges/c9708338-c41b-47bd-85d7-c60e7ec86516/deploy-status)](https://app.netlify.com/sites/jdbedit-preview/deploys)
[![Crowdin](https://badges.crowdin.net/jdbedit-preview/localized.svg)](https://crowdin.com/project/jdbedit-preview)

# [JdBEdit Preview](https://preview.codewith.wetrafa.xyz)

JdBEdit Preview est une partie de JdBEdit qui permet de lire les fichiers
sauvegardés sur Gist GitHub (via JdBEdit ou pas).

## URLs

Le `[ID]` suivant représente l'identifiant du Gist. Il peut être suivit
d'autres options.

- `/home/`: Page d'accueil de l'application.
- `/?id=[ID]`: Page d'aperçu de fichiers
- `/file/[ID]`: Similaire au point juste au dessus, mais sans paramètre URL.
  Ce chemin renvoie d'ailleurs vers la chemin du point juste au dessus.
- `/edit?id=[ID]`: Redirige vers l'éditeur JdBEdit avec l'id actuel.
- `/[LANG]/home` ou `/home?hl=[LANG]`: Page d'accueil à la langue du code
  `[LANG]` (ex: `fr`, `en`).

## Paramètres supprimés

- `style_md` parce que le markdown est desormais stylé par défaut.
- `exec` entièrement remplacé par `render`.

## Traduction

Vous pouvez aider à traduire l'application en utilisant [Crowdin](https://crwd.in/jdbedit-preview).

Toutes les traductions sont stockées dans le répertoire `/locales`. Vous ne
en aucun cas éditer les fichiers de ce répertoire, si ce n'est les fichiers
`index.js` et `fr.json` qui est la langue source pour les traductions.
