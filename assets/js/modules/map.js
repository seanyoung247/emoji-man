
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

