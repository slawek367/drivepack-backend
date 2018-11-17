const mongoose = require('mongoose')
const debug = require('debug')('http')
    , http = require('http')
    , name = 'drivepack';

var dbUrl = 'mongodb://127.0.0.1:27017/2pack_db'
mongoose.connect(dbUrl, { useNewUrlParser: true }, (err) => {
    debug('Connected to database...')
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {});
mongoose.Promise = global.Promise;

