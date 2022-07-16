import { Map } from './modules/map.js';

(() => {

    const testMap = {
        cols: 25, rows: 15,
    }

    let currentMap = null;

    let player = {
        // Player position in tile coordinates
        x: 0, y: 0
    }

    function startMap() {
        document.documentElement.style.setProperty('--map-columns', currentMap.cols);
        document.documentElement.style.setProperty('--map-rows', currentMap.rows);

        // Map + Tiles
        const frag = new DocumentFragment();
        frag.append(currentMap.element);

        // Player
        player = currentMap.playerSpawn;
        const playerEl = document.createElement('div');
        playerEl.classList.add('game-player');
        frag.append(playerEl);

        //Objects + Enemies here

        //Update the DOM
        document.getElementById('game-screen').append(frag);

        const pos = currentMap.tileToPixel(player.x, player.y);
        playerEl.style.left = `${Math.floor(pos.x)}px`;
        playerEl.style.top = `${Math.floor(pos.y)}px`;
    }

    function loadMap(path) {
        // Check if there's a currently loaded map and unload it here...
        // Load the new map
        fetch(path)
            .then(response => response.json())
            .then(data => {
                currentMap = new Map(data);
                startMap();
            });
    }

    loadMap('assets/maps/testMap.json');

    /**
     * Calculates tile width/height
     */
    function tileSize(map) {
        const gameField = document.getElementById('game-screen');
        return [
            gameField.clientWidth / map.cols,
            gameField.clientHeight / map.rows
        ]
    }

    /**
     * Converts from pixels position to tile position
     */
    function pixelToTile(pixel, map) {
        const [tileWidth, tileHeight] = tileSize(map);

        return {
            x: pixel.x / tileWidth,
            y: pixel.y / tileHeight
        }
    }

    /**
     * Converts tile coordinates to pixel coordinates
     */
    function tileToPixel(tile, map) {
        const [tileWidth, tileHeight] = tileSize(map);

        return {
            x: tile.x * tileWidth,
            y: tile.y * tileHeight
        }
    }

    window.addEventListener('keyup', (e) => {
        // This could be... better...
        switch (e.code) {
            case 'ArrowLeft':
                player.x -= 1;
                break;
            case 'ArrowRight':
                player.x += 1;
                break;
            case 'ArrowUp':
                player.y -= 1;
                break;
            case 'ArrowDown':
                player.y += 1;
                break;
        }

        // Reset player position if it is outside the bounds of the map
        if (player.x < 0) player.x = 0;
        if (player.x > testMap.cols-1) player.x = testMap.cols-1;
        if (player.y < 0) player.y = 0;
        if (player.y > testMap.rows-1) player.y = testMap.rows-1;

        // Move the player element to represent new player position
        const playerElem = document.getElementsByClassName('game-player')[0];
        const pos = tileToPixel(player, testMap);
        playerElem.style.left = `${Math.floor(pos.x)}px`;
        playerElem.style.top = `${Math.floor(pos.y)}px`;
    });

})();