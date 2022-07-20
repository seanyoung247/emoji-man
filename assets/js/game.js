/*jshint esversion: 6 */
/*jshint esversion: 8 */

import { playerHealth } from './emojis/emoji_dict.js';
import { currentScore } from './modules/scores.js';

import { TileMap } from './modules/map.js';
import { Player } from './modules/entities.js';
import { soundfx, playSound, playMusic, stopAllSounds, muteSounds } from './modules/sounds.js';

import { 
    createGameElements, clearGameElements, 
    showGameDialog, hideGameDialog,
    setGameOver, setGameRunning
} from './domHandling.js';

(async () => {
    const levelNames = [
        'alien_abduction.json',
        'clown_town.json',
        'death.json',
        'devils_domain.json',
        'halloween.json',
        'lions_tigers_bears.json',
        'vampire_party.json',
        // 'walk_plank.json' - Not sure why but this map causes the game to lock up. Appears to be yet another parthing bug... Will investigate if time. 
    ];

    let gameMaps = [];
    let currentMap = null;
    let mapIdx = 0;
    let running = false;

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

    /**
     * Starts a new game
     * @param {Object} gameMap - The map to start with
     * @param {Object} mapParams - Map parameters
     */
    function startGame(gameMap, mapParams) {
        currentMap = gameMap;

        setGameRunning();

        // load sound
        soundfx.gameSong.pause();

        // Player
        player = new Player(4, playerHealth, gameMap.playerSpawn.x, gameMap.playerSpawn.y, gameMap, 6);
        createGameElements(gameMap, mapParams, player);

        player.initialise();
        gameMap.initialiseObjects();

        // Attach events
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        // Start game loop
        running = true;
        window.requestAnimationFrame(frame);
    }

    /**
     * Unloads the current map
     */
    function unloadMap() {
        // Clear the current map
        currentMap = null;
        // Clear the elements
        clearGameElements();
    }

    /**
     * Moves to the next map
     */
    function nextMap() {
        // Unload the current map
        unloadMap();
        // Is there another map to load?
        mapIdx++;
        if (mapIdx < gameMaps.length) {
            // Load the next map
            currentMap = new TileMap(gameMaps[mapIdx]);

            player.setSpawn(currentMap.playerSpawn.x, currentMap.playerSpawn.y);
            player.map = currentMap;
            createGameElements(currentMap, gameMaps[mapIdx], player);
    
            player.initialise();
            currentMap.initialiseObjects();
        } else {
            playerWon();
        }
    }

    /**
     * Cleans up objects at the end of the game, either on winning or dying.
     */
    function pauseGame() {
        // Update DOM
        setGameOver();
        // Stop sounds
        stopAllSounds();
        // Clear game loop
        running = false;
        // Remove event listeners
        window.removeEventListener('keydown', keyDown);
        window.removeEventListener('keyup', keyUp);
    }

    /**
     * Called when the last level has been completed
     */
    function playerWon() {
        // Actions specific to player winning here
        showGameDialog(`You won with ${currentScore} points!`, 'Play Again?');
        // Pause game
        pauseGame();
    }

    /**
     * Called when the player has run out of health
     */
    function playerDied() {
        playSound(soundfx.death);
        // Actions specific to player dying here
        showGameDialog('You lost! Have you tried getting good?', 'Play Again?');
        // Pause game
        pauseGame();
    }

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

    function playGame() {
        playMusic(soundfx.gameStart);
        // Start the main music when intro music has finished:
        setTimeout(() => playMusic(soundfx.gameSong), 4000);

        shuffleArray(gameMaps);
        clearGameElements();
        startGame(new TileMap(gameMaps[0]), gameMaps[0]);
    }

    showGameDialog();

    /*
     * Game Loop
     */
    let lastFrameTime = performance.now();
    function frame(time) {
        const timeDelta = (time - lastFrameTime) / 1000;

        /* -------- PLAYER UPDATES ------- */
        player.update(timeDelta);

        /* -------- ENTITY UPDATES ------- */
        currentMap.update(timeDelta);

        /* ------ GAMELOGIC UPDATES ------ */
        // Check map complete:
        if (currentMap.complete) nextMap();
        // Is the player an ex-player? Have they shuffled off this mortal coil?
        if (player.dead) playerDied();

        // Update score
        const scoreDisplay = document.getElementById('player-score');
        scoreDisplay.innerHTML = currentScore;

        // Store current frame time and wait for next cycle
        lastFrameTime = time;
        if (running) window.requestAnimationFrame(frame);
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

    document.getElementById('start-game-btn').addEventListener('click', () => {
        playGame();
        hideGameDialog();
    });

    document.getElementById('audio-input').addEventListener('change', function () {
        const muted = !this.checked;
        muteSounds(muted);
        // If game is playing and unmuted, start the music
        if (running && !muted) {
            playMusic(soundfx.gameSong);
        }
    });

})();