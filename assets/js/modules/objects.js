
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
        /* 
           This will be called when a moving object moves on to the same 
           tile as this object. The object colliding will be passed as obj.
           So this is where any collision actions can be taken. For instance
           if a derived class needs to increase the player's health, we'd
           check the obj is the player then increase the player health here.
        */
    }
}

/**
 * Models an object that can move on the map
 */
export class MapEntity extends MapObject {
    constructor(x, y, map, speed) {
        super(x, y, map);
        this._speed = speed;
        this._path = [];
        this._goal = null;
        this._vector = {x:0, y:0};
    }

    createPath(goal) {
        if (goal != this._goal) {
            this._path = this._map.getPath(this._tile, goal);
        }
    }

    update(time) {
        /*
          This method will be called every frame so the object can update itself.
         */
    }

    setVector(x, y) {
        this._vector.x = Math.sign(x);
        this._vector.y = Math.sign(y);
    }

    // Moves along the current movement vector
    move(time) {
        const pX = this._x + (this._vector.x * (this._speed * time));
        const pY = this._y + (this._vector.y * (this._speed * time));

        // Check for collisions in x
        if (this._map.getTile(pX, this._y).passable) {
            this._x = pX;
        }
        // Check for collision in y
        if (this._map.getTile(this._x, pY).passable) {
            this._y = pY;
        }
        // Have we moved to a new tile?
        if (Math.round(pX) != this._x || Math.round(pY) != this._y) {
            // Deregister this from the current Tile
            this._tile.removeObject(this);
            // Register on the new tile
            this._tile = this._map.getTile(this._x, this._y);
            this._tile.addObject(this);
            // Perform collision with any objects on the tile
        }
    }
}

/*
 * Acts as the player's avatar
 */
export class Player extends MapEntity {
    constructor(x, y, map, speed) {
        super(x, y, map, speed);
    }
}