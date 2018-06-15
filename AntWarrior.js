var Canvas = require('canvas');

exports.AntWarrior = class {
    constructor(x, y, terrain, antNest, color) {
        this.x = x;
        this.y = y;
        this.meal = 0;
        this.centerX = x;
        this.centerY = y;
        this.terrain = terrain;
        this.antNest = antNest;
        this.color = color;
        this.direction = Math.random() * 2 * Math.PI;
        this.life = 300;
        this.type = "warriorAnt";
    }

    lossLife() {
        this.life--;
        if (this.life <= 0) {
            this.terrain.meal.addDeathAnt(this.x, this.y);
            this.antNest.removeAnt(this);
        }
    }

    getQuadraticDistance(x1, y1, x2, y2) {
        var xx = x1 - x2;
        var yy = y1 - y2;
        return xx * xx + yy * yy;
    }

    saveOldPosion() {
        this.oldX = this.x;
        this.oldY = this.y;
    }

    moveCheckTooFar() {
        var r = this.getQuadraticDistance(this.centerX, this.centerY, this.x, this.y);
        var r2 = this.getQuadraticDistance(this.centerX, this.centerY, this.oldX, this.oldY);
        if (Math.sqrt(r) <= this.antNest.radiusMeal *.75 && this.r < this.r2) {
            this.direction += Math.PI;
            this.x = this.oldX;
            this.y = this.oldY;
            return;
        }
        var r = this.getQuadraticDistance(this.centerX, this.centerY, this.x, this.y);
        if (Math.sqrt(r) > this.antNest.area * 1.5) {
            this.direction += Math.PI;
            this.x = this.oldX;
            this.y = this.oldY;
            return;
        }
    }

    moveChechLimits() {
        if (this.x < 0) {
            this.x = 0;
            this.direction = Math.random() * Math.PI * 2;
        }
        if (this.x >= this.terrain.width) {
            this.x = this.terrain.width - 1;
            this.direction = Math.random() * Math.PI * 2;
        }
        if (this.y < 0) {
            this.y = 0;
            this.direction = Math.random() * Math.PI * 2;
        }
        if (this.y >= this.terrain.height) {
            this.y = this.terrain.height - 1;
            this.direction = Math.random() * Math.PI * 2;
        }
    }

    moveCheckWater() {
        if (this.terrain.terrainWater.checkWater(this.x, this.y)) {
            this.x = this.oldX;
            this.y = this.oldY;
            this.direction = Math.random() * Math.PI * 2;
            this.notWorryDistance += 10;
        }
    }

    moveRandomizeDirectionALittle() {
        this.direction += -Math.PI / 16 + Math.random() * Math.PI / 8;
    }

    moveKillAntsAux(antNest) {
        for (var i = 0; i < antNest.ants.length; i++) {
            if (Math.floor(antNest.ants[i].x) == Math.floor(this.x)
                && Math.floor(antNest.ants[i].y) == Math.floor(this.y)) {
                this.life += antNest.ants[i].meal * 100 + 100;
                antNest.ants[i].life -= 150;
                this.direction = antNest.ants[i].direction - Math.PI;
            }
        }
    }

    moveKillAnts() {
        for (var i = 0; i < this.terrain.antNest.length; i++)
            if (this.terrain.antNest[i] != this.antNest)
                this.moveKillAntsAux(this.terrain.antNest[i]);
    }

    
    move() {
        try {
            this.lossLife();
            this.saveOldPosion();

            this.x = this.x + Math.cos(this.direction);
            this.y = this.y + Math.sin(this.direction);

            this.moveChechLimits();
            this.moveCheckWater();
            this.moveCheckTooFar();
            this.moveKillAnts();
            this.moveRandomizeDirectionALittle();
        } catch (ex) { console.log(ex);}
    }

    draw(ctx) {
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;

        var r = Math.sqrt(this.life / (100 * Math.PI));
        if (r < 2)
            r = 2;
        if (r > 4)
            r = 4;

        ctx.beginPath();
        ctx.arc(this.x, this.y, r, 0, Math.PI);
        ctx.fill();
    }
}
