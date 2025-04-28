const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const filePath = path.join(__dirname, '../data/connect.json');
const brandCarPath = path.join(__dirname, '../data/brandCar.json');

// Fonctions utilitaires
function readJSON(file) {
    if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf-8'));
    }
    return [];
}

function writeJSON(file, data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getCurrentUser(session) {
    if (!session.user) return null;
    const allUsers = readJSON(filePath);
    return allUsers.find(u => u.id === session.user.id) || null;
}

function updateSessionUser(session, user) {
    session.user = {
        id: user.id,
        email: user.email,
        wishlist: user.wishlist
    };
}

// Contrôleurs
exports.getAccueil = async (req, res) => {
    try {
        const brandCarData = readJSON(brandCarPath);
        const user = getCurrentUser(req.session);

        res.render('accueil', {
            brandCarData,
            user,
            connect: !!user
        });
    } catch (error) {
        console.error("Erreur lecture brandCar.json:", error);
        res.status(500).send("Erreur serveur.");
    }
};

exports.getCar = (req, res) => {
    const { id } = req.params;
    const numericId = Number(id);

    try {
        const brandCarData = readJSON(brandCarPath);
        const user = getCurrentUser(req.session);

        let foundCar = null;
        let foundBrand = null;

        for (const brand in brandCarData) {
            for (const carKey in brandCarData[brand]) {
                const car = brandCarData[brand][carKey];
                if (car.id === numericId) {
                    foundCar = { ...car, nom: carKey.replace('_', ' ') };
                    foundBrand = brand;
                    break;
                }
            }
            if (foundCar) break;
        }

        if (!foundCar) {
            return res.status(404).send('Voiture non trouvée.');
        }

        const similarCars = Object.entries(brandCarData[foundBrand])
            .filter(([_, car]) => car.id !== numericId)
            .slice(0, 4)
            .map(([key, car]) => ({
                ...car,
                nom: key.replace('_', ' ')
            }));

        res.render('produit', {
            car: foundCar,
            similar: similarCars,
            user,
            connect: !!user
        });
    } catch (err) {
        console.error('Erreur serveur:', err);
        res.status(500).send('Erreur serveur.');
    }
};

exports.getBrand = async (req, res) => {
    const { id } = req.params;
    try {
        const brandCarData = readJSON(brandCarPath);
        const user = getCurrentUser(req.session);
        const carsByBrand = brandCarData[id] || [];

        res.render('brand', {
            cars: carsByBrand,
            user,
            connect: !!user
        });
    } catch (error) {
        res.status(500).send("Erreur serveur.");
    }
};

exports.getProfil = async (req, res) => {
    if (!req.session.user) return res.redirect('/connect');

    const user = getCurrentUser(req.session);
    if (!user) return res.redirect('/connect');

    const brandCarData = readJSON(brandCarPath);
    const favoris = [];

    for (const brand in brandCarData) {
        for (const carName in brandCarData[brand]) {
            const car = brandCarData[brand][carName];
            if (user.wishlist.includes(car.id.toString())) {
                favoris.push({
                    id: car.id,
                    nom: carName.replace('_', ' '),
                    prix: car.prix,
                    imageUrl: car.imageUrl
                });
            }
        }
    }

    res.render('profil', { user, favoris });
};

exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion.");
        }
        res.redirect('/connect');
    });
};

exports.getConnect = async (req, res) => {
    res.render('connect', { connect: !!req.session.user });
};

exports.setLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = readJSON(filePath);
        const user = data.find(u => u.email === email && u.mdp === password);

        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        updateSessionUser(req.session, user);

        res.status(200).json({ message: "Connexion réussie", connect: true, user });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
};

exports.setRegister = async (req, res) => {
    const { email, password } = req.body;
    try {
        const data = readJSON(filePath);
        const userExists = data.find(user => user.email === email);

        if (userExists) {
            return res.status(409).json({ message: "Un compte avec cet email existe déjà." });
        }

        const newUser = {
            id: uuidv4(),
            email,
            mdp: password,
            wishlist: [],
            cart: [],
            addresses: []
        };

        data.push(newUser);
        writeJSON(filePath, data);

        res.status(201).json({ message: "Compte créé avec succès.", email });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
};

exports.toggleWishlist = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non autorisé." });
    }

    const { carId } = req.body;
    try {
        const users = readJSON(filePath);
        const user = users.find(u => u.id === req.session.user.id);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const carIdStr = carId.toString();
        let isFavorite = false;

        if (user.wishlist.includes(carIdStr)) {
            user.wishlist = user.wishlist.filter(id => id !== carIdStr);
            isFavorite = false;
        } else {
            user.wishlist.push(carIdStr);
            isFavorite = true;
        }

        writeJSON(filePath, users);
        updateSessionUser(req.session, user);

        res.status(200).json({ message: "Favoris mis à jour.", isFavorite });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

// Panier

exports.addToCart = (req, res) => {
    res.status(501).json({ message: "addToCart non implémenté." });
};

exports.updateCart = (req, res) => {
    res.status(501).json({ message: "updateCart non implémenté." });
};

exports.removeFromCart = (req, res) => {
    res.status(501).json({ message: "removeFromCart non implémenté." });
};