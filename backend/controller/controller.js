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
        wishlist: user.wishlist,
        cart: user.cart || [],
        addresses: user.addresses || []
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
    if (!req.session.user) {
        return res.status(401).json({ message: "Non autorisé." });
    }

    const { carId, quantity } = req.body;
    const users = readJSON(filePath);
    const user = users.find(u => u.id === req.session.user.id);

    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const item = user.cart.find(item => item.carId === carId);
    if (item) {
        item.quantity += quantity;
    } else {
        user.cart.push({ carId, quantity });
    }

    writeJSON(filePath, users);
    updateSessionUser(req.session, user);

    res.status(200).json({ message: "Ajouté au panier.", cart: user.cart });
};

exports.updateCart = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non autorisé." });
    }

    const { carId, quantity } = req.body;
    const users = readJSON(filePath);
    const user = users.find(u => u.id === req.session.user.id);

    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    const item = user.cart.find(item => item.carId === carId);
    if (item) {
        item.quantity = quantity;
    }

    writeJSON(filePath, users);
    updateSessionUser(req.session, user);

    res.status(200).json({ message: "Panier mis à jour.", cart: user.cart });
};

exports.removeFromCart = (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non autorisé." });
    }

    const { carId } = req.body;
    const users = readJSON(filePath);
    const user = users.find(u => u.id === req.session.user.id);

    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    user.cart = user.cart.filter(item => item.carId !== carId);

    writeJSON(filePath, users);
    updateSessionUser(req.session, user);

    res.status(200).json({ message: "Article retiré du panier.", cart: user.cart });
};

exports.getPanier = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/connect');
    }

    const user = getCurrentUser(req.session);
    const brandCarData = readJSON(brandCarPath);

    const panier = user.cart.map(item => {
        let foundCar = null;

        for (const brand in brandCarData) {
            for (const carName in brandCarData[brand]) {
                const car = brandCarData[brand][carName];
                if (car.id.toString() === item.carId.toString()) {
                    foundCar = {
                        id: car.id,
                        nom: carName.replace('_', ' '),
                        prix: car.prix,
                        quantity: item.quantity
                    };
                    break;
                }
            }
            if (foundCar) break;
        }

        return foundCar;
    }).filter(item => item); // en cas d'erreur de correspondance

    const total = panier.reduce((acc, item) => acc + (item.prix * item.quantity), 0);

    res.render('panier', { panier, total });
};

exports.toggleWishlist = async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ message: "Non autorisé." });
    }

    const { carId } = req.body;
    const brandCarData = readJSON(brandCarPath);
    const users = readJSON(filePath);
    const user = users.find(u => u.id === req.session.user.id);

    if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé." });
    }

    // Rechercher la voiture dans brandCar.json
    let foundCar = null;
    for (const brand in brandCarData) {
        for (const carName in brandCarData[brand]) {
            const car = brandCarData[brand][carName];
            if (car.id.toString() === carId.toString()) {
                foundCar = {
                    id: car.id,
                    nom: carName.replace('_', ' '),
                    prix: car.prix,
                    imageUrl: car.imageUrl
                };
                break;
            }
        }
        if (foundCar) break;
    }

    if (!foundCar) {
        return res.status(404).json({ message: "Voiture introuvable." });
    }

    const index = user.favoris?.findIndex(f => f.id.toString() === carId.toString()) ?? -1;

    if (index !== -1) {
        // Supprime si déjà en favoris
        user.favoris.splice(index, 1);
        var isFavorite = false;
    } else {
        // Ajoute sinon
        if (!user.favoris) user.favoris = [];
        user.favoris.push(foundCar);
        var isFavorite = true;
    }

    writeJSON(filePath, users);
    updateSessionUser(req.session, user);

    res.status(200).json({ message: "Favoris mis à jour.", isFavorite });
};