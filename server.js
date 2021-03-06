'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
const dns = require('dns')

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
    let counter = Math.random().toFixed(2)*100
    var query = urlDB.find({ref: counter})
    let found = true;
    query.select(['url', 'ref'])
    query.exec((err, result) => {
      if(err) console.log(err)
      if (result.length > 0){
        found = false
        count()
      }
    })
    if (found)
      return counter
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
  let splitURL = postURL.split('.')
  dns.lookup(splitURL[splitURL.length-2]+'.'+splitURL[splitURL.length-1], (err, address, family) => {
    if (err) {
      console.log(err)
      res.json({"error":"invalid URL"})
    } else {
      var query = urlDB.find({url: postURL})
      let num
      query.select(['url', 'ref'])
      query.exec((err, result) => {
        if(err) console.log(err)
        if (result.length > 0){
          console.log(result[0].ref)
          num = result[0].ref
          res.json({"original_url":postURL, "short_url":num})
        } else {
          console.log("Not Found")
          num = count()
          var entry = new urlDB({url: req.body.url, ref: num})
          var createAndSavePerson = function(done) {
            entry.save(function(err, data) {
              if(err) return done(err)
              return done(null , data);
            });
          };
          createAndSavePerson(doneFunc)
          res.json({"original_url":postURL, "short_url":num})
        }
      })
    }
  })
})

app.get('/api/shorturl/:ref', (req, res) => {
  var query = urlDB.find({ref: req.params.ref})
      query.select(['url', 'ref'])
      query.exec((err, result) => {
        if(err) console.log(err)
        if (result.length > 0){
          res.redirect(result[0].url)
        } else {
          res.json({"error":"invalid URL"})
        }
      })
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