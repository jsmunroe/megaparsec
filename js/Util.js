Array.prototype.hasId = function(id) {
    return this.some(i => i.id === id);
}

Array.prototype.removeId = function(id) {
    var i = this.length;
    while (i--) {
        if (this[i] && this[i].id === id) {
            this.splice(i, 1);
        }
    }
}

Array.prototype.removeWhere = function(predicate) {
    for (var i = this.length - 1; i >= 0; i--) {
        if (predicate(this[i], i)) {
            this.splice(i, 1);
        }
    }
};

Math.constrain = function(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

Math.halfPI = Math.PI * 0.5;

class Keyboard {
    constructor() {
        this.handlers = [];
        this.currentKeys = [];

        var self = this;
        window.document.addEventListener('keydown', event => self.onKeyDown(event));
        window.document.addEventListener('keyup', event => self.onKeyUp(event));
    }

    up(callback) {
        return this.key('ArrowUp', callback);
    }

    down(callback) {
        return this.key('ArrowDown', callback);
    } 

    left(callback) {
        return this.key('ArrowLeft', callback);
    }

    right(callback) {
        return this.key('ArrowRight', callback);
    }

    key(keyCode, callback) {
        if (callback) {
            this.handlers.push({
                keyCode: keyCode,
                callback: callback
            })
        }

        return !!this.currentKeys[keyCode];
    }

    keys(keyCodes, callback) {
        if (!keyCodes.length) {
            return this.key(keyCodes, callback);
        }

        var allPressed = true;
        for (let i = 0; i < keyCodes.length; i++) {
            allPressed = allPressed && this.key(keyCodes[i], callback);
        }

        return allPressed;
    }

    onKeyDown(event) {
        var handlers = this.handlers.filter(i => i.keyCode === event.code);

        for (var i = 0; i < handlers.length; i++) {
            handlers[i].callback(event);
        }

        this.currentKeys[event.code] = true;
    }

    onKeyUp(event) {
        this.currentKeys[event.code] = false;
    }

}

class Random {
    static getBetween(min, max) {
        return (max - min) * Random.next() + min;
    }

    static getIntBetween(min, max) {
        return Math.floor(this.getBetween(min, max));
    }

    static next(factor) {
        return Math.random() * (factor || 1);
    } 

    static nextInt(upperBound) {
        return Math.floor(Math.random() * (upperBound || 10));
    }
}

class Color {
    static lum(color, percent) {   
        var f=parseInt(color.slice(1),16)
        var t=percent<0?0:255;
        var p=percent<0?percent*-1:percent
        var R=f>>16;
        var G=f>>8&0x00FF;
        var B=f&0x0000FF;

        return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
    }
}

