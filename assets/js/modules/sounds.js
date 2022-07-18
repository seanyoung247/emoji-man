/*jshint esversion: 6 */

//all sounds
export var soundfx = {
    gameSong: new Howl({
        src: [
            'assets/sounds/retrorace-108750.ogg',
            'assets/sounds/retrorace-108750.wav'
        ],
        loop: true,
        volume: 0.1
    }),
    gameStart: new Howl({
        src: [
            'assets/sounds/emojiman_beginning.ogg',
            'assets/sounds/emojiman_beginning.wav'
        ],

    }),
    chomp: new Howl({
        src: [
            'assets/sounds/emojiman_chomp.ogg',
            'assets/sounds/emojiman_chomp.wav'
        ],
        volume: 0.1

    }),
    eatfruit: new Howl({
        src: [
            'assets/sounds/emojiman_eatfruit.ogg',
            'assets/sounds/emojiman_eatfruit.wav'
        ]
    }),
    eat: new Howl({
        src: [
            'assets/sounds/emojiman_eat.ogg',
            'assets/sounds/emojiman_eat.wav'
        ]
    }),
    death: new Howl({
        src: [
            'assets/sounds/emojiman_death.ogg',
            'assets/sounds/emojiman_death.wav'
        ]
    }),
    eatGhost: new Howl({
        src: [
            'assets/sounds/emojiman_eatghost.ogg',
            'assets/sounds/emojiman_eatghost.wav'
        ]
    }),
    immortal: new Howl({
        src: [
            'assets/sounds/emojiman_extrapac.ogg',
            'assets/sounds/emojiman_extrapac.wav'
        ]

    })
};

// pause or play background music

export function music() {
    // Uncomment when fixed!
    // document.querySelector(".play-music").addEventListener('click', () => {
    //     if (!soundfx.gameSong.playing()) {
    //         soundfx.gameSong.play();
    //     }
    // });
    // document.querySelector(".mute-music").addEventListener('click', () => {
    //     soundfx.gameSong.pause();
    // });
};
