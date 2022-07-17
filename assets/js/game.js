
import { TileMap } from './modules/map.js';
import { MapObject, MapEntity, Player } from './modules/objects.js';

import { soundfx, music } from './modules/sounds.js'


(() => {

    let currentMap = null;

    let player = null; 
    // {
    //     // Player position in tile coordinates
    //     x: 0, y: 0,
    //     // Player speed in tiles per second
    //     speed: 6
    // }

    const actionMap = new Map();
    actionMap.set('MovePlayerLeft', {
        start: ()=>player.setVector(-1, 0),
        stop: ()=>player.setVector(0, 0)
    });
    actionMap.set('MovePlayerRight', {
        start: ()=>player.setVector(1, 0),
        stop: ()=>player.setVector(0, 0)
    });
    actionMap.set('MovePlayerUp', {
        start: ()=>player.setVector(0, -1),
        stop: ()=>player.setVector(0, 0)
    });
    actionMap.set('MovePlayerDown', {
        start: ()=>player.setVector(0, 1),
        stop: ()=>player.setVector(0, 0)
    });

    const keyMap = new Map();
    keyMap.set('ArrowLeft', 'MovePlayerLeft');
    keyMap.set('ArrowRight', 'MovePlayerRight');
    keyMap.set('ArrowUp', 'MovePlayerUp');
    keyMap.set('ArrowDown', 'MovePlayerDown');

    function startGame(gameMap) {
        currentMap = gameMap;
        document.documentElement.style.setProperty('--map-columns', gameMap.cols);
        document.documentElement.style.setProperty('--map-rows', gameMap.rows);

        // Map + Tiles
        const frag = new DocumentFragment();
        frag.append(gameMap.element);

        // Player
        player = new Player(gameMap.playerSpawn.x, gameMap.playerSpawn.y, gameMap, 6);
        frag.append(player.element);

        //Objects + Enemies here

        //Update the DOM
        document.getElementById('game-screen').append(frag);

        player.initialise();

        // Attach events
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        // Start game loop
        window.requestAnimationFrame(frame);
    }

    function stopGame() {}

    function loadMap(path) {
        //load sound
        music(soundfx.gameSong.pause())
        // Check if there's a currently loaded map and unload it here...
        // Load the new map
        
        fetch(path)
            .then(response => response.json())
            .then(data => {
                startGame(new TileMap(data));
            });
    }

    // loadMap('assets/maps/testMap.json');
    loadMap('assets/maps/vampire_party.json');

    let lastFrameTime = performance.now();
    function frame(time) {
        const timeDelta = (time - lastFrameTime) / 1000;

        // How far can the player move this frame?
        const playerMovement = player.speed * timeDelta;

        // // React to user events
        // for (const value of actionMap.values()) {
        //     if (value.active) value.action(playerMovement);
        // }

        // Update the player
        player.update(timeDelta);

        lastFrameTime = time;
        window.requestAnimationFrame(frame);
    }

    function keyDown(e) {
        const key = keyMap.get(e.code);
        if (key) {
            actionMap.get(key).start();
        }
    }

    function keyUp(e) {
        const key = keyMap.get(e.code);
        if (key) {
            actionMap.get(key).stop();
        }
    }

})();