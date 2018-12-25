class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this._gameObjects = [];

        this.keyboard = new Keyboard();
        this.keyboard.keys(Config.keys.pause, () => this.togglePause());
    }

    load() {
        this.score = 0;

        this.addObject(new StarField(this.canvas, 200));
        this.addObject(new Hills(this.canvas));
        this.addObject(new Hud(this));

        this.loadPlayer();

        this.loadNextWave();
    }

    loadPlayer() {
        this.player = new Player(this);
        this.addObject(this.player);
    }

    loadNextWave() {
        if (this.currentWaveIndex == undefined) {
            this.currentWaveIndex = -1;
        }

        this.currentWaveIndex++;

        var config = Config.enemies[this.currentWaveIndex % Config.enemies.length]
        var ai = new Ai[config.ai](this);

        this.enemy = new Wave(config, ai, config.colors.length);
        this.addObject(this.enemy);
    }

    pause() {
        if (this.isPaused) {
            return;
        }

        this.isPaused = true;

        this.pauseMessage = new Message(this, 'Game Paused');
        this.addObject(this.pauseMessage);
    }

    unpause() {
        if (!this.isPaused) {
            return;
        }

        this.isPaused = false;
        this.wasPaused = true;

        this.pauseMessage.kill();
    }

    togglePause() {
        this.isPaused ? this.unpause() : this.pause();
    }

    getElapsed(timeStamp) {
        if (this.wasPaused) {
            this.lastTimeStamp = timeStamp;
            this.wasPaused = false;
            return 0;
        }

        if (!this.lastTimeStamp) {
            this.lastTimeStamp = timeStamp;
        }

        var elapsed = timeStamp - this.lastTimeStamp;
        this.lastTimeStamp = timeStamp;

        return elapsed;
    }

    update(timeStamp) {
        requestAnimationFrame(ts => this.update(ts)); // request next frame

        if (!this.isPaused) {
            var elapsed = this.getElapsed(timeStamp);

            for (var i = 0; i < this._gameObjects.length; i++) {
                var gameObject = this._gameObjects[i];
                if (!gameObject.isDead) {
                    gameObject.update(this, elapsed, timeStamp);
                }
            }
        }

        this.collectTheDead();
        this.getCollisions().forEach(i => {
            i.first.collide(this, i.second);
            i.second.collide(this, i.first);
        })

        this.canvas.draw(this._gameObjects);
    }

    addObject(gameObject) {
        if (this._gameObjects.hasId(gameObject)) {
            return; // Already added.
        }

        this._gameObjects.push(gameObject);
    }

    scoreObject(gameObject) {
        if (gameObject.pointValue) {
            this.score += gameObject.pointValue;
        }

        this.addObject(new Score(gameObject, gameObject.pointValue));
    }

    killObject(gameObject) {
        this.addObject(new Explosion(gameObject, 200));
        gameObject.isDead = true;

        if (gameObject instanceof Player) {
            setTimeout(() => this.loadPlayer(), 1000);
        }
    }

    removeObject(gameObject) {
        this._gameObjects.removeId(gameObject.id);
    }

    getCollisions() {
        var collisions = [];

        for (var i = 0; i < this._gameObjects.length; i++) {
            for (var j = i + 1; j < this._gameObjects.length; j++) {
                var first = this._gameObjects[i];
                var second = this._gameObjects[j];

                if (!first.isSolid || !second.isSolid) {
                    continue;
                }

                if (first.collidesWith(second)) {
                    collisions.push({
                        first: first,
                        second: second
                    })
                }
            }
        }

        return collisions;
    }

    collectTheDead() {
        this._gameObjects.filter(object => !object || !!object.isDead).forEach(object => this.removeObject(object));      
    }

    static build(canvas) {
        var game = new Game(canvas);
        game.load();

        requestAnimationFrame(ts => game.update(ts)); // request next frame

        return game;
    }
}

class GameObject {
    constructor() {
        this.id = GameObject.nextId++;

        this.isDead = false;
    }

    kill() {
        this.isDead = true;
    }

    collidesWith(other) {
        return false;
    }

    update(game, elapsed, timeStamp) { }

    draw(ctx) { }

    collide(game, other) { }
}

GameObject.nextId = 0;

class InirtialGameObject extends GameObject {
    constructor(image, width, height) {
        super();

        if (image) {
            this._sprite = new Sprite(image, 0, 0, width, height);
        } else {
            this._sprite = { x: 0, y: 0, width: width, height: height }
        }

        this.maxVelocityX = 5000.0;
        this.maxVelocityY = 2.0;
        this.attenuation = 1.0;

        this.accelerationX = 0.0;
        this.accelerationY = 0.0;

        this.velocityX = 0.0;
        this.velocityY = 0.0;

        this.isSolid = true;

        this.x = 100;
        this.y = 100;

        this.alpha = 1;
    }

    get x() {
        return this._sprite.x;
    }

    set x(value) {
        this._sprite.x = value;
    }

    get y() {
        return this._sprite.y;
    }

    set y(value) {
        this._sprite.y = value;
    }

    get width() {
        return this._sprite.width;
    }

    set width(value) {
        this._sprite.width = value;
    }

    get height() {
        return this._sprite.height;
    }

    set height(value) {
        this._sprite.height = value;
    }

    collidesWith(other) {
        if (!other instanceof InirtialGameObject) {
            return false;
        }        

        return (this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y);
    }

    update(game, elapsed, timeStamp) {
        this.velocityX += this.accelerationX * elapsed / 1000.0;
        this.velocityY += this.accelerationY * elapsed / 1000.0;

        this.velocityX = Math.constrain(this.velocityX, -this.maxVelocityX, this.maxVelocityX);
        this.velocityY = Math.constrain(this.velocityY, -this.maxVelocityY, this.maxVelocityY);

        this.x += this.velocityX * elapsed / 1000.0;
        this.y += this.velocityY * elapsed / 1000.0;

        if (this.x < -this.width) {
            this.x = game.canvas.width + this.width;
        }

        if (this.x > game.canvas.width + this.width) {
            this.x = -this.width;
        }

        this.y = Math.constrain(this.y, 0, game.canvas.height - this.height);
    }

    draw(ctx) {
        ctx.save();
        this._sprite.opacity = this.alpha;
        
        if (this._sprite.draw) {
            this._sprite.draw(ctx);
        }
        ctx.restore();
    }
}
