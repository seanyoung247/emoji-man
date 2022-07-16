
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
export class MapMover extends MapObject {
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

    move(time) {
        // Move along the vector based on speed and time passed.
        
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