/**
 * Created by sam on 15-3-25.
 */


var path = require('path');

var express = require('express');
var packageJson = require('./package.json');

var app = express();

app.use('/static', express.static(path.resolve(__dirname, './public/dist')));

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.get('/', function(req, res, next){
  return res.render('index');
});

app.get('/list', function(req, res, next){
  return res.render('list');
});

app.get('/detail', function(req, res, next){
  return res.render('detail');
});

app.get('/about', function(req, res, next){
  return res.render('about');
});

app.listen(3000);

module.exports = app;