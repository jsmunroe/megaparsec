
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
    constructor(config, ai) {
        super();
        this.ships = config.colors.map(image => new Enemy(image, ai));
        this.activeShips = [];

        this.launchDelay = 1000.0; // 1 second.
        this.launchIteration = 2000.0; // 2 seconds.
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

        this.activeShips.forEach(i => i.update(game, elapsed, timeStamp));
    }
}
