'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');

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

var urlDB = mongoose.model('URLDB', urlShort);

app.post('/api/shorturl/new', (req, res) => {
  
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