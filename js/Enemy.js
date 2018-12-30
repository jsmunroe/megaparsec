
class Enemy extends Ship {
    constructor(image, ai) {
        super(image);

        this.pointValue = 200;

        this.shootInterval = 1000;
        this.lastShot = 0;

        this.ai = ai;
        this.ai.init(this);
    }

    shoot(game, timeStamp) {
        if (timeStamp - this.lastShot > this.shootInterval) {
            game.addObject(new EnemyShot(this));
            this.lastShot = timeStamp;
        }
    }

    update(game, elapsed, timeStamp) {
        super.update(game, elapsed, timeStamp);
        this.ai.update(this, elapsed, timeStamp);
    }

    collide(game, other) {
        if (other instanceof EnemyShot == false && !this.isInvulnerable) {
            super.collide(game, other);
        }
    }
}

class EnemyShot extends Shot {
    constructor(origin) {
        super(origin, Config.player.shot, -2);
    }

    collide(game, other) {
        if (other instanceof Enemy) {
            return;
        }

        super.collide(game, other);
    }
}

class Wave extends GameObject{
    constructor(config, ai, shipCount) {
        super();
        this.ai = ai;
        this.activeShips = [];

        this.launchDelay = 1000.0; // 1 second.
        this.launchIteration = 2000.0; // 2 seconds.

        this.generateShips(config, ai, shipCount)
    }

    generateShips(config, ai, shipCount) {
        this.ships = []
        for (var i = 0; i < shipCount; i++) {
            var image = config.colors[i % config.colors.length];
            this.ships.push(new Enemy(image, ai));
        } 
    }

    update(game, elapsed, timeStamp) {
        super.update(game, elapsed, timeStamp);
        
        this.ai.updateWave(this, elapsed, timeStamp);

        this.activeShips.filter(i => !i.isDead).forEach(i => i.update(game, elapsed, timeStamp));
    }
}
