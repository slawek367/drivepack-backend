const express = require('express')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt');
const session = require('express-session')
var jwt = require('jsonwebtoken');

const db = require('./db')
const Users = require('./model/users')
const Packages = require('./model/packages')
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

        let userData = {
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
                let token = jwt.sign({id: user.id}, config.secret, {expiresIn: 86400}) // token expire in 24h
                res.status(200).send({ auth: true, token: token });
            }
        });
    } else {
        res.status(500);
    }
})

app.get('/users/me', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) {
        return res.status(401).send({'auth': false, message: 'No token provided'})
    }

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        Users.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) {
                return res.status(500).send("There was a problem finding the user.");
            }
            if (!user) {
                return res.status(404).send("No user found.");
            }
            res.status(200).send(user);
        });;
    })
})

app.post('/login', (req, res) => {
    Users.findOne({email: req.body.email}, function (err, user) {
        if (err){
            return res.status(500).send('Error on the server.')
        }
        if (!user) {
            return res.status(404).send('No user found.');
        }

        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password)
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null})
        }

        let token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24h
        });
        res.status(200).send({auth: true, token: token})
    })
})

app.post('/packages', (req, res) => {
    let token = req.headers['x-access-token']
    if (!token) {
        return res.status(401).send({'auth': false, message: 'No token provided'})
    }

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) {
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        }
        Users.findById(decoded.id, { password: 0 }, function (err, user) {
            if (err) {
                return res.status(500).send("There was a problem with adding a package.");
            }
            if (!user) {
                return res.status(404).send("No user found.");
            }
            req.body.user_id = user._id
            Packages.create(req.body, function (err, package) {
                if (err) {
                    return res.status(400).send({"error": err})
                }
                return res.status(200).send({package: package})
            });
        });;
    })

})

app.get('/packages', (req, res) => {
    Packages.find({}, (err, packages) => {
        res.send(packages);
    })
})

var server = app.listen(PORT, () => {
    debug('server is running on port', server.address().port);
});
