# HOT TAKES : BACK-END
Auteur      : Grégory CALOIN <https://github.com/GregYoung38>
Réalisation : Août/Sept 2022
Editeur     : Visual Studio Code (version 1.71.2)
NodeJS      : Version 16.14.2


# ----- Installation des paquets
Depuis le terminal, installez les dépendances à l'aide de la commande : npm install
En cas de vulnérabilités constatées, utilisez successivement les commandes `npm audit fix` et `npm audit fix --force`

    > Liens utiles concernant les dépendances :
      - helmet                      :   https://connect.ed-diamond.com/MISC/misc-101/vos-entetes-https-avec-helmet
      - express                     :   https://www.npmjs.com/package/express
      - express-rate-limit          :   https://www.npmjs.com/package/express-rate-limit
      - crypto-js                   :   https://www.npmjs.com/package/crypto-js
      - email-validator             :   https://www.npmjs.com/package/email-validator
      - password-validator          :   https://www.npmjs.com/package/password-validator
      - jsonwebtoken                :   https://www.npmjs.com/package/jsonwebtoken (github)
                                        https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/
      - mongoose                    :   https://www.npmjs.com/package/mongoose
      - mongoose-unique-validator   :   https://www.npmjs.com/package/mongoose-unique-validator
      - multer                      :   https://www.npmjs.com/package/multer

 
# ----- Configuration requise
Ajoutez un fichier .env à la racine du dossier `back` et complétez les valeurs pour la connection à votre base MongoDB :

    PORT = 3000
    DB_LOGIN = { votre identifiant sur mon MongoDB }
    DB_PWD = { votre mot de passe sur mon MongoDB }
    DB_CLSTR = { votre cluster sur mon MongoDB }
    RANDOM_TOKEN_SECRET = 0

    NOTA : Les accolades ne font évidemment pas partie des valeurs à saisir.


# ----- Exécution du serveur de développement
Utilisez la commande `npm start` pour lancer le serveur de développement. 
L'application se rechargera automatiquement si vous modifiez le contenu des fichiers-source.


    █████████████████████████████████████████████████████████████████████████████
    ██                                                                         ██
    ██     Ouvrez votre navigateur à l'adresse : http://localhost:3000/        ██
    ██                                                                         ██
    █████████████████████████████████████████████████████████████████████████████