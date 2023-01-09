const express = require('express');
const path = require('path');
const mainroute = require('./routes/productRoute')
const loginRoute = require('./routes/loginRoute');

const PORT = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs')
app.use('/public', express.static('public'));
app.use(mainroute);
app.use(loginRoute);

app.get('/help', (req, res) => {
    res.render('help')
})

app.get('/*', (req, res) => {
    res.render('404error')
})
app.listen(PORT, () => {
    console.log(`server started on port:${PORT}`)
})