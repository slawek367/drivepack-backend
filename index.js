const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000
const debug = require('debug')('http')
    , http = require('http')
    , name = 'drivepack';

/*
const path = require('path')
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))
*/

var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds029911.mlab.com:29911/drivepack_db`

mongoose.connect(dbUrl, { useNewUrlParser: true, useMongoClient: true }, (err) => {
    debug('connected to db!!! ! ! ! ! ')
})

var UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
  });

var Users = mongoose.model('users', UserSchema)

app.get('/users', (req, res) => {
    Users.find({}, (err, users)=> {
        res.send(users);
    })
})

app.post('/users', (req, res) => {
    debug(req.body)
    var user = new Users(req.body);
    debug(user)
    user.save((err) => {
        if (err){
            res.sendStatus(500);
        }
        res.sendStatus(200);
    })
})

var server = app.listen(PORT, () => {
    debug('server is running on port', server.address().port);
    debug(dbUrl)
});
