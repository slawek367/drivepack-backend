const express = require('express')
const bodyParser = require('body-parser')
const db = require('./db')
const Users = require('./model/users')

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

app.get('/users', (req, res) => {
    Users.find({}, (err, users)=> {
        res.send(users);
    })
})

app.post('/users', (req, res) => {
    var user = new Users(req.body);
    user.save((err) => {
        if (err){
            res.sendStatus(500);
        }
        res.sendStatus(200);
    })
})

var server = app.listen(PORT, () => {
    debug('server is running on port', server.address().port);
});
