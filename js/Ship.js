class Ship extends InirtialGameObject {
    constructor(image) {
        super(image);
    }



    collide(game, other) {
        game.killObject(this);
        this.isDead = true;
    }
}

class Shot extends InirtialGameObject {
    constructor(origin, image, direction) {
        super(image, 25, 3);

        this.x = origin.x,
        this.y = origin.y + origin.height / 2 - this.height / 2; 
        this.velocityX = direction * 1000.0;
    }

    update(game, elapsed, timeStamp) {
        if (this.x > game.canvas.width || this.y < -this.width) {
            this.isDead = true;
        }

        super.update(game, elapsed, timeStamp);
    }

    collide(game, other) {
        if (other instanceof Player) {
            return;
        }

        if (other.pointValue) {
            game.scoreObject(other);
        }
        
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

    updateWave(wave, elapsed, timeStamp) {
        if (!wave.initialTime) {
            wave.initialTime = timeStamp;
        }

        var totalElapsed = timeStamp - wave.initialTime;

        for (var i = wave.activeShips.length; i < wave.ships.length; i++) {
            if ((totalElapsed - wave.launchDelay) / wave.launchIteration > i) {
                var ship = wave.ships[i];
                this.game.addObject(ship);
                wave.activeShips.push(ship);
            }
        }

        if (!wave.ships.some(i => !i.isDead)) {
            wave.isDead = true;
            this.game.loadNextWave();
        }
    }
}

class SwoopAi extends Ai {
    constructor(game) {
        super(game)
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
Ai.swoop = SwoopAi;

class TargetAi extends Ai {
    constructor(game) {
        super(game)
        this.game = game;
        this.getTarget = () => game.player;
        this.lateralVelocity = 50.0;

        this.enteringPhase = 'entering'; 
    }

    init(ship) {
        var zoneTop = this.game.canvas.height * 0.15;
        var zoneHeight = this.game.canvas.height - zoneTop * 2;
        ship.x = this.game.canvas.width + ship.width;
        ship.y = zoneTop + Random.next(zoneHeight);

        ship.velocityX = -200;
        ship.maxVelocityY = 200;
        ship.velocityY = 0;
        ship.phase = 'entering';
    }

    update(ship, elapsed, timeStamp) {

        if (ship.phase == 'entering') {
            if (ship.x <= this.game.canvas.width - 100.0) {
                ship.phase = 'targetting';
                ship.velocityX = 0;
            }

            return;
        }

        if (ship.phase == 'targetting') {
            var target = this.getTarget();
            if (Math.abs(ship.y - target.y) < 2) {
                ship.velocityY = 0;
                ship.velocityX = -100;
                ship.shoot(this.game, timeStamp);
            } else if (ship.y < target.y) {
                ship.velocityY = this.lateralVelocity;
                ship.velocityX = 0;
            } else if (ship.y > target.y) {
                ship.velocityY = -this.lateralVelocity;
                ship.velocityX = 0;
            }

            return;
        }

    }

    updateWave(wave, elapsed, timeStamp) {
        if (!wave.ships.some(i => !i.isDead)) {
            wave.isDead = true;
            this.game.loadNextWave();
            return;
        }

        if (!wave.activeShips.some(i => !i.isDead)) {
            var ship = wave.ships[wave.activeShips.length];
            this.game.addObject(ship);
            wave.activeShips.push(ship);
        }
    }
}

Ai.target = TargetAi;