// Include
var Canvas = require('canvas');
var fs = require('fs');

// Class
exports.meal = class {
    constructor(terrain) {
        this.terrain = terrain;
        this.generating = 0;

        this.generateMeal();
    }

    generateMeal() {
        this.generateMealImage();
    }

    generateMealImage() {
        this.canvas = new Canvas(this.terrain.width, this.terrain.height);
        this.ctx = this.canvas.getContext('2d');
        this.data = this.ctx.getImageData(0, 0, this.terrain.width, this.terrain.height);

        this.ctx.globalAlpha = 1;
        
        for (var i = 1; i <= 4; i++)
            this.drawMeal(i, -1);
    }

    drawMeal(_i, total) {
        var sc = this;
        this.generating++;
        fs.readFile('splash' + _i + '.png', function (err, data) {
            sc.drawMealCallback(err, data, total);
        });
    }

    drawMealCallback(err, data, total) {
        if (err) throw err;

        var img = new Canvas.Image;
        img.src = data;

        if (total < 0)
            total = 4 + 6 * Math.random();

        for (var i = 0; i < total; i++) {
            var x = -this.terrain.width/2 + 2 * this.terrain.width * Math.random();
            var y = -this.terrain.height /2 + 2 * this.terrain.height * Math.random();
            var x2 = -this.terrain.width /2 + 2 * this.terrain.width * Math.random();
            var y2 = -this.terrain.height /2 + 2 * this.terrain.height * Math.random();

            this.ctx.globalAlpha = .5;
            this.ctx.drawImage(img, x, y, x2 - x, y2 - y);
            this.ctx.globalAlpha = 1;
        }
        this.drawMealWaterLimit();

        this.data = this.ctx.getImageData(0, 0, this.terrain.width, this.terrain.height);

        this.generating--;
    }

    drawMealWaterLimit() {
        this.ctx.globalCompositeOperation = "destination-out";
        this.terrain.terrainWater.draw(this.ctx);
        this.ctx.globalCompositeOperation = "over";
    }

    draw(ctx) {
        try {
            if (this.data !== null && this.ctx != null)
                this.ctx.putImageData(this.data, 0, 0);
            ctx.drawImage(this.canvas, 0, 0);
        } catch (e) {}
    }

    getMeal(x, y, i) {
        var index = 4 * (Math.floor(y) * this.terrain.width + Math.floor(x));
        var tmp = this.data.data[index + i];
        this.data.data[index + i] = 0;
        return tmp;
    }

    getMealRed(x, y) {
        return this.getMeal(x, y, 0);
    }

    getMealGreen(x, y) {
        return this.getMeal(x, y, 1);
    }

    getMealBlue(x, y) {
        return this.getMeal(x, y, 2);
    }

    getMealAlpha(x, y) {
        return this.getMeal(x, y, 3);
    }

    addDeathAnt(x, y) {
        var index = 4 * (Math.floor(y) * this.terrain.width + Math.floor(x));
        this.data.data[index + 0] = 255;
        this.data.data[index + 1] = 255;
        this.data.data[index + 2] = 255;
        this.data.data[index + 3] = 128;
    }
};