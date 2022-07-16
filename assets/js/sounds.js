
export var soundfx = {
    gameSong: new Howl({
        src: [
            'assets/sounds/retrorace-108750.ogg',
            'assets/sounds/retrorace-108750.wav'
        ],
        autoplay: true,
        loop: true,
        volume: 0.5
    }),
    gameStart: new Howl({
        src: [
            'assets/sounds/emojiman_beginning.ogg',
            'assets/sounds/emojiman_beginning.mp3'
        ]

    }),
    chomp: new Howl({
        src: [
            'assets/sounds/emojiman_chomp.ogg',
            'assets/sounds/emojiman_chomp.mp3'
        ]

    }),
    eatfruit: new Howl({
        src: [
            'assets/sounds/emojiman_eatfruit.ogg',
            'assets/sounds/emojiman_eatfruit.wav'
        ]
    })
}
