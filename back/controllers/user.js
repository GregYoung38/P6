const bcrypt = require('bcrypt');
const UserModel = require('../models/user');
const mailValidator = require("email-validator");
const passValidator = require("password-validator");
const jwt = require('jsonwebtoken');

require("dotenv").config();             /* Accès aux variables d'environnement */

process.env.RANDOM_TOKEN_SECRET = require('crypto').randomBytes(32).toString('hex');

var schemaPWD = new passValidator();
schemaPWD
    .is().min(8)
    .is().max(20)
    .has().uppercase(1)
    .has().lowercase(1)
    .has().digits(1)
    .has().not().spaces()
    .is().not().oneOf(['Password0000', 'Qwerty12', 'Azerty00', 'Azerty1234']);

exports.create_user = (req, res, next) => {
    if(!mailValidator.validate(req.body.email)) { 
        throw  `Adresse email invalide : ${req.body.email}` 
    }
    else if (!schemaPWD.validate(req.body.password)) { 
        throw  `Mot de passe invalide : ${req.body.password}` 
    }
    else {
        bcrypt.hash(req.body.password, 10)        
        .then(pwd => {
            const user = new UserModel ({
                email: req.body.email,
                password: pwd
            });
            user.save()
            .then(() => res.status(201).json())
            .catch(err => res.status(400).json({ message : 'Erreur de requête' }))
        })
        .catch(() => { return res.status(500).json({ error }) } )
    }    
}

exports.connect_user = (req, res, next) => {
    UserModel.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            /*
                Le mail est absent de la base de données
                Si l'e-mail ne correspond à aucun utilisateur existant, on arrête tout.
            */
            return res.status(401).json({ message : 'Action non-autorisée' });
        }

        /*
            Nous utilisons la fonction compare de bcrypt pour comparer le MOT DE PASSE entré par l'utilisateur 
            avec le hash enregistré dans la base de données.
            Renvoie un booléen.
        */
        bcrypt.compare(req.body.password, user.password) 
        .then(valid => {
            if (!valid) {
                /*  
                    Le mot de passe ne correspond pas au login saisi.
                */
                return res.status(401).json({ message: 'Action non-autorisée' });
            } 

            // Envoi du token avec la réponse attendue du front-end:
            res.status(200).json({
                /*
                    S'ils correspondent, les informations d'identification de l'utilisateur sont valides. 
                    Dans ce cas, je renvoie une réponse 200 contenant l'ID utilisateur et un token.
                */
               
                userId: user._id,
                token: jwt.sign( { userId: user._id }, process.env.RANDOM_TOKEN_SECRET, { expiresIn: '24h' }  )
                    
                /* 
                    Fonction sign de jsonwebtoken => chiffrer un nouveau token.
                    Ce token contient l'ID de l'utilisateur en tant que payload (les données encodées dans le token) :
                    - ID utilisateur
                    - Chiffrage secret
                    - Durée de validité du token limité à 24 heures.
                */
            })
        })
        .catch(error => res.status(401).json({ message : 'Action non-autorisée' }));
    })
    .catch(error => res.status(500).json({ error }));
}