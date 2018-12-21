
$(function() {
    var canvas = new Canvas(document.getElementById('canvas'), {
        background: 'black',
        foreground: 'white',
        scaleHeight: 480
    });

    var game = Game.build(canvas);

    window.addEventListener('blur', () => {
        if (!game.isPaused) {
            game.pause();
        }
    });

});