const activityplannerDAO = require('../models/activityModel');
const userDao = require('../models/userModel.js');
const db = new activityplannerDAO();
db.init();

exports.post_new_user = function(req, res) {
    const user = req.body.username;
    const password = req.body.pass;
    console.log("register user", user, "password", password);

    if (!user || !password) {
        res.status(401).send('no user or no password supplied');
        return;
    }

    userDao.lookup(user, function(err, u) {
        if (u) {
            res.status(401).send("User exists:");
            return;
        }
        userDao.create(user, password);
        res.redirect('/');
    });


}

exports.activity_calendar = function(req,res) {
    res.redirect('/fitness.html')
}

exports.calculator = function(req,res) {
    res.redirect('/calculator.html')
}

exports.show_user_entries = function(req, res) {
    //extract the author name from the request and log it
    //console.log('filtering request parameter:', req.params.author);

    let user = req.params.author;
    db.getEntriesByUser(user)
        .then((entries) => {
            res.render("entries", {
                "title": "Activity Planner",
                'user': req.user,
                "entries": entries
            });
        })
        .catch((err) => {
            console.log('Error: ')
            console.log(JSON.stringify(err))
        });
}

exports.peters_entries = function(req, res) {
    res.send('<h1>Processing Peter\'s Entries, see terminal</h1>');
    db.getPetersEntries();
}

exports.anns_entries = function(req, res) {
    res.send('<h1>Processing Ann\'s Entries, see terminal</h1>');
    db.getAnnsEntries();
}

exports.landing_page = function(req, res) {
    /*
    //first attempt
    res.render('entries', {
        'title': 'Guest Book'
    });

    //test non-matching tags
    res.render('entries', {
        'heading': 'Guest Book'
    });

    //mustache sections
    res.render("entries",   {        
        'title': 'Guest Book',
        'entries': [{
                'subject': 'A good day out',
                'contents': 'We had a really good time.'
            },
            {
                'subject': 'A good place to be on a rainy day',
                'contents': 'Nice paintings too.'
            },
            {
                'subject': 'Yummy',
                'contents': 'Good food here.'
            }

        ]
    });
 */
    db.getAllEntries().then((list) => {
        res.render('landing_page', {
            'title': 'Activity Planner',
            'entries': list,
            "user": req.user
        });
    }).catch((err) => {
        console.log('promise rejected', err);
    })
}

exports.post_new_entry = function(req, res) {
    //console.log('processing post-new_entry controller');
    if (!req.body.subject || !req.body.contents) {
        res.status(400).send("Entries must have a title and fitness content.");
        return;
    }
    db.addEntry(req.body.author, req.body.subject, req.body.contents);
    res.redirect('/');
}

exports.show_register_page = function(req, res) {
    res.render("register", {
        "title": "Activity Planner"
    });
}

exports.show_login_page = function(req, res) {
    res.render('login', {
        'title': 'Activity Planner'
    })
}


exports.show_new_entries = function(req, res) {
    res.render('newEntry', {
        'title': 'Activity Planner',
        'user': req.user.user
    })
}

exports.post_login = function(req, res) {
    //console.log('serializeUser wrote', req.session.passport.user);
    res.redirect('/');
}

exports.logout = function(req, res) {
    req.logout();
    res.redirect("/");
}

exports.server_error = function(err, req, res, next) {
    res.status(500);
    res.type('text/plain');
    res.send('Internal Server Error.');
}

exports.not_found = function(err, req, res, next) {
    res.status(404);
    res.type('text/plain');
    res.send('We didn\'t find what you were looking for ( ͠° ͟ʖ ͡°).');
}