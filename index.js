/**
 * Created by sunke on 2015/12/11.
 */
var express = require('express');
var app = express();
var redis = require('redis');
var db = redis.createClient();
app.use(function(req, res, next){
    var ua = req.headers['user-agent'];
    db.zadd('online', Date.now(), ua, next);
});
app.use(function(req, res, next){
    var min = 60 * 1000;
    var ago = Date.now() - min;
    db.zrevrangebyscore('online', '+inf', ago, function(err, users){
        if (err) return next(err);
        req.online = users;
        next();
    });
});




app.set('view engine','jade');
app.listen(3000);

app.get('/', function (req, res) {
    res.render('pages/index',{title:'sunke',movies:[{title:123},{title:222}]});
});

app.get('/redis', function (req, res) {
    res.send(req.online.length + ' users 123 online');
});