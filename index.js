const express = require('express');
const router = require('./routes/activityRoutes');
const path = require('path');
const mustache = require('mustache-express');
const auth = require('./auth/auth');
const session = require('express-session');
const passport = require('passport');

const app = express();

const public = path.join(__dirname, 'public');
console.log('public is:', public);
app.use(express.static('public'));

app.engine('mustache', mustache());
app.set('view engine', 'mustache');

app.use(express.urlencoded({ extended: false }));

app.use(session({ secret: 'dont tell anyone', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

auth.init();

app.use('/', router);

app.listen(8000, () => {
    console.log('Server started on port 8000. Ctrl^c to quit.');
   
});