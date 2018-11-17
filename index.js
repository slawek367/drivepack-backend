const express = require('express')
const mongoose = require('mongoose')
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
var dbUrl = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@ds029911.mlab.com:29911/drivepack_db`

mongoose.connect(dbUrl, (err) => {
    debug('connected to db!!! ! ! ! ! ')
})

var server = app.listen(PORT, () => {
    debug('server is running on port', server.address().port);
    debug(dbUrl)
});
