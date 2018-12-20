class Effect extends InirtialGameObject {
    constructor() {
        super();
        this.isSolid = false;
    }

    getRandomColor() {
        var letters = '89ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * letters.length)];
        }
        return color;
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
            var rand = Math.random();
            var velocity = 75 + 10 * rand;

            this._stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                velocityX: -velocity,
                color: this.getRandomColor(),
                radius: rand * 0.5
            });
        }
    }

    update(game, elapsed, timeStamp) {
        this._stars.forEach(i => {
            i.x += i.velocityX * elapsed / 1000.0;
        
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
            ctx.fillStyle = i.color;
            ctx.beginPath();
            ctx.arc(i.x, i.y, i.radius, 0, 2 * Math.PI);
            ctx.fill();

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
            var angle = Math.random() * Math.PI * 2;
            var velocity = Math.random() * 100;

            this._particles.push({
                x: 0,
                y: 0,
                velocityX: Math.cos(angle) * velocity,
                velocityY: Math.sin(angle) * velocity,
                color: this.getRandomColor(),
                radius: Math.random() * 2
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