class Player extends Ship{
    constructor(game) {
        super(Config.player.image);

        this.maxVelocityX = 1000.0;
        this.maxVelocityY = 1000.0;
        this.attenuation = 1.2

        this.shootInterval = 250;
        this.lastShot = 0;

        this.makeInvulnerable = true;

        this.x = 100;
        this.y = 100;
    }

    shoot(game, timeStamp) {
        if (timeStamp - this.lastShot > this.shootInterval) {
            game.addObject(new PlayerShot(this));
            this.lastShot = timeStamp;
        }
    }

    update(game, elapsed, timeStamp) {
        var accelerationX = 1500.0;
        var accelerationY = 1500.0;

        if (this.makeInvulnerable) {
            this.isInvulnerable = true;
            this.invulnerableTimeout = timeStamp + 1000.0;
            this.makeInvulnerable = false;
        }

        if (this.isInvulnerable) {
            this.alpha = (timeStamp % 200.0 < 100) ? 1 : 0;

            console.log(`alpha=${this.alpha}`);

            if (timeStamp > this.invulnerableTimeout) {
                this.alpha = 1;
                this.isInvulnerable = false;
            }
        }

        if ( game.keyboard.key('Space')) {
            this.shoot(game, timeStamp);
        }

        if (game.keyboard.up() || game.keyboard.key('KeyW')) {
            if (this.velocityY > 0) 
                this.velocityY /= this.attenuation;

            this.velocityY -= accelerationY * elapsed / 1000.0;
        } else if (game.keyboard.down() || game.keyboard.key('KeyS')) {
             if (this.velocityY < 0) 
                this.velocityY /= this.attenuation;

           this.velocityY += accelerationY * elapsed / 1000.0;
        } else {
            this.velocityY /= this.attenuation;
        }

        if (game.keyboard.left() || game.keyboard.key('KeyA')) {
            if (this.velocityX > 0) 
                this.velocityX /= this.attenuation;

            this.velocityX -= accelerationX * elapsed / 1000.0;
        } else if (game.keyboard.right() || game.keyboard.key('KeyD')) {
             if (this.velocityX < 0) 
                this.velocityX /= this.attenuation;

           this.velocityX += accelerationX * elapsed / 1000.0;
        } else {
            this.velocityX /= this.attenuation;
        }

        this.velocityX = Math.constrain(this.velocityX, -this.maxVelocityX, this.maxVelocityX);
        this.velocityY = Math.constrain(this.velocityY, -this.maxVelocityY, this.maxVelocityY);

        this.x += this.velocityX * elapsed / 1000.0;
        this.y += this.velocityY * elapsed / 1000.0;

        this.x = Math.constrain(this.x, 0, game.canvas.width - this.width);
        this.y = Math.constrain(this.y, 0, game.canvas.height - this.height);
    }

    collide(game, other) {
        if (other instanceof PlayerShot == false && !this.isInvulnerable) {
            super.collide(game, other);
        }
    }
}

class PlayerShot extends Shot {
    constructor(origin) {
        super(origin, Config.player.shot, +1);
    }

    collide(game, other) {
        if (other instanceof Player) {
            return;
        }

        super.collide(game, other);
    }
}