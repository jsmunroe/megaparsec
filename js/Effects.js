class Effect extends InirtialGameObject {
    constructor() {
        super();
        this.isSolid = false;
    }

    getRandomColor() {
        var letters = '89ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Random.nextInt(letters.length)];
        }
        return color;
      }

    getRandomShade(base, minShade, maxShade) {
        return Color.lum(base, Random.getBetween(minShade, maxShade));
    }
}

class StarField extends Effect {
    constructor(canvas, starCount) {
        super();
        this.height = canvas.height;
        this.width = canvas.width;

        this.generateStars(starCount);
    }

    generateStars(starCount) {
        this._stars = []

        for (var i = 0; i < starCount; i++) {
            var rand = Random.next();
            var velocity = 0; //75 + 10 * rand;

            this._stars.push({
                x: Random.next(this.width),
                y: Random.next(this.height),
                velocityX: -velocity,
                color: this.getRandomColor(),
                radius: rand * 0.5,
                twinkle: Random.nextInt(5) === 1 ? 0 : 1
            });
        }
    }

    update(game, elapsed, timeStamp) {
        this._stars.forEach(i => {
            i.x += i.velocityX * elapsed / 1000.0;
        
            if (Random.nextInt(500) === 1) {
                i.twinkle = i.twinkle === 0 ? 1 : 0;
            }

            if (i.velocityX < 0 && i.x < -i.radius) {
                i.x = this.width + i.radius;
            } else if (i.velocityX > 0 && i.x > this.width + i.radius) {
                i.x = -i.radius;
            }
        });

    }

    draw(ctx) {
        ctx.save();

        this._stars.forEach(i => {

            if (i.twinkle) {

                ctx.fillStyle = i.color;
                ctx.beginPath();
                ctx.arc(i.x, i.y, i.radius, 0, 2 * Math.PI);
                ctx.fill();

            }

        });

        ctx.restore();
    }
}

class Explosion extends Effect {
    constructor(origin, particleCount) {
        super();
        this.x = origin.x;
        this.y = origin.y;
        this.velocityX = origin.velocityX;
        this.velocityY = origin.velocityY;

        this.durration = 750.0; // Miliseconds

        this.generateParticles(particleCount || 100);
    }

    generateParticles(particleCount) {
        this._particles = [];

        for (var i = 0; i < particleCount; i++) {
            var angle = Random.next(Math.PI * 2);
            var velocity = Random.next(100);

            this._particles.push({
                x: 0,
                y: 0,
                velocityX: Math.cos(angle) * velocity,
                velocityY: Math.sin(angle) * velocity,
                color: this.getRandomColor(),
                radius: Random.next(2)
            });
        }
    }

    update(game, elapsed, timeStamp) {
        if (!this._startingTime) {
            this._startingTime = timeStamp;
        }

        var totalElapsed = timeStamp - this._startingTime;
        this.alpha = 1 - totalElapsed / this.durration;
        this.alpha = Math.min(1, Math.max(0, this.alpha));
        
        if (totalElapsed >= this.durration) {
            this.isDead = true; 
            return;
        }

        this._particles.forEach(i => {
            i.x += (i.velocityX) * elapsed / 1000.0;
            i.y += (i.velocityY) * elapsed / 1000.0;
        });

        this.x += this.velocityX * elapsed / 1000.0;
        this.y += this.velocityY * elapsed / 1000.0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;

        this._particles.forEach(i => {
            var x = this.x + i.x;
            var y = this.y + i.y;

            ctx.fillStyle = i.color;
            ctx.beginPath();
            ctx.arc(x, y, i.radius, 0, 2 * Math.PI);
            ctx.fill();

        });

        ctx.restore();
    }
}

class Hills extends Effect {
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.maxHillHeight = 200;
        this.minHillHeight = 50;
        this.maxHillWidth = 250;
        this.minHillWidth = 150;
        this._hills = [];

        this.generateHills();
    }


    generateHills(hillX) {
        var hillX = hillX || -this.maxHillWidth;

        while (hillX <= this.canvas.width + this.maxHillWidth) {
            var height = Random.getBetween(this.minHillHeight, this.maxHillHeight);
            var width = Random.getBetween(this.minHillWidth, this.maxHillWidth);
            var depth = Random.next(10);
            var velocity = -200 + depth;

            var hill = {
                start: hillX,
                width: width,
                height: height,
                color: this.getRandomShade('#0d1c01', 0.0, 0.1),
                velocity: velocity,
                depth: Random.next(),
            }

            this._hills.push(hill);

            hillX += width;
        }
        
        this.hills
    }


    update(game, elapsed, totalElapsed) {
        var hillsToKeep = [];

        for (let i = 0; i < this._hills.length; i++) {
            const hill = this._hills[i];
            
            if (hill.start + hill.width > 0) {
                hill.start += hill.velocity * elapsed / 1000.0;
                hillsToKeep.push(hill);
            }
        }

        this._hills = hillsToKeep;

        var hillX = -this.maxHillWidth;
        if (this._hills.length) {
            const hill = this._hills[this._hills.length - 1];
            hillX = hill.start + hill.width;
        }

        this.generateHills(hillX);
    }

    draw(ctx) {
        var canvasHeight = this.canvas.height;
        var canvasWidth = this.canvas.width;

        ctx.save();

        var hills = this._hills.slice(0).sort((i, j) => i.depth - j.depth);
        for (let i = 0; i < hills.length; i++) {
            const hill = hills[i];
            
            var fillStyle = ctx.createLinearGradient(hill.start + hill.width * 0.5, canvasHeight - hill.height, hill.start + hill.width * 0.5, canvasHeight + 10)
            fillStyle.addColorStop(0, hill.color);
            fillStyle.addColorStop(1, 'black');

            ctx.beginPath();
            ctx.fillStyle = fillStyle;

            ctx.moveTo(hill.start - hill.width * 0.3, canvasHeight + 10);
            ctx.lineTo(hill.start + hill.width * 0.3, canvasHeight - hill.height * 0.7);
            ctx.arcTo(hill.start + hill.width * 0.5, canvasHeight - hill.height, hill.start + hill.width * 0.7, canvasHeight - hill.height * 0.7, hill.width / 6);
            ctx.lineTo(hill.start + hill.width * 1.3, canvasHeight + 10);

            ctx.fill();
        }
        ctx.restore();
    }
}