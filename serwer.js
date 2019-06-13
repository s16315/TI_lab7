/*jshint node: true */
'use strict';

var express = require('express');
var app = express();
var session = require('express-session');
var path = require('path');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var baza = require('./db/books');

app.use(session({
    secret: 'xxxyyyzzz',
    resave: false,
  saveUninitialized: true
}));
app.use(morgan('dev'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules/jquery/dist')));

app.get('/genres', function (req, res) {
    var genres = baza().distinct("genre");
    res.json(genres);
});

app.get('/genre/:gen', function (req, res) {
    var books = baza({genre: req.params.gen}).select("title", "author");
    res.json(books);
});
app.get('/lastgenre', function (req, res) {
    var session=req.session;
    res.send(session.lastGenre);
});

app.post('/genre/:gen', function (req, res) {
        var session=req.session;
        session.lastGenre = req.params.gen;
        if (session.username === "admin") {
            if (
                baza.insert({
                    genre: req.params.gen,
                    author: req.body.author,
                    title: req.body.title,
                })
            ) {res.send("bookAdded");}
        }else {res.send("notLoggedIn");}
    }
);

app.post('/login', function (req, res) {
    var session=req.session;
    if (req.body.username === "admin" && req.body.password === "nimda"){
        session.username = "admin";
        res.send("logged");
    }else {
        session.username = "";
        res.send("notLoggedIn");
    }
});


app.listen(3000, function () {
    console.log('Serwer działa na porcie 3000');
});


