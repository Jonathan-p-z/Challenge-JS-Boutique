const listIdentifiant = [
    {
        email: "",
        mdp: ""
    }
]
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../data/connect.json');


exports.getAccueil = async(req, res) => {
    res.render('accueil', { connect: false });
}

exports.getCar = async(req, res) => {

}

exports.getBrand = async(req, res) => {

}

exports.getProfil = async(req, res) => {

}

exports.getConnect = async(req, res) => {

    res.render('connect');
}

exports.setLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log("login", email, password);

    try {
        const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf-8')) : [];

        const user = data.find(user => user.email === email && user.mdp === password);

        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }
        res.status(200).json({ message: "Connexion réussie", connect: true });

    } catch (error) {
        console.error("Erreur lors du login :", error);
        res.status(500).json({ message: "Erreur serveur lors de la connexion." });
    }
}

exports.setRegister = async (req, res) => {
    const { email, password } = req.body;

    console.log("register", email, password);

    try {
        // Lire les identifiants actuels
        const data = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath)) : [];

        // Vérifier si l'email existe déjà
        const userExists = data.find(user => user.email === email);
        if (userExists) {
            return res.status(409).json({ message: "Un compte avec cet email existe déjà." });
        }

        // Ajouter le nouvel utilisateur
        data.push({ email, mdp: password });

        // Écrire dans le fichier
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        res.status(201).json({ message: "Compte créé avec succès.", email });
    } catch (error) {
        console.error("Erreur lors de l'enregistrement :", error);
        res.status(500).json({ message: "Erreur serveur lors de l'inscription." });
    }
}
