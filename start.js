// Includec
const http = require('http');
const fs = require('fs');
const lTerrain = require('./Terrain');
const JSON = require('circular-json');
const url = require('url');

// Code
var terrain = new lTerrain.terrain(300, 300, 10);

function intervalFunc() {
    try {
        terrain.move();
    } catch (err) {}
}

function getContentType(url) {
    if (url.endsWith('.ico')) return 'image/x-icon';
    else return 'text/html';
}


setInterval(intervalFunc, 33);

// Server
function manageOperation(req, res) {
    if (req.url.startsWith('/operation/reset')) {
        terrain = new lTerrain.terrain(300, 300, 10);
        res.writeHead(200, "");
        res.end();
    } else if (req.url.startsWith('/operation/addMeal')) {
        terrain.meal.drawMeal(Math.ceil(Math.random() * 3), 1);
        res.writeHead(200, "");
        res.end();
    } else if (req.url.startsWith('/operation/selectNest')) {
        terrain.selectedNest = url.parse(req.url, true).query.nest;
        res.writeHead(200, "");
        res.end();
    }
}

function manageInfoImg(req, res) {
    if (req.url.startsWith('/info/img/full')) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(terrain.draw());
        res.end();
    } else if (req.url.startsWith('/info/img/terrain')) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(terrain.drawTerrain());
        res.end();
    } else if (req.url.startsWith('/info/img/mealAnts')) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(terrain.drawMealAnts());
        res.end();
    } else if (req.url.startsWith('/info/img/meal')) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(terrain.drawMeal());
        res.end();
    } else if (req.url.startsWith('/info/img/ants')) {
        res.writeHead(200, { "Content-Type": "image/png" });
        res.write(terrain.drawAnts());
        res.end();
    }
}

function manageInfoJson(req, res) {
    if (req.url.startsWith('/info/json/general')) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(terrain, replacer));
        res.end();
    } else if (req.url.startsWith('/info/json/nest')) {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.write(JSON.stringify(terrain.antNest[url.parse(req.url, true).query.nest].ants, replacer));
        res.end();
    }
}

var acceptedKeys = [
    "width",
    "height",
    "antNest",
    "terrainWater",
    "meal",
    "points",
    "x",
    "y",
    "color",
    "area",
    "lifeAnts",
    "life",
    "deaths",
    "type",
    ""];

function replacer(key, value) {
    if (acceptedKeys.indexOf(key) >= 0 || !isNaN(key))
        return value;
    return undefined;
}

function manageInfo(req, res) {
    if (req.url.startsWith('/info/img')) {
        manageInfoImg(req, res);
    } else if (req.url.startsWith('/info/json')) {
        manageInfoJson(req, res);
    }
}

http.createServer(function (req, res) {
    if (req.url.startsWith('/operation')) {
        manageOperation(req, res);
    } else if (req.url.startsWith('/info')) {
        manageInfo(req, res);
    } else {
        if (req.url === '/')
            req.url = '/index.html';
        req.url = "server" + req.url;    
        console.log(req.url);
        fs.readFile(req.url, function (err, data) {
            if (err) {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                return res.end("404 Not Found" + err);
            }
            else {
                var contentType = getContentType(req.url);
                res.writeHead(200, { 'Content-Type': contentType });
                res.write(data);
                res.end();
            }
        });
    }
}).listen(8080);