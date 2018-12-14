
class Enemy extends Ship {
    constructor(image, ai) {
        super(image);

        this.ai = ai;
        this.ai.init(this);
    }

    update(game, elapsed, timeStamp) {
        super.update(game, elapsed, timeStamp);
        this.ai.update(this, elapsed, timeStamp);
    }
}

class Wave extends GameObject{
    constructor(config, ai, shipCount) {
        super();
        this.ships = config.colors.map(image => new Enemy(image, ai));
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
        
        if (!this.initialTime) {
            this.initialTime = timeStamp;
        }

        var totalElapsed = timeStamp - this.initialTime;

        for (var i = this.activeShips.length; i < this.ships.length; i++) {
            if ((totalElapsed - this.launchDelay) / this.launchIteration > i) {
                var ship = this.ships[i];
                game.addObject(ship);
                this.activeShips.push(ship);
            }
        }

        if (!this.ships.some(i => !i.isDead)) {
            this.isDead = true;
            game.loadNextWave();
        }

        this.activeShips.forEach(i => i.update(game, elapsed, timeStamp));
    }
}
