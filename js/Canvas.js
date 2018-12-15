class Canvas {
    constructor(canvas, options) {
        this._options = $.extend({
            container: window,
            background: 'white',
            foreground: 'black',
            scaleFactor: 1,
            scaleHeight: null,
            scaleWidth: null,
        }, options)

        this._canvas = canvas;
        this._container = this._options.container || window;

        var self = this;
        this._options.container.addEventListener('resize', event => self.onResize(event));

        this.resizeCanvasElement();
    }

    resizeCanvasElement() {
        this._canvas.width = this._options.container.innerWidth;
        this._canvas.height = this._options.container.innerHeight;

        if (this._options.scaleHeight) {
            this.scaleHeight(this._options.scaleHeight);
        }

        if (this._options.scaleWidth) {
            this.scaleWidth(this._options.scaleWidth);
        }
    }

    onResize(event) {
        this.resizeCanvasElement();
    }

    get width() {
        return this._options.scaleWidth || this._canvas.width / this._options.scaleFactor;
    }

    get height() {
        return this._options.scaleHeight || this._canvas.height / this._options.scaleFactor;
    }

    scaleHeight(height) {
        this._options.scaleHeight = height;
        this._options.scaleFactor = this._canvas.height / height;

        this._options.scaleWidth = null;
    }

    scaleWidth(width) {
        this._options.scaleWidth = width;
        this._options.scaleFactor = this._canvas.width / width;

        this._options.scaleHeight = null;
    }

    draw(drawables) {
        self = this;

        var ctx = this._canvas.getContext('2d');
        ctx.save();

        ctx.scale(this._options.scaleFactor, this._options.scaleFactor);

        ctx.fillStyle = this._options.background;
        ctx.strokeStyle = this._options.foreground;

        ctx.fillRect(0, 0, this.width, this.height) // Clear;

        for (var i = 0; i < drawables.length; i++) {
            var drawable = drawables[i];
            drawable.draw(ctx);
        }

        ctx.restore();
    }
}

class Sprite {
    constructor(imagePath, x, y, width, height) {
        var image = new Image();
        image.src = imagePath;

        Sprite._nextId = Sprite._nextId || 0;

        this.id = Sprite._nextId++;
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || image.width;
        this.height = height || image.height;
        this.opacity = 1.0;

        this.image = image;
    }

    draw(ctx) {
        ctx.save();

        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

        ctx.restore();
    }
}


