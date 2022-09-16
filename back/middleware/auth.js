const jwt = require('jsonwebtoken');
require("dotenv").config();

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            alert("Merci de vous connecter");
        }
        else {
            /* Décoder l'identifiant-utilisateur (verify) */
            const userId = jwt.verify(req.headers.authorization.split(" ")[1], process.env.RANDOM_TOKEN_SECRET).userId;        
            if (req.body.userId && req.body.userId !== userId) { 
                throw 'Utilisateur non-valide' 
            } 
            else { 
                next()
            }
        }
    } 
    catch {
        res.status(401).json({
            error: new Error('Erreur de requête')
        });
    }
};


