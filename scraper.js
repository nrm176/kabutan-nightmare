/**
 * Created by kojima37 on 2017/03/05.
 */

var express = require('express');
var Nightmare = require('nightmare');

var cheerio = require('cheerio');
var async = require('async');

var app = express();
const port = 8021;
const USER_AGENT = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, likeGecko) Chrome/41.0.2228.0 Safari/537.36';
const CONTENT_TYPE = 'application/json; charset=utf-8'

app.listen(port, function () {
    console.log('server has started on port: ' + port);
});

app.get('/parse', function (req, res) {

    const url = req.query.url;
    var nightmare = Nightmare({show:false})
    nightmare
        .useragent(USER_AGENT)
        .goto(url)
        .wait('.mono')
        .evaluate(function () {
            const title = $('title')[0].innerText;
            const codes = Array.prototype
                .slice.call($('div.mono > a'))
                .map(function(e) { return e.outerText })
                .reduce(function(p, c) {
                    if (p.indexOf(c) < 0) p.push(c);
                    return p;
                }, []);

            return {'title': title, 'codes' : codes};
        })
        .end()
        .then(function (codes) {
            res.header('Content-Type', CONTENT_TYPE);
            res.json(codes);
        })
        .catch(function (error) {
            console.log('Failed due to ', error)
        });
})

// function nightmare_parse(url) {
//     return nightmare
//         .useragent('Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, likeGecko) Chrome/41.0.2228.0 Safari/537.36')
//         .goto(url)
//         .wait('.mono')
//         .evaluate(function () {
//             var title = $('title')[0].innerText;
//
//             return {'title': title, 'codes' : Array.prototype.slice.call($('div.mono > a')).map(function(e) { return e.outerText })};
//         })
//         .end()
//         .then(function (codes) {
//             return codes
//         })
//         .catch(function (error) {
//             console.log('Failed due to ', error)
//         });
// }
