const listIdentifiant = [
    {
        email: "",
        mdp: ""
    }
]

exports.getAccueil = async(req, res) => {

    res.render('accueil');
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
    const {email, password} = req.body;
    console.log("login");
    console.log(email);
    console.log(password);
}

exports.setRegister = async (req, res) => {
    const {email, password} = req.body;
    console.log("register");
    listIdentifiant.push({email, mdp: password});
    console.log(listIdentifiant);
    res.json({message: "Accompt create : ", listIdentifiant});
}
