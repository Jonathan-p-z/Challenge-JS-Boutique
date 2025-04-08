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
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;


}

exports.setRegister = async (req, res) => {
    const {email, password} = req.body;

    console.log(email);
    console.log(password);
}
