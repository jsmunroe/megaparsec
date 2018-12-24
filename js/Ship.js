class Ship extends InirtialGameObject {
    constructor(image) {
        super(image);
    }

    collide(game, other) {
        game.killObject(this);
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

        ship.y = zoneTop + Random.next(zoneHeight);
        ship.velocityX = -100.0;
        ship.maxVelocityY = 500.0;
        ship.accelerationX = -0.01;
    }

    update(ship, elapsed, timeStamp) {
        if (elapsed % 10 == 0) {
            ship.velocityY += Random.next(100) - 50;
        }
    }
}

class SwoopAi {
    constructor(game) {
        this.game = game;
    }

    init(ship) {
        ship.swoopingPhase = 0;
        ship.swoopingStyle = Random.nextInt(3); // 0=swoop, 1=bounce, 2=loop

        var zoneLeft = this.game.canvas.width * 0.7;
        var zoneWidth = this.game.canvas.width - zoneLeft;
        ship.x = zoneLeft + Random.next(zoneWidth);
        ship.initialY = ship.y = -ship.height * 2.0;

        if (ship.swoopingStyle === 0) {
            var zoneHeight = this.game.canvas.height * 0.7;
            var zoneTop = (this.game.canvas.height - zoneHeight) / 2.0;
            ship.targetY = zoneTop + Random.next(zoneHeight);   

            ship.initialVelocityY = ship.velocityY = 200.0;
            ship.targetVelocityX = -200.0;
            ship.maxVelocityY = 200.0;
            ship.accelerationX = -0.01;

        } else if (ship.swoopingStyle == 1) {
            this.bounceDistance = 100;
            this.bounceJolt = 300;
            
            var zoneHeight = (this.game.canvas.height - this.bounceDistance) * 0.7;
            var zoneTop = (this.game.canvas.height - zoneHeight) / 2.0;
            ship.targetY = zoneTop + Random.next(zoneHeight);  
            
            ship.velocityY = 200.0;
            ship.velocityX = -150.0;
            ship.maxVelocityY = 200.0;
            ship.maxVelocityX = 500.0;
            ship.initialVelocityX = -100.0;
            ship.targetVelocityX = -200.0;
            ship.accelerationX = -0.01;

        } else if (ship.swoopingStyle === 2) {
            this.loopRadius = 100;

            var zoneHeight = (this.game.canvas.height - this.loopRadius) * 0.7;
            var zoneTop = (this.game.canvas.height - zoneHeight) / 2.0;
            ship.targetY = zoneTop + Random.next(zoneHeight);  
            
            ship.velocityY = 200.0;
            ship.velocityX = -150.0;
            ship.maxVelocityY = 200.0;
            ship.maxVelocityX = 200.0;
            ship.targetVelocityX = -200.0;
       }
    }

    update(ship, elapsed, timeStamp) {
        if (ship.swoopingStyle === 0 && ship.swoopingPhase == 0) {
            var percentToTarget = (ship.y - ship.initialY) / (ship.targetY - ship.initialY);
            ship.velocityY = (1 - percentToTarget) * ship.initialVelocityY;
            ship.velocityX = percentToTarget * ship.targetVelocityX;
            
            if (Math.abs(ship.y - ship.targetY) < 1) {
                ship.swoopingPhase = 1;
            }
        } else if (ship.swoopingStyle === 1) {
            if (ship.swoopingPhase == 0) {
                if (ship.y >= (ship.targetY + this.bounceDistance)) {
                    ship.yAfterPhase0 = ship.y;
                    ship.velocityYAfterPhase0 = ship.velocityY = -300;
                    ship.velocityX = ship.targetVelocityX + -this.bounceJolt;
                    ship.swoopingPhase = 1;
                }
            } else if (ship.swoopingPhase == 1) {
                var percentToTarget = (ship.y - ship.targetY) / (ship.yAfterPhase0 - ship.targetY);
                ship.velocityY = (percentToTarget) * ship.velocityYAfterPhase0;
                ship.velocityX = ship.targetVelocityX + -this.bounceJolt * (percentToTarget);

                if (Math.abs(ship.y - ship.targetY) < 1) {
                    ship.swoopingPhase = 2;
                }
            }
        } else if (ship.swoopingStyle === 2) {
            if (ship.swoopingPhase == 0) {
                if (ship.y >= ship.targetY) {
                    ship.swoopingPhase = 1;
                    ship.loopCenterX = ship.x + this.loopRadius;
                    ship.loopCenterY = ship.y;
                }
            } else if (ship.swoopingPhase == 1) {
                var velocity = Math.sqrt(ship.velocityX * ship.velocityX + ship.velocityY * ship.velocityY);
                var angleToCenter = Math.atan2(ship.loopCenterY - ship.y, ship.loopCenterX - ship.x);
                var targetAngle = angleToCenter + Math.halfPI;
                var targetVelocityX = Math.cos(targetAngle) * velocity;
                var targetVelocityY = Math.sin(targetAngle) * velocity;

                ship.velocityX = targetVelocityX;
                ship.velocityY = targetVelocityY;

                if (ship.velocityX < 0 && Math.abs(ship.velocityY) < 20)
                {
                    ship.velocityY = 0;
                    ship.swoopingPhase = 2;
                }
            }         
        }

        if (elapsed % 10 == 0) {
            ship.velocityY += Random.next(100.0) - 50.0;
        }

    }
}