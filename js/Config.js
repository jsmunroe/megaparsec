var Config = {
    player: {
        image: './img/player.png',
        shot: './img/player.shot.png'
    },
    enemies: [
        {
            name: 'Enemy 1',
            ai: 'swoop',
            colors: [
                './img/enemy1.blue.png',
                './img/enemy1.cyan.png',
                './img/enemy1.green.png',
                './img/enemy1.magenta.png',
                './img/enemy1.orange.png'
            ]
        },{
            name: 'Enemy 2',
            ai: 'target',
            colors: [
                './img/enemy2.blue.png',
                './img/enemy2.cyan.png',
                './img/enemy2.green.png',
                './img/enemy2.magenta.png',
                './img/enemy2.red.png'
            ]
        },{
            name: 'Enemy 3',
            ai: 'swoop',
            colors: [
                './img/enemy3.blue.png',
                './img/enemy3.cyan.png',
                './img/enemy3.green.png',
                './img/enemy3.magenta.png',
                './img/enemy3.red.png'
            ]
       }
    ],
    keys: {
        pause: ['KeyP', 'Pause']
    }
}
