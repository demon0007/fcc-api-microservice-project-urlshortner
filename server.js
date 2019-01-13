'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
mongoose.connect(process.env.MONGO_URI)

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.MONGOLAB_URI);

var Schema = mongoose.Schema
var urlShort = new Schema({
  url : {type: String, requiredd: true},
  ref : Number
})

function count() {

    if( typeof count.counter == 'undefined' ) {
        count.counter = 0;
    }
    return count.counter++;
}


  let doneFunc = (err, data) => {
    if (err) console.log(err)
    console.log("Success")
    console.log(data)
  }

var urlDB = mongoose.model('URLDB', urlShort);
app.use(
  bodyParser.urlencoded({extended: false}))
app.post('/api/shorturl/new', (req, res) => {
  // console.log(req.body.url)
  var postURL = req.body.url;
  var query = urlDB.find({url: postURL})
  query.select(['url', 'ref'])
  query.exec((err, result) => {
    if(err) console.log(err)
    console.log("Success")
    console.log(result)
    res.json({})
  })
  return
  let num = count()
  res.json({"original_url":req.body.url,"short_url":num})
  var entry = new urlDB({url: req.body.url, ref: num})
  var createAndSavePerson = function(done) {
    entry.save(function(err, data) {
      if(err) return done(err)
      return done(null , data);
    });
  };
})

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});