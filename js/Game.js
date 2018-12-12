class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this._gameObjects = [];
    }

    load() {
        this.keyboard = new Keyboard();

        this.player = new Player(this);
        this.addObject(this.player);

        this.enemy = new Wave(Config.enemies[0], new SwoopAi(this));
        this.addObject(this.enemy);
    }

    getElapsed(timeStamp) {
        if (!this.lastTimeStamp) {
            this.lastTimeStamp = timeStamp;
        }

        var elapsed = timeStamp - this.lastTimeStamp;
        this.lastTimeStamp = timeStamp;

        return elapsed;
    }

    update(timeStamp) {
        requestAnimationFrame(ts => this.update(ts)); // request next frame

        var elapsed = this.getElapsed(timeStamp);

        for (var i = 0; i < this._gameObjects.length; i++) {
            var gameObject = this._gameObjects[i];
            if (!gameObject.isDead) {
                gameObject.update(this, elapsed, timeStamp);
            }
        }

        this.collectTheDead();
        this.getCollisions().forEach(i => {
            i.first.collide(i.second);
            i.second.collide(i.first);
        })

        this.canvas.draw(elapsed);       
    }

    addObject(gameObject) {
        if (this._gameObjects.hasId(gameObject)) {
            return; // Already added.
        }

        this.canvas.addSprite(gameObject.sprite);
        this._gameObjects.push(gameObject);
    }

    removeObject(gameObject) {
        this.canvas.removeSprite(gameObject.sprite);
        this._gameObjects.removeId(gameObject.id);
    }

    getCollisions() {
        var collisions = [];

        for (var i = 0; i < this._gameObjects.length; i++) {
            for (var j = i + 1; j < this._gameObjects.length; j++) {
                var first = this._gameObjects[i];
                var second = this._gameObjects[j];

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
        this._gameObjects.filter(object => !!object.isDead).forEach(object => this.removeObject(object));      
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

    get sprite() {
        return null;
    }

    collidesWith(other) {
        return false;
    }

    update(game, elapsed, timeStamp) { }

    collide(other) { }
}

GameObject.nextId = 0;

class InirtialGameObject extends GameObject {
    constructor(image) {
        super();

        this._sprite = new Sprite(image, 0, 0, 30, 15);

        this.maxVelocityX = 5000.0;
        this.maxVelocityY = 2.0;
        this.attenuation = 1.0;

        this.accelerationX = 0.0;
        this.accelerationY = 0.0;

        this.velocityX = 0.0;
        this.velocityY = 0.0;

        this.x = 100;
        this.y = 100;
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

    get sprite() {
        return this._sprite;
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
}