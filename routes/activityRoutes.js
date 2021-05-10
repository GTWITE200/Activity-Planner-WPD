const express = require('express');
const router = express.Router();
const controller = require('../controllers/activityControllers');
const auth = require('../auth/auth');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;


router.get('/', controller.landing_page);

router.get('/activity_calendar', ensureLoggedIn('/login'), controller.activity_calendar);

router.get('/calculator', ensureLoggedIn('/login'), controller.calculator);

router.get('/peter', controller.peters_entries);

router.get('/ann', controller.anns_entries);

router.get('/new', ensureLoggedIn('/login'), controller.show_new_entries);

router.post('/new', ensureLoggedIn('/login'), controller.post_new_entry);

router.get('/posts/:author', controller.show_user_entries);

router.get('/about', function(req, res) {
    res.redirect('/about.html');
})

router.get('/login', controller.show_login_page);

router.post('/login', auth.authorize('/login'), controller.post_login);

router.get('/register', controller.show_register_page);

router.post('/register', controller.post_new_user);

router.get('/logout', controller.logout);

router.use(function(req, res) {
    res.status(404);
    res.type('text/plain');
    res.send('404 Not found.');
})

router.use(function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
})

module.exports = router;