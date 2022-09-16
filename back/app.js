/* Facilite l'utilisation de l'objet http (déclaré dans server.js) */
const express = require("express");
const app = express();

/* Sécurisation des headers */
const helmet = require("helmet"); 
app.use(helmet());

/* Permet d'intercepter les variables d'environnement du projet (données sensibles) */
require("dotenv").config();  


/* Facilite les interactions avec la base de données NoSql */
const mongoose = require("mongoose");

/* CONNECTION MONGODB */
mongoose
.connect
(
  `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PWD}@${process.env.DB_CLSTR}.mongodb.net/?retryWrites=true&w=majority`
)
.then(() => console.log("Connection à MongoDB réussie !"))
.catch(() => console.log("Connection à MongoDB échouée !"));


/* Met à disposition l'intégralité de la réponse d'une requête ayant une entête json */
app.use(express.json()); 

/* Contourne la limitation CORS pour tout type de requêtes */
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "same-site");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});

/* Définition des routes principales */
const routeUser = require("./routes/user");
const routeSauces = require("./routes/sauce");
app.use("/api/auth", routeUser);
app.use("/api/sauces", routeSauces);

/* Fournit de nombreuses fonctionnalités très utiles pour accéder et interagir avec le système de fichiers */
const path = require("path"); 
app.use("/pictures", express.static(path.join(__dirname, "/pictures")));

module.exports = app;