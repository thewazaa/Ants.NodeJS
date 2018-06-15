// Include
var Canvas = require('canvas');
var lAntNest = require('./AntNest');
var lTerrainWater = require('./TerrainWater');
var lMeal = require('./Meal');

// Class
exports.terrain = class {
    constructor(width, height, maxAntNests) {
        this.width = width;
        this.height = height;
        this.maxAntNests = maxAntNests;
        this.selectedNest = -1;

        this.generateTerrain();
    }

    generateTerrain() {
        this.antNest = Array();

        for (var i = 0; i < this.maxAntNests; i++)
            this.antNest[i] = new lAntNest.antNest(Math.floor(this.width * Math.random()), Math.floor(this.height * Math.random()), this);
        this.terrainWater = new lTerrainWater.terrainWater(this);
        this.meal = new lMeal.meal(this);

        this.generateTerrainImage();
    }

    generateTerrainImage() {
        this.canvas = new Canvas(this.width, this.height);
        this.ctx = this.canvas.getContext('2d');

        this.canvasAnts = new Canvas(this.width, this.height);
        this.ctxAnts = this.canvasAnts.getContext('2d');

        this.canvasMeal = new Canvas(this.width, this.height);
        this.ctxMeal = this.canvasMeal.getContext('2d');

        this.canvasMealAnts = new Canvas(this.width, this.height);
        this.ctxMealAnts = this.canvasMealAnts.getContext('2d');

        this.canvasTerrain = new Canvas(this.width, this.height);
        this.ctxTerrain = this.canvasTerrain.getContext('2d');

        this.ctxTerrain.fillStyle = '#222';
        this.ctxTerrain.fillRect(0, 0, this.width, this.height);

        this.terrainWater.draw(this.ctxTerrain);

        for (var i = 0; i < this.antNest.length; i++)
            this.antNest[i].drawCleanArea(this.ctxTerrain, '#333');
    }

    drawTerrain() {
        return this.canvasTerrain.toDataURL('image/png');
    }

    drawMealAnts() {
        this.ctxMealAnts.clearRect(0, 0, this.width, this.height);
        this.meal.draw(this.ctxMealAnts);

        this.drawSelectedNest();

        for (var i = 0; i < this.antNest.length; i++)
            this.antNest[i].drawHole(this.ctxMealAnts);
        for (var i = 0; i < this.antNest.length; i++)
            if (this.selectedNest == -1 || this.selectedNest == i)
                this.antNest[i].drawAnts(this.ctxMealAnts);
        return this.canvasMealAnts.toDataURL('image/png');
    }

    drawMeal() {
        this.ctxMeal.clearRect(0, 0, this.width, this.height);
        this.meal.draw(this.ctxMeal);
        return this.canvasMeal.toDataURL('image/png');
    }

    drawSelectedNest() {
        if (this.selectedNest > -1)
            this.antNest[this.selectedNest].drawLineCleanArea(this.ctxMealAnts, this.antNest[this.selectedNest].color, true);
    }

    drawAnts() {
        this.ctxAnts.clearRect(0, 0, this.width, this.height);

        this.drawSelectedNest();
        for (var i = 0; i < this.antNest.length; i++)
            this.antNest[i].drawHole(this.ctxAnts);
        for (var i = 0; i < this.antNest.length; i++)
            if (this.selectedNest == -1 || this.selectedNest == i)
                this.antNest[i].drawAnts(this.ctxAnts);
        return this.canvasAnts.toDataURL('image/png');
    }

    draw() {
        this.ctx.drawImage(this.canvasTerrain, 0, 0);
        this.meal.draw(this.ctx);

        for (var i = 0; i < this.antNest.length; i++)
            if (this.selectedNest == -1 || this.selectedNest == i)
                this.antNest[i].drawAnts(this.ctx);

        return this.canvas.toBuffer('image/png');
    }

    move() {
        for (var i = 0; i < this.antNest.length; i++)
            this.antNest[i].move();
    }
};