// Include
var Canvas = require('canvas');

// Class
exports.terrainWater = class {
    constructor(terrain) {
        this.terrain = terrain;

        this.generateWater();
    }

    generateWater() {
        this.points = Array();

        for (var i = 0; i < 3 + 10 * Math.random(20); i++) {
            var x = this.terrain.width * Math.random();
            var y = this.terrain.height * Math.random();

            this.points[i] = { x: x, y: y };
        }

        this.generateWaterImage();
    }

    generateWaterImage() {
        this.canvas = new Canvas(this.terrain.width, this.terrain.height);
        this.ctx = this.canvas.getContext('2d');

        this.drawWater(this.ctx, this.terrain.antNest);
        this.data = this.ctx.getImageData(0, 0, this.terrain.width, this.terrain.height);
    }

    drawWater(ctx, antNest, clean) {
        ctx.fillStyle = 'rgb(53,170,227)';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = 1;

        ctx.strokeStyle = '#FFF';
        ctx.lineWidth = 20;
        this.drawWaterPath(ctx);
        ctx.stroke();
        
        ctx.strokeStyle = 'rgb(53,170,227)';
        ctx.lineWidth = 10;
        this.drawWaterPath(ctx);
        ctx.stroke();        

        this.drawWaterPath(ctx);
        ctx.fill();

        ctx.strokeStyle = '#FFF';
        this.drawAntNestLimit(ctx, antNest, clean);
    }

    drawWaterPath(ctx) {
        ctx.beginPath();
        ctx.moveTo(this.points[0].x, this.points[0].y);

        for (var i = 1; i < this.points.length; i++)
            ctx.lineTo(this.points[i].x, this.points[i].y);
        ctx.closePath();
    }

    drawAntNestLimit(ctx, antNest, clean) {
        if (clean != true) {
            ctx.globalCompositeOperation = "source-atop";
            for (var i = 0; i < antNest.length; i++)
                antNest[i].drawLineCleanArea(ctx, "#FFF", false);
        }
        ctx.globalCompositeOperation = "destination-out";
        for (var i = 0; i < antNest.length; i++)
            antNest[i].drawCleanArea(ctx, "#000");
        ctx.globalCompositeOperation = "source-over";
    }

    draw(ctx) {
        ctx.drawImage(this.canvas, 0, 0);
    }

    checkWater(x, y) {
        var index = 4 * (Math.floor(y) * this.terrain.width + Math.floor(x));
        return this.terrain.terrainWater.data.data[index + 3] != 0;
    }
};