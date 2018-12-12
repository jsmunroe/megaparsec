class Ship extends InirtialGameObject {
    constructor(image) {
        super(image);
    }

    collide(other) {
        this.isDead = true;
    }
}

class Ai {
    constructor(game) {
        this.game = game;
    }

    init(ship) {
        ship.x = this.game.canvas.width + ship.width;

        var zoneHeight = this.game.canvas.height * 0.7;
        var zoneTop = (this.game.canvas.height - zoneHeight) / 2.0;

        ship.y = zoneTop + (Math.random() * zoneHeight);
        ship.velocityX = -100.0;
        ship.maxVelocityY = 100.0;
        ship.accelerationX = -0.01;
    }

    update(ship, elapsed, timeStamp) {
        if (elapsed % 10 == 0) {
            ship.velocityY += Math.random() * 100.0 - 50.0;
        }
    }
}

class SwoopAi {
    constructor(game) {
        this.game = game;
    }

    init(ship) {
        ship.swooping = true;

        var zoneLeft = this.game.canvas.width * 0.7;
        var zoneWidth = this.game.canvas.width - zoneLeft;
        ship.x = zoneLeft + (Math.random() * zoneWidth);
        ship.initialY = ship.y = -ship.height * 2.0;

        var zoneHeight = this.game.canvas.height * 0.7;
        var zoneTop = (this.game.canvas.height - zoneHeight) / 2.0;
        ship.targetY = zoneTop + (Math.random() * zoneHeight);

        ship.initialVelocityY = ship.velocityY = 200.0;
        ship.initialVelocityX = -200.0;
        ship.maxVelocityY = 200.0;
        ship.maxVelocityX = 100.0;
        ship.accelerationX = -0.01;
    }

    update(ship, elapsed, timeStamp) {
        if (ship.swooping) {
            var percentToTarget = (ship.y - ship.initialY) / (ship.targetY - ship.initialY);
            ship.velocityY = (1 - percentToTarget) * ship.initialVelocityY;
            ship.velocityX = percentToTarget * ship.initialVelocityX;
            
            if (Math.abs(ship.y - ship.targetY) < 1) {
                ship.swooping = false;
            }

        } else if (elapsed % 10 == 0) {
            ship.velocityY += Math.random() * 100.0 - 50.0;
        }

    }
}