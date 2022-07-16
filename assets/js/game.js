
import { TileMap } from './modules/map.js';
import { MapObject, MapMover, Player } from './modules/objects.js';

import { soundfx, music } from './sounds.js'


(() => {

    let currentMap = null;

    let player = {
        // Player position in tile coordinates
        x: 0, y: 0,
        // Player speed in tiles per second
        speed: 6
    }

    const actionMap = new Map();
    actionMap.set('MovePlayerLeft', {active: false, action: (amt) => player.x -= currentMap.getTile(player.x-1,player.y).passable ? amt : 0});
    actionMap.set('MovePlayerRight', {active: false, action: (amt) => player.x += currentMap.getTile(player.x+1,player.y).passable ? amt : 0});
    actionMap.set('MovePlayerUp', {active: false, action: (amt) => player.y -= currentMap.getTile(player.x,player.y-1).passable ? amt : 0});
    actionMap.set('MovePlayerDown', {active: false, action: (amt) => player.y += currentMap.getTile(player.x,player.y+1).passable ? amt : 0});

    const keyMap = new Map();
    keyMap.set('ArrowLeft', 'MovePlayerLeft');
    keyMap.set('ArrowRight', 'MovePlayerRight');
    keyMap.set('ArrowUp', 'MovePlayerUp');
    keyMap.set('ArrowDown', 'MovePlayerDown');

    function startMap() {
        document.documentElement.style.setProperty('--map-columns', currentMap.cols);
        document.documentElement.style.setProperty('--map-rows', currentMap.rows);

        // Map + Tiles
        const frag = new DocumentFragment();
        frag.append(currentMap.element);

        // Player
        player.x = currentMap.playerSpawn.x;
        player.y = currentMap.playerSpawn.y;
        const playerEl = document.createElement('div');
        playerEl.classList.add('game-player');
        frag.append(playerEl);

        //Objects + Enemies here

        //Update the DOM
        document.getElementById('game-screen').append(frag);

        const pos = currentMap.tileToPixel(player.x, player.y);
        playerEl.style.setProperty('--pX', pos.x);
        playerEl.style.setProperty('--pY', pos.y);
        playerEl.style.setProperty('--size', currentMap.tileSize()[0]);

        // Attach events
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        // Start game loop
        window.requestAnimationFrame(frame);
    }

    function loadMap(path) {
        //load sound
        music(soundfx.gameSong.pause())
        // Check if there's a currently loaded map and unload it here...
        // Load the new map
        
        fetch(path)
            .then(response => response.json())
            .then(data => {
                currentMap = new TileMap(data);
                startMap();
            });
    }

    // loadMap('assets/maps/testMap.json');
    loadMap('assets/maps/vampire_party.json');

    let lastFrameTime = performance.now();
    function frame(time) {
        const timeDelta = (time - lastFrameTime) / 1000;

        // How far can the player move this frame?
        const playerMovement = player.speed * timeDelta;

        // React to user events
        for (const value of actionMap.values()) {
            if (value.active) value.action(playerMovement);
        }

        // Move the player
        const playerEl = document.getElementsByClassName('game-player')[0];
        const pos = currentMap.tileToPixel(player.x, player.y);
        playerEl.style.setProperty('--pX', pos.x);
        playerEl.style.setProperty('--pY', pos.y);

        lastFrameTime = time;
        window.requestAnimationFrame(frame);
    }

    function keyDown(e) {
        const key = keyMap.get(e.code);
        if (key) {
            actionMap.get(key).active = true;
        }
    }

    function keyUp(e) {
        const key = keyMap.get(e.code);
        if (key) {
            actionMap.get(key).active = false;
        }
    }

})();