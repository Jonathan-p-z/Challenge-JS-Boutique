const express = require('express');
const router = express.Router();
const controllers = require("../controller/controller.js");

router.get("/accueil", controllers.getAccueil);
router.get("/car/:id", controllers.getCar);
router.get("/bran/:id", controllers.getBrand);
router.get("/profil/:id", controllers.getProfil);
router.get("/connect", controllers.getConnect);
router.get("/login", controllers.setLogin);
router.get("/register", controllers.setRegister);


module.exports = router