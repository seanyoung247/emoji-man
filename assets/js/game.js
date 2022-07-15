
(() => {

    /**
     * Creates the tile grid elements and adds them to the DOM
     */
    function setup() {
        // A Document fragment lets us create a sort of virtual dom. This way we can create a whole chunk of HTML
        // and add it in one big operation rather than lots of little ones.
        const frag = new DocumentFragment();
        
        // Now create a div for each tile on the map and add it to the document fragment
        for (let i = 0; i < 625; i++) {
            const tile = document.createElement('div');
            tile.classList.add('game-tile');
            frag.append(tile);
        }
    }

})();