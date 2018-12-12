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

    onKeyDown(event) {
        var handlers = this.handlers.filter(i => i.keyCode === event.code);

        for (var i = 0; i < handlers.length; i++) {
            handlers.callback(event);
        }

        this.currentKeys[event.code] = true;
    }

    onKeyUp(event) {
        this.currentKeys[event.code] = false;
    }

}

