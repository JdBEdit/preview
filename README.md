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

## Paramètres supprimés

- `style_md` parce que le markdown est desormais stylé par défaut.
- `exec` entièrement remplacé par `render`.
