const express = require('express');
const path = require('path');
const app = express();
const routes = require('./routes/routes.js');

const session = require('express-session');

app.use(session({
    secret: 'votre_secret_key_super_securisee', // Mets une vraie clé secrète ici
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // mettre true si tu es en HTTPS
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, '../site/views'));
app.set('view engine', 'ejs');

app.use('/', routes);
app.use("/assets", express.static(path.join(__dirname, '../site/assets')));
app.use('/data', express.static(path.join(__dirname, './data/img')));

const updateBrandCarJson = require('./controller/controller_DB.js');
updateBrandCarJson();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
