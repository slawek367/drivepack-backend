const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const session = require('express-session')
var jwt = require('jsonwebtoken');

const db = require('./db')
const Users = require('./model/users')
const config = require('./config')

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
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/users', (req, res) => {
    Users.find({}, (err, users) => {
        res.send(users);
    })
})

app.post('/users', (req, res) => {
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.name &&
        req.body.surrname) {

        var userData = {
            email: req.body.email,
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 8),
            name: req.body.name,
            surrname: req.body.surrname
        }

        Users.create(userData, function (err, user) {
            if (err) {
                return res.status(400).send({"error": err})
            } else {
                var token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400}) // token expire in 24h
                res.status(200).send({ auth: true, token: token });
            }
        });
    } else {
        res.status(500);
    }
})

app.get('/me', (req, res) => {
    var token = req.headers['x-access-token']
    if (!token) {
        return res.status(401).send({'auth': false, message: 'No token provided'})
    }

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        res.status(200).send(decoded);
    })
})

var server = app.listen(PORT, () => {
    debug('server is running on port', server.address().port);
});
