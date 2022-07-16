
export class Tile {
    /**
     * Creates a new tile object with x,y coordinates given.
     * Wall indicates if the tile is passable or impassable.
     * @param {Number} x - Tile X coordinate
     * @param {Number} y - Tile Y coordinate
     * @param {Boolean} wall - Should this tile be passable or a wall?
     */
    constructor(x, y, wall) {
        this._x = x;
        this._y = y;
        this._wall = wall;
        // Create this tiles html element
        this._elem = document.createElement('div');
        this._elem.classList.add('game-tile', (this._wall ? 'wall' : 'open'));
        // Objects on this tile
        this._objs = [];
    }
    /*
     * Getters and Setters
     */
    get x() {return this._x;}
    get y() {return this._y;}
    get isWall() {return this._wall;}
    get passable() {return !this._wall;}
    get element() {return this._elem;}

    /**
     * Adds an object to be resident to the tile.
     * @param {Object} obj 
     * @returns The index of the object
     */
    addObject(obj) {
        return (this._objs.push(obj) - 1);
    }

    /**
     * Removes the provided object from the attached objects list
     * @param {Object} obj 
     */
    removeObject(obj) {
        const idx = this._objs.indexOf(obj);
        if (idx >= 0) this.removeIndex(idx);
    }

    /**
     * Removes the attached object based on it's index
     * @param {Number} idx 
     */
    removeIndex(idx) {
        this._objs.splice(idx, 1);
    }
}

export class Map {
    constructor(template) {
        this._rows = template.map.length;
        this._cols = template.map[0].length;
        this._elem = document.createElement('div');
        this._elem.classList.add('game-map');
        this._tiles = [];
        // Generate tiles
        for (let y = 0; y < this._rows; y++) {
            this._tiles.push([]);
            for (let x = 0; x < this._cols; x++) {
                this._tiles[y].push(new Tile(x, y, (template.map[y][x] === 1)));
                this._elem.append(this._tiles[y][x].element);
            }
        }
        this._playerSpawn = template.player;
    }
    /*
     * Getters and Setters 
     */
    get rows() {return this._rows;}
    get cols() {return this._cols;}
    get element() {return this._elem;}
    get playerSpawn() {return this._playerSpawn;}
    
    inBounds(x, y) {
        return (x > 0 && x < this._cols && y > 0 && y < this._rows);
    }

    getTile(x, y) {
        if (this.inBounds(x, y)) {
            return this._tiles[y][x];
        }
        return null;
    }
}