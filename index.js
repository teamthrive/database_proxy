// var express = require('express');
// var app = express();
// var bodyParser = require('body-parser');
// var request = require('request');

// app.set('port', (process.env.PORT || 8081));
// app.use(express.static(__dirname + '/'));

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
//   });

// app.use(bodyParser.urlencoded({extended: false}));
// app.use(bodyParser.json());

// // This responds with "Hello World" on the homepage
// app.get('/', function (req, res) {
//    res.render('index.html');   
// })

// // This responds a POST request for the homepage
// app.post('/', function (req, res) {
//     console.log("POST request to Eventbrite Oauth2.0");
//     var post_json = req.body;

//     var post_urlencoded = "code=" + post_json['code'] 
//     + "&client_secret=" + "NEJTS4O4YOKRPCVP2IT5DEWPH44Q2JKMQQMMPM5X4FSLDR7IIM"
//     + "&client_id=" + "URU55POLUBEJYWBHQF"
//     + "&grant_type=authorization_code";

//     request.post({
//         headers: { 'Content-type' : 'application/x-www-form-urlencoded' },
//         url: 'https://www.eventbrite.com/oauth/token',
//         body: post_urlencoded
//     }, 
//     function(error, response, body){
//         var token = JSON.parse(body)['access_token'];
//         // console.log("Access Token: " + token);
//         res.send(JSON.parse(body)); 
//     });
// })

// var server = app.listen(app.get('port'), function () {
//    console.log("Example app listening at port ", app.get('port'));
// })

const express = require('express');
const path = require('path');
// const http = require('http');
const app = express();
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require("body-parser");


app.set('port', (process.env.PORT || 8081));
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());

var db;
var conString = "mongodb://teamthrive:teamthrive123@ds044907.mlab.com:44907/thrive_signups"
/**
 * Models 
 */

var User = mongoose.model(
    "User", {
        firstName: String,
        lastName: String,
        email: String
    }
)

mongoose.connect(conString, (err, database) => {
    console.log("DB is connected");
    if(err) {
      console.error(err);
    }
    db = database;
    saveData("deploy", "1", "2@3.com")
})

function saveData(fn, ln, em, st, wt, ai) {
  var userObject = {
      firstName: fn,
      lastName: ln,
      email: em,
      state: st,
      workType: wt,
      annualIncome: ai
  }
  var user = new User(userObject);
  user.save();
}

// Angular DIST output folder
// app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}) );

app.all("/*", function(req, res, next){
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  next();
});
// Send all other requests to the Angular app
app.get('/', function (req, res) {
   res.render('index.html');   
})

app.post('/', cors(), (req, res) => {
  console.log('Got a POST request!');
  var contact = req.body;
  var firstName = contact['firstname'];
  var lastName = contact['lastname']
  var email = contact['email'];
  var state = contact['state'];
  var workType = contact['workType'];
  var annualIncome = contact['annualIncome'];

  saveData(firstName, lastName, email, state, workType, annualIncome);
});

//Set Port
var server = app.listen(app.get('port'), function () {
   console.log("Example app listening at port ", app.get('port'));
})


//Options
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
