/*jshint esversion: 6 */
/**
 * Models an object that can live on the tile map
 */
export class MapObject {
    constructor(prefab, x, y, map) {
        this._name = prefab.name;
        this._category = prefab.category;
        this._points = prefab.points;
        this._health = prefab.health;
        this._health_diff = prefab.health_diff;
        this._character = `'\\0${parseInt(prefab.html).toString(16)}'`;
        this._prefab = prefab;

        this._dying = false;

        this._x = this._spawnX = x;
        this._y = this._spawnY = y;
        this._map = map;
        this._tile = map.getTile(x, y);
        // Add self to the map tile
        this._tile.addObject(this);
        this._width = map.tileSize()[0];
        // Setup object's element - These will be set by a template when wired up
        this._elem = document.createElement('div');
        this._elem.classList.add('game-object');
    }

    setSpawn(x,y) {
        this._x = this._spawnX = x;
        this._y = this._spawnY = y;
    }

    // Called after the object has been added to the DOM. Do element initialisation here
    initialise() {
        this._setElementProps();
    }

    _setElementProps() {
        const pos = this._map.tileToPixel(this._x, this._y);
        this._elem.style.setProperty('--pX', pos.x);
        this._elem.style.setProperty('--pY', pos.y);
        this._elem.style.setProperty('--size', this._map.tileSize()[0]);
        this._elem.style.setProperty('--character', this._character);
    }

    /*
     * Getters and Setters
     */
    get x() {return this._x;}
    get y() {return this._y;}
    get width() {return this._width;}
    get element() {return this._elem;}
    get tile() {return this._tile;}

    get name() {return this._name;}
    get category() {return this._category;}
    get points() {return this._points;}
    get health() {return this._health;}
    get health_diff() {return this._health_diff;}
    get character() {return this._character;}
    get prefab() {return this._prefab;}

    update(time) {
        this._setElementProps();
    }

    /** Registers a collision with another object */
    collide(obj) {}
    doCollision(obj) {}

    /** Moves the object back to it's spawn point */
    reset() {
        this._x = this._spawnX;
        this._y = this._spawnY;
    }

    _dead() {
        // Deregister self from tile.
        this._tile.removeObject(this);
        // Deregister self from Map.
        this._map.removeObject(this);
        // Stop displaying the element
        this._elem.classList.remove('dying');
        this._elem.classList.add('dead');
    }

    die() {
        // For you my little chickadee, it's time to die
        this._dying = true;
        // Reflect death in element.
        this._elem.classList.add('dying');
        setTimeout(()=>this._dead(),500);
    }
}

/**
 * Models an object that can move on the map
 */
export class MapEntity extends MapObject {
    constructor(prefab, x, y, map, speed) {
        super(prefab, x, y, map);
        this._speed = speed;
        
        this._vector = {x:0, y:0};
        this._elem.classList.add('game-entity');
    }

    setVector(x, y) {
        this._vector.x = Math.sign(x);
        this._vector.y = Math.sign(y);
    }

    setVectorX(x) {this.setVector(x, this._vector.y);}
    setVectorY(y) {this.setVector(this._vector.x, y);}

    update(time) {
        this.move(time);
        this._setElementProps();
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
        if (Math.round(pX) != this._tile.x || Math.round(pY) != this._tile.y) {
            // Deregister this from the current Tile
            this._tile.removeObject(this);
            // Register on the new tile
            this._tile = this._map.getTile(this._x, this._y);
            this._tile.addObject(this);
            // Perform collision with any objects on the tile
            const tileObjs = this._tile.objects;
            for (const obj of tileObjs) {
                // Call collision on every object on the tile
                obj.collide(this);
            }
        }
    }
}

export class PathFinder extends MapEntity {
    constructor(prefab, x, y, map, speed) {
        super(prefab, x, y, map, speed);

        this._pathWait = 500;   // How long to wait before asking for a new path (ms)
        this._lastPathTime = 0; // Time last path was created (ms)

        this._pathing = false;
        this._goal = null;
        this._path = [];
        this._step = 0;
    }
    createPath(goal) {
        const time = performance.now();
        if ((time - this._lastPathTime) > this._pathWait) {
            this._lastPathTime = time;
            this._path = this._map.getPath(this._tile, goal);
            this._goal = goal;
            this._step = 0;
            this._pathing = true;
        }
    }

    followPath() {
        if (this._pathing) {
            // Have we reached our goal?
            if (this._tile === this._goal) {
                this._pathing = true;
                this._goal = null;
                this._path = [];
                this._step = 0;
                this.setVector(0,0);
            } else if (this._tile.node === this._path[this._step]) {
                this._step++;
                this.setVector(this._path[this._step].x - this._tile.x, this._path[this._step].y - this._tile.y);
            }
        }
    }
    update(time) {
        this.followPath();
        this.move(time);
        this._setElementProps();
    }
}

