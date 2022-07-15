
(() => {

    const testMap = {
        cols: 25, rows: 15,
    }

    const player = {
        // Player position in tile coordinates
        x: 0, y: 0
    }

    /**
     * Creates the tile grid elements and adds them to the DOM
     */
    function setupMap(map) {
        const totalTiles = map.cols * map.rows;
        // First set up the css parameters for displaying the map
        document.documentElement.style.setProperty('--map-columns', map.cols);
        document.documentElement.style.setProperty('--map-rows', map.rows);

        // A Document fragment lets us create a sort of virtual dom. This way we can create 
        // a whole chunk of HTML and add it in one big operation rather than lots of little
        // ones. This is much faster and more efficient.
        const frag = new DocumentFragment();
        
        // Now create a div for each tile on the map and add it to the document fragment
        for (let i = 0; i < totalTiles; i++) {
            // We'll probably want to set up tiles as walls or passable here by reading the map
            const tile = document.createElement('div');
            tile.classList.add('game-tile');
            frag.append(tile);
        }
        // Create the element that will represent the player
        const player = document.createElement('div');
        player.classList.add('game-player');
        frag.append(player);
        // More for loops for enemies, map items etc here.
        // Add the document fragment to the page
        document.getElementById('game-screen').append(frag);
    }

    setupMap(testMap);


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
        // Constrain to map dimensions
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