const express = require('express');
const router = express.Router();
const controllers = require("../controller/controller.js");

// Pages principales
router.get("/accueil", controllers.getAccueil);
router.get("/car/:id", controllers.getCar);
router.get("/brand/:id", controllers.getBrand);
router.get("/profil", controllers.getProfil);
router.get("/connect", controllers.getConnect);
router.get("/logout", controllers.logout);

// Auth
router.post("/login", controllers.setLogin);
router.post("/register", controllers.setRegister);

// Wishlist
router.post("/wishlist/toggle", controllers.toggleWishlist);

// Cart
router.post("/cart/add", controllers.addToCart);
router.post("/cart/update", controllers.updateCart);
router.post("/cart/remove", controllers.removeFromCart);

module.exports = router;
