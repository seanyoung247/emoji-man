
/**
 * Models an object that can live on the tile map
 */
export class MapObject {
    constructor(x, y, map) {
        this._x = x;
        this._y = y;
        this._map = map;
        this._tile = map.getTile(x, y);
        // Add self to the map tile
        this._tile.addObject(this);
        this._width = map.tileSize()[0];
    }

    /** Registers a collision with another object */
    collide(obj) {

    }
}

/**
 * Models an object that can move on the map
 */
export class MapMover extends MapObject {
    constructor(x, y, map, speed) {
        super(x, y, map);
        this._speed = speed;
    }
}

/*
 * Acts as the player's avatar
 */
export class Player extends MapMover {
    constructor(x, y, map, speed) {
        super(x, y, map, speed);
    }
}