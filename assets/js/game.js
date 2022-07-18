/*jshint esversion: 6 */
/*jshint esversion: 8 */

import { playerHealth } from './emojis/emoji_dict.js';
import { currentScore } from './modules/scores.js';

import { TileMap } from './modules/map.js';
import { Player } from './modules/entities.js';
import { soundfx, music } from './modules/sounds.js';

import { createGameElements } from './domHandling.js';

(async () => {
    const levelNames = [
        'alien_abduction.json',
        'clown_town.json',
        'death.json',
        'devils_domain.json',
        'halloween.json',
        'lions_tigers_bears.json',
        'vampire_party.json',
        // 'walk_plank.json' - Not sure why but this map causes the game to lock up. Will investigate if time.
    ];

    let gameMaps = [];
    let currentMap = null;
    let running = 0;

    let player = null;

    const actionMap = new Map();
    actionMap.set('MovePlayerLeft', {
        start: () => player.setVectorX(-1),
        stop: () => player.setVectorX(0)
    });
    actionMap.set('MovePlayerRight', {
        start: () => player.setVectorX(1),
        stop: () => player.setVectorX(0)
    });
    actionMap.set('MovePlayerUp', {
        start: () => player.setVectorY(-1),
        stop: () => player.setVectorY(0)
    });
    actionMap.set('MovePlayerDown', {
        start: () => player.setVectorY(1),
        stop: () => player.setVectorY(0)
    });

    const keyMap = new Map();
    keyMap.set('ArrowLeft', 'MovePlayerLeft');
    keyMap.set('ArrowRight', 'MovePlayerRight');
    keyMap.set('ArrowUp', 'MovePlayerUp');
    keyMap.set('ArrowDown', 'MovePlayerDown');


    function startGame(gameMap, mapParams) {
        currentMap = gameMap;

        // load sound
        music(soundfx.gameSong.pause());

        // Player
        player = new Player(playerHealth, gameMap.playerSpawn.x, gameMap.playerSpawn.y, gameMap, 6);
        createGameElements(gameMap, mapParams, player);

        player.initialise();
        gameMap.initialiseObjects();

        // Attach events
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        // Start game loop
        running = window.requestAnimationFrame(frame);
    }

    function unloadMap() {

    }

    function nextMap() {
        console.log("moving to next map");
    }

    function stopGame() { }

    async function loadMaps(path) {
        let maps = [];
        //Load maps
        for (let name of levelNames) {
            let fullPath = path + name;
            let response = await fetch(fullPath);
            let data = await response.json();
            maps.push(data);
        }

        return maps;
    }

    gameMaps = await loadMaps('assets/maps/');

    /*
    Function to randomize the maps array
    */
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    shuffleArray(gameMaps);

    let newMap = new TileMap(gameMaps[0]);

    startGame(newMap, gameMaps[0]);

    /*
     * Game Loop
     */
    let lastFrameTime = performance.now();
    function frame(time) {
        const timeDelta = (time - lastFrameTime) / 1000;

        /* -------- PLAYER UPDATES ------- */
        // How far can the player move this frame?
        const playerMovement = player.speed * timeDelta;
        // Update the player
        player.update(timeDelta);

        /* -------- ENTITY UPDATES ------- */
        // Update other objects
        currentMap.update(timeDelta);

        /* ----- GAME LOGIC UPDATES ------ */
        

        // Update score
        const scoreDisplay = document.getElementById('player-score');
        scoreDisplay.innerHTML = currentScore;

        lastFrameTime = time;
        running = window.requestAnimationFrame(frame);
    }

    /*
     * Events
     */
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