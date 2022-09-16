const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

/*  
    La constante "element" , sert à définir une configuration, qui indique à multer 
    où enregistrer les fichiers entrants (destination),
    configure le chemin et le nom de fichier pour les fichiers entrants.
    Le paramètre null indique à multer qu'il n'y a pas d'erreur.
*/
const element = multer.diskStorage({    
    destination: (req, file, callback) => {
        // Où enregistrer les fichiers ?
        callback(null, 'pictures');
    },
    filename: (req, file, callback) => {
        /*  
            Remplacer les espaces vides du nom de fichier original par des underscores.
            Ajout de la date courante à la milliseconde près.
            Ajout de l'extension correspondant à la valeur de l'élément du dictionnaire MIME_TYPES.
        */
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype].toLowerCase();
        const name_only = name.replace(/\.[^/.]+$/, "");
        callback(null, name_only + Date.now() + '.' + extension);
    }
});

/*  
    Exporter l'élément multer entièrement configuré
    Indiquer que nous gérerons uniquement les téléchargements de fichiers image.
    La méthode single() crée un middleware qui capture les fichiers d'un certain type (passé en argument), 
    et les enregistre au système de fichiers du serveur à l'aide de l'élément configuré.
    Pour pouvoir appliquer notre middleware à nos routes, nous devrons les modifier quelque peu, 
    car la structure des données entrantes n'est pas tout à fait la même avec des fichiers et des données JSON.
*/
module.exports = multer({ storage : element }).single('image');