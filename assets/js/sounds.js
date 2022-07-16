
export var soundfx = {
    gameSong: new Howl({
        src: [
            'assets/sounds/retrorace-108750.mp3',
            'assets/sounds/retrorace-108750.wav'
        ],
        autoplay: true,
        loop: true,
        volume: 0.5
    }),
    gameStart: new Howl({
        src: [
            'assets/sounds/emojiman_beginning.wav',
            'assets/sounds/emojiman_beginning.mp3'
        ]

    }),
    chomp: new Howl({
        src: [
            'assets/sounds/emojiman_chomp.wav',
            'assets/sounds/emojiman_chomp.mp3'
        ]

    }),
    eatfruit: new Howl({
        src: [
            'assets/sounds/emojiman_eatfruit.mp3',
            'assets/sounds/emojiman_eatfruit.wav'
        ]
    })
}
