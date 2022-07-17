/*jshint esversion: 6 */
/*jshint esversion: 8 */

import { TileMap } from './modules/map.js';
import { MapObject, MapEntity, Player } from './modules/objects.js';
import { soundfx, music } from './modules/sounds.js';
import { emojis } from './emojis/emoji_dict.js'


(async () => {
    const levelNames = [
        'alien_abduction.json',
        'clown_town.json',
        'death.json',
        'devils_domain.json',
        'halloween.json',
        'lions_tigers_bears.json',
        'vampire_party.json',
        'walk_plank.json'
    ];

    let gameMaps = [];
    let currentMap = null;

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

        document.documentElement.style.setProperty('--map-columns', gameMap.cols);
        document.documentElement.style.setProperty('--map-rows', gameMap.rows);

        // Map + Tiles
        const frag = new DocumentFragment();
        frag.append(gameMap.element);

        // Player
        player = new Player(gameMap.playerSpawn.x, gameMap.playerSpawn.y, gameMap, 6);
        frag.append(player.element);

        // Objects + Enemies here
        let mapEnemiesHTML = '';
        let mapCollectableHTML = '';
        let mapDestinationHTML = '';

        // display enemies
        for (let i = 0; i < mapParams['enemies'].length; i++) {
            for (let j = 0; j < emojis.length; j++) {
                if (emojis[j]['name'] == mapParams['enemies'][i]['type']) {
                    let html = `&#${emojis[j]['html']}`;
                    if (!mapEnemiesHTML.includes(html)) {
                        mapEnemiesHTML = mapEnemiesHTML + html + '';
                    }
                }
            }
            document.getElementById('game-baddies').innerHTML = mapEnemiesHTML;
        }

        // display collectables
        for (let i = 0; i < mapParams['objects'].length; i++) {
            for (let j = 0; j < emojis.length; j++) {
                if (emojis[j]['name'] == mapParams['objects'][i]['type']) {
                    let html = `&#${emojis[j]['html']}`;
                    if (!mapCollectableHTML.includes(html)) {
                        mapCollectableHTML = mapCollectableHTML + html + '';
                    }
                }
            }
            document.getElementById('game-objects').innerHTML = mapCollectableHTML;
        }

        // display destination
        for (let j = 0; j < emojis.length; j++) {
            if (emojis[j]['name'] == mapParams['destination']['type']) {
                console.log(mapParams['destination']['type'])
                let html = `&#${emojis[j]['html']}`;
                mapDestinationHTML = mapDestinationHTML + html;
                console.log(mapDestinationHTML)
            }
        }

        // Update the DOM
        document.getElementById('game-screen').append(frag);
        document.getElementById('game-title').innerHTML = mapParams['title'];
        document.getElementById('game-dest').innerHTML = mapDestinationHTML;

        player.initialise();

        // Attach events
        window.addEventListener('keydown', keyDown);
        window.addEventListener('keyup', keyUp);

        // Start game loop
        window.requestAnimationFrame(frame);
    }

    // function getEmojis() {

    // }

    function stopGame() { }

    async function loadMap(path) {
        //load sound
        music(soundfx.gameSong.pause());
        // Check if there's a currently loaded map and unload it here...
        // Load the new map

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

    gameMaps = await loadMap('assets/maps/');

    /*
    Function to randomize the maps array
    */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    shuffleArray(gameMaps);

    let newMap = new TileMap(gameMaps[0]);

    startGame(newMap, gameMaps[0]);

    let lastFrameTime = performance.now();
    function frame(time) {
        const timeDelta = (time - lastFrameTime) / 1000;

        // How far can the player move this frame?
        const playerMovement = player.speed * timeDelta;

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