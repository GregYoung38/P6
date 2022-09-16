const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer");

const sauceCtrl = require("../controllers/sauce");


router.get("/", auth, sauceCtrl.getAllSauces);              /* Afficher toutes les sauces */
router.post("/", auth, multer, sauceCtrl.createSauce);      /* Créer une sauce */

router.get("/:id", auth, sauceCtrl.getOneSauce);            /* Afficher une sauce */
router.put("/:id", auth, multer, sauceCtrl.modifySauce);    /* Modifier une sauce */

router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, multer, sauceCtrl.reactSauce);

module.exports = router;