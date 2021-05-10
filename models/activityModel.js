const Datastore = require('nedb');

class ActivityPlanner {

    //call the constructor with the db name for embedded use and without it for in-memory use
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
        } else {
            //in memory 
            this.db = new Datastore();
        }
    }

    //a function to seed the database
    init() {
        this.db.insert({
            subject: 'Running',
            contents: 'I ran 20km outside while listening to music',
            published: '2020-02-16',
            author: 'Peter'
        });

        this.db.insert({
            subject: "Lift Weights",
            contents: 'I went to the gym and did 20 reps and i was very tired afterwards',
            published: '2020-02-18',
            author: 'Ann'
        });
    }

    
    getAllEntries() {
        
        return new Promise((resolve, reject) => {
            
            this.db.find({}, function(err, entries) {
                
                if (err) {
                    reject(err);
                    
                } else {
                    resolve(entries);
                }
            })
        })
    }

    addEntry(author, subject, contents) {

        var entry = {
            author: author,
            subject: subject,
            contents: contents,
            published: new Date().toISOString().split('T')[0]
        }

        this.db.insert(entry, function(err, doc) {
            if (err) {
                console.log('Error inserting document', subject);
            }
        })

    }


    getPetersEntries() {
        return new Promise((resolve, reject) => {
        
            this.db.find({ author: 'Peter' }, function(err, entries) {
                
                if (err) {
                    reject(err);
                    console.log('getPetersEntries promise rejected', err);
                } else {
                    resolve(entries);
                    console.log('getPetersEntries promise resolved with', entries); 
                }
            })
        })
    }

    getAnnsEntries() { 
        return new Promise((resolve, reject) => { 
        this.db.find({ author: 'Ann' }, function(err, entries) { 
    
            if (err) { 
                reject(err); 
                console.log('getAnnsEntries promise rejected', err);
        } else { 
            resolve(entries); 
            console.log('getAnnsEntries promise resolved with', entries); 
        } 
      }) 
    }) 
    }


    getEntriesByUser(authorName) {
        return new Promise((resolve, reject) => {
            this.db.find({ 'author': authorName }, function(err, entries) {
                if (err) {
                    reject(err);
                    console.log('getYourEntries promise rejected', err);
                } else {
                    resolve(entries);
                    console.log('getYourEntries promise resolved with', entries); 
                }
            });
        })
    }


}
//make the module visible outside
module.exports = ActivityPlanner;