const sauceModel = require('../models/sauce');
const fs = require('fs');
const jwt = require('jsonwebtoken');

// Vérifier que l'user qui modifie ou supprime la sauce en est bien l'auteur
function checkingUser(req, userId){
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.RANDOM_TOKEN_SECRET);
    const tokenUserId = decodedToken.userId;
    if (userId == tokenUserId) {
      return true
    }
    else {
      return false
    }
};


exports.getAllSauces = (req, res, next) => {
    sauceModel.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({error: error}))
};

exports.getOneSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(err => res.status(404).json({error: err}))
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const _sauce = new sauceModel({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get("host")}/pictures/${ req.file.filename }`
    });
    
    _sauce.save()
    .then( () => res.status(201).json({ message: "Sauce créée avec succès !" }))
    .catch( (err) => res.status(400).json({ err }))
};

exports.modifySauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id })
    .then(data => {
        if (!checkingUser(req, data.userId)){
            return res.status(403).json({ message : "Action non autorisée" })
        }

        var newSauce;        
        if (req.file) {
            /* Seulement si l'image est modifiée */
            newSauce = {   
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/pictures/${req.file.filename}`
            }
        }
        else {
            newSauce = { ...req.body }
        }

        sauceModel.updateOne({ _id: req.params.id }, { ...newSauce, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }))
    });
};

exports.deleteSauce = (req, res, next) => {
    sauceModel.findOne({ _id: req.params.id }) 
    .then((data) => {
        if (!checkingUser(req, data.userId)) {
            return res.status(403).json({message : "Action non autorisée"})
        }
        const filename = data.imageUrl.split("/pictures/")[1]; // On récupère le nom du fichier image dans l'URL
        
        fs.unlink(`pictures/${filename}`, () => {
            sauceModel.deleteOne({ _id: req.params.id })
            .then(res.status(200).json({ message: "Sauce supprimée !" }))
            .catch((error) => res.status(400).json({ error }));
        });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.reactSauce = (req, res, next) => {
    const userId = req.body.userId;
    const like = req.body.like;         // Envoie -1, 0 ou 1
    const sauceId = req.params.id;

    /*
        Utilisation des opérateurs de mise à jour de MongoDB : $inc, $push et $pull
        https://www.mongodb.com/docs/manual/reference/operator/update-array/
    */

   sauceModel.findOne({ _id : sauceId }) //Renvoie un document qui satisfait les critères de requête spécifiés sur la collection ou la vue
    .then((data) => {
        if (!data.usersLiked.includes(userId) && like === 1){
          // Si l'utilisateur n'est pas dans la liste {usersLiked} et qu'il ajoute un LIKE
          sauceModel.updateOne({ _id : sauceId }, {
              $inc: { likes: 1 },             // $inc :  incrémente
              $push: { usersLiked: userId }   // $push : ajoute un élément à un tableau.
          })
          .then(() => res.status(201).json({ message: "Like +1" }))
          .catch((error) => res.status(400).json({ error }));
        };

        if (data.usersLiked.includes(userId) && like === 0){
          // Si l'utilisateur est dans la liste {usersLiked} et qu'il enlève son LIKE
          sauceModel.updateOne({ _id : sauceId }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: userId }   // $pull : supprime un élément d'un tableau
          })
          .then(() => res.status(201).json({ message: "Like 0" }))
          .catch((error) => res.status(400).json({ error }));
        };

        if (!data.usersDisliked.includes(userId) && like === -1){
          // Si l'utilisateur n'est pas dans la liste {usersDisliked} et qu'il ajoute un DISLIKE
          sauceModel.updateOne({ _id : sauceId }, {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: userId }
          })
          .then(() => res.status(201).json({ message: "DisLike +1" }))
          .catch((error) => res.status(400).json({ error }));
        };

        if (data.usersDisliked.includes(userId) && like === 0){
          // Si l'utilisateur est dans la liste {usersDisliked} et qu'il enlève son DISLIKE
          sauceModel.updateOne({ _id : sauceId }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: userId }  
          })
          .then(() => res.status(201).json({ message: "DisLike -1" }))
          .catch((error) => res.status(400).json({ error }));
        };
    })      
    .catch((error) => res.status(404).json({error}));
};