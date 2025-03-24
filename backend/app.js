const express = require('express');
const path = require('path');
const app = express();

const routes = require('./routes/route.js');


app.set('views', path.join(__dirname, '../site/views'));
app.set('view engine', 'ejs');
app.use('/', routes);

app.use("/assets", express.static(path.join(__dirname, '../site/assets')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
