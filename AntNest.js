// Include
var Canvas = require('canvas');
var lAnt = require('./Ant');
var lAntWarrior = require('./AntWarrior');

// Class
exports.antNest = class {
    constructor(x, y, terrain) {
        this.x = x;
        this.y = y;
        this.terrain = terrain;
        this.area = 10 + 30 * Math.random();
        this.color = this.getRndColor();
        this.meal = 5;
        this.lifeAnts = 0;
        this.deaths = 0;
        this.iteration = 0;
        this.death = false;
        this.radiusMeal = 0;

        this.ants = Array();
    }

    getRndColor() {
        var r = 100 + 155 * Math.random() | 0, g = 100 + 155 * Math.random() | 0, b = 100 + 155 * Math.random() | 0;
        return 'rgb(' + r + ',' + g + ',' + b + ')';
    }

    drawLineCleanArea(ctx, color, selection) {
        if (selection) {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = color;
            ctx.lineWidth = 5;
        } else 
            ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.area, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.globalAlpha = 1;
    }

    drawCleanArea(ctx, color, radius) {
        if (radius == null)
            radius = this.area;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2, true);
        ctx.fill();
    }

    drawHole(ctx) {
        if (this.death)
            return;
        this.radiusMeal = Math.sqrt(this.meal / Math.PI);
        if (this.radiusMeal < 3)
            this.radiusMeal = 3;
        if (this.radiusMeal > this.area)
            this.radiusMeal = this.area;
        ctx.globalAlpha = 0.5;
        this.drawCleanArea(ctx, this.color, this.radiusMeal);
        ctx.globalAlpha = 1;
        this.drawCleanArea(ctx, "#000", 2);
    }

    drawAnts(ctx) {
        for (var i = 0; i < this.ants.length; i++)
            this.ants[i].draw(ctx);
    }

    move() {
        this.checkDeath();
        this.generateAnts();

        for (var i = 0; i < this.ants.length; i++)
            this.ants[i].move();
    }

    checkDeath() {
        if (this.meal < 1.75 && this.ants.length == 0 && !this.death) {
            this.death = true;
        }
    }

    generateAnts() {
        this.iteration++;
        if (this.meal >= 1 && this.ants.length < 400 && this.ants.length < (this.area * 20 + this.meal / 100) && this.iteration > (40 - this.area) / (this.meal / 10)) {
            this.meal -= 1;
            this.iteration = 0;
            var cntWorker = 0;
            var cntWarrior = 0;
            for (var i = 0; i < this.ants.length; i++) {
                if (this.ants[i].type == "warriorAnt")
                    cntWarrior++;
                else
                    cntWorker++;
            }
            
            if (cntWorker == 0 || cntWorker * .1 < cntWarrior)
                this.ants[this.ants.length] = new lAnt.Ant(this.x, this.y, this.terrain, this, this.color);
            else
                this.ants[this.ants.length] = new lAntWarrior.AntWarrior(this.x, this.y, this.terrain, this, this.color);
        }
        this.lifeAnts = this.ants.length;
    }

    removeAnt(ant) {
        this.ants.splice(this.ants.indexOf(ant), 1);
        this.lifeAnts = this.ants.length;
        this.deaths++;
    }
};