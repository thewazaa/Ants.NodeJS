var Canvas = require('canvas');

exports.Ant = class {
    constructor(x, y, terrain, antNest, color) {
        this.x = x;
        this.y = y;
        this.centerX = x;
        this.centerY = y;
        this.terrain = terrain;
        this.antNest = antNest;
        this.color = color;
        this.meal = 0;
        this.direction = Math.random() * 2 * Math.PI;
        this.notWorryDistance = 0;
        this.learned = 0;
        this.life = 300;
        this.notComeBack = 0;
        this.type = "workerAnt";
    }

    lossLife() {
        this.life--;
        if (this.life <= 0 || this.meal > 10) {
            if (this.meal > 0) {
                this.meal--;
                this.life = 100;
                if (this.meal <= 0) {
                    this.life += this.meal * 100;
                    this.meal = 0;
                    this.direction += Math.PI;
                }
            } else {
                this.terrain.meal.addDeathAnt(this.x, this.y);
                this.antNest.removeAnt(this);
            }
        }
    }

    increaseWorrySome() {
        if (this.notWorryDistance > 0)
            this.notWorryDistance--;
        if (this.learned > 0)
            this.learned--;
    }

    teachDirection() {
        if (this.meal === 0 && this.learned === 0)
            return;
        for (var i = 0; i < this.antNest.ants.length; i++) {
            if ((this.antNest.ants[i].meal == 0 && this.antNest.ants[i].learned == 0) && this.getQuadraticDistance(this.x, this.y, this.antNest.ants[i].x, this.antNest.ants[i].y) <= 4) {
                this.antNest.ants[i].direction = this.direction - Math.PI;
                this.antNest.ants[i].learned = (this.meal != 0) ? 10 : this.learned;
            }
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

    moveCheckReachNest(r) {        
        if (Math.sqrt(r) <= this.antNest.radiusMeal && this.meal > 0 && this.antNest.area > this.antNest.radiusMeal) {
            this.antNest.meal += this.meal - 1;
            this.meal = 0;
            this.direction += Math.PI;
            this.learned = 30;
            this.life += 100;
            if (this.antNest.meal < 0) {
                this.life += this.antNest.meal * 100;
                this.antNest.meal = 0;
            }
            this.notWorryDistance = 0;
            this.notComeBack = 0;
        }
    }

    moveRandomizeDirectionALittle() {
        if ((this.meal == 0 && this.learned == 0) || this.notWorryDistance || this.notComeBack > 0)
            this.direction += -Math.PI / 32 + Math.random() * Math.PI / 16;
    }

    moveCheckTooFar(r) {
        if (this.notWorryDistance > 0) {
            var r2 = this.getQuadraticDistance(this.centerX, this.centerY, this.oldX, this.oldY);
            if (r2 < r) {
                this.direction += -Math.PI / 32 + Math.random() * Math.PI / 16;
            }
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

    moveFindMeal() {
        if (this.meal >= 5 && this.life > 100)
            return;
        var meal = this.terrain.meal.getMealAlpha(this.x, this.y);
        if (meal != 0) {
            var tmp = meal / 255;
            if (tmp > 0)
                this.meal += tmp;
            else
                this.meal += .5;
            this.notComeBack += 2;
            this.mealColor = 'rgb(' + this.terrain.meal.getMealRed(this.x, this.y) + ',' + this.terrain.meal.getMealGreen(this.x, this.y) + ',' + this.terrain.meal.getMealBlue(this.x, this.y) + ')';
        }
        for (var i = 0; i < this.terrain.antNest.length; i++)
            if (this.terrain.antNest[i] !== this.antNest && Math.sqrt(this.getQuadraticDistance(this.x, this.y, this.terrain.antNest[i].x, this.terrain.antNest[i].y)) <= this.terrain.antNest[i].radiusMeal) {
                this.terrain.antNest[i].meal--;
                this.meal++;
                if (this.terrain.antNest[i].meal < 0) {
                    this.meal += this.terrain.antNest[i].meal;
                    this.terrain.antNest[i].meal = 0;
                }
                this.mealColor = this.terrain.antNest[i].color;
            }
    }

    moveComeBack() {
        if (this.meal >= 2 || (this.meal >= 1 && this.notComeBack == 0 && this.notWorryDistance <= 0))
            this.direction = Math.atan2(this.centerY - this.y, this.centerX - this.x);
        if (this.notComeBack > 0)
            this.notComeBack--;
    }

    move() {
        try {
            this.lossLife();
            this.increaseWorrySome();
            this.teachDirection();
            this.saveOldPosion();

            this.x = this.x + Math.cos(this.direction);
            this.y = this.y + Math.sin(this.direction);

            this.moveChechLimits();
            this.moveFindMeal();
            this.moveComeBack();
            this.moveCheckWater();

            var r = this.getQuadraticDistance(this.centerX, this.centerY, this.x, this.y);

            this.moveCheckReachNest(r);
            this.moveCheckTooFar(r);
            this.moveRandomizeDirectionALittle();
        } catch (ex) { console.log(ex);}
    }

    draw(ctx) {
        var r = Math.sqrt(this.life / (100 * Math.PI));
        if (r < 1)
            r = 1;
        if (r > 4)
            r = 4;

        if (this.meal > 0) {
            var r2 = Math.sqrt(this.meal / Math.PI);
            if (r2 < r)
                r2 = r + 1;
            ctx.globalAlpha = .5;
            ctx.fillStyle = this.mealColor;
            ctx.beginPath();
            ctx.arc(this.x, this.y, r2, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        if (r == 1) {
            ctx.fillRect(this.x, this.y, 1, 1);
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, r, 0, 2 * Math.PI);
            ctx.fill();
        }        
    }
}
