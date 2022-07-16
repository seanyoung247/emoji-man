import { TileMap } from './modules/map.js';

(() => {

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
        playerEl.style.setProperty('--pX', pos.x);
        playerEl.style.setProperty('--pY', pos.y);
        playerEl.style.setProperty('--size', currentMap.tileSize()[0]);

        // Attach events
        window.addEventListener('keyup', keyup);
    }

    function loadMap(path) {
        // Check if there's a currently loaded map and unload it here...
        // Load the new map
        fetch(path)
            .then(response => response.json())
            .then(data => {
                currentMap = new TileMap(data);
                startMap();
            });
    }

    loadMap('assets/maps/testMap.json');


    function keyup(e) {
        
        // This could be... better...
        switch (e.code) {
            case 'ArrowLeft':
                if (currentMap.getTile(player.x-1,player.y).passable) player.x -= 1;
                break;
            case 'ArrowRight':
                if (currentMap.getTile(player.x+1,player.y).passable) player.x += 1;
                break;
            case 'ArrowUp':
                if (currentMap.getTile(player.x,player.y-1).passable) player.y -= 1;
                break;
            case 'ArrowDown':
                if (currentMap.getTile(player.x,player.y+1).passable) player.y += 1;
                break;
        }

        // Reset player position if it is outside the bounds of the map
        if (player.x < 0) player.x = 0;
        if (player.x > currentMap.cols-1) player.x = currentMap.cols-1;
        if (player.y < 0) player.y = 0;
        if (player.y > currentMap.rows-1) player.y = currentMap.rows-1;

        // Move the player element to represent new player position
        const playerEl = document.getElementsByClassName('game-player')[0];
        const pos = currentMap.tileToPixel(player.x, player.y);
        playerEl.style.setProperty('--pX', pos.x);
        playerEl.style.setProperty('--pY', pos.y);
    }

})();