/*jshint esversion: 6 */

let muted = true;
let playMusic = false;

//all sounds
export const soundfx = {
    gameSong: new Howl({
        src: [
            'assets/sounds/retrorace-108750.ogg',
            'assets/sounds/retrorace-108750.wav'
        ],
        loop: true,
        volume: 0.5
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
        volume: 0.5

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

export function muteSounds(val) {
    muted = val;
    if (muted) stopAllSounds();
}

export function stopAllSounds() {
    for (const sound in soundfx) {
        soundfx[sound].pause();
    }
}

export function playSound(sound) {
    if (!muted) {
        sound.play();
    }
}

export function stopSound(sound) {
    sound.pause();
}