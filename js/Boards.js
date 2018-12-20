class Hud extends GameObject{
    constructor(game) {
        super();
        this.game = game;
        this.canvas = game.canvas;
    }

    draw(ctx) {
        ctx.save();

        ctx.fillStyle = 'silver';
        ctx.font = '20px Arial';
        
        var textBounds = ctx.measureText(this.game.score);
        ctx.fillText(this.game.score, this.canvas.width - textBounds.width - 5, this.canvas.height - 5);

        ctx.restore();
    }
}

class Message extends GameObject {
    constructor(game, messageText) {
        super();
        this.game = game;
        this.messageText = messageText;
    }

    draw(ctx) {
        ctx.save();

        var fontheight = 40;

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = '#AAA';
        ctx.font = '40px Arial';
        
        var textBounds = ctx.measureText(this.value);
        ctx.fillText(this.value, this.game.canvas.width / 2 - textBounds.width / 2, this.game.canvas.height / 2 - fontheight / 2);

        ctx.restore();
    }

}

class Score extends GameObject {
    constructor(origin, value) {
        super();
        this.x = origin.x;
        this.y = origin.y;
        this.value = value;
        this.durration = 1000;
    } 

    update(game, elapsed, timeStamp) {
        if (!this.startTime) {
            this.startTime = timeStamp;
        }

        var totalElapsed = timeStamp - this.startTime;

        this.alpha = 1 - Math.max(1, totalElapsed - 0.7 * this.durration) / (0.3 * this.durration)
        
        if (totalElapsed > this.durration) {
            this.isDead = true;
        }
    }

    draw(ctx) {
        ctx.save();

        ctx.globalAlpha = this.alpha;

        ctx.fillStyle = '#555';
        ctx.font = '10px Arial';
        
        var textBounds = ctx.measureText(this.value);
        ctx.fillText(this.value, this.x - textBounds.width / 2, this.y - 5);

        ctx.restore();
    }
}