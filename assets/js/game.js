
(() => {

    const testMap = {
        cols: 10, rows: 10,
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

    setup();

    window.addEventListener('keydown', (e) => {
        
    });

})();