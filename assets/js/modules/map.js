/*jshint esversion: 6 */

import { Node, Graph } from "./graph.js";
import { ObjectFactory } from "./entities.js";

export class Tile {
    /**
     * Creates a new tile object with x,y coordinates given.
     * Wall indicates if the tile is passable or impassable.
     * @param {Number} x - Tile X coordinate
     * @param {Number} y - Tile Y coordinate
     * @param {Boolean} wall - Should this tile be passable or a wall?
     * @param {Object} map - The map this tile belongs to
     */
    constructor(x, y, wall) {
        this._x = x;
        this._y = y;
        this._wall = wall;
        // Create this tiles html element
        this._elem = document.createElement('div');
        this._elem.classList.add('game-tile', (wall ? 'wall' : 'open'));
        // Objects on this tile
        this._objs = [];
        // Pathing
        this._node = new Node(x, y, (wall ? 100 : 1));
    }
    /*
     * Getters and Setters
     */
    get x() {return this._x;}
    get y() {return this._y;}
    get isWall() {return this._wall;}
    get passable() {return !this._wall;}
    get objects() {return this._objs;}
    get node() {return this._node;}
    // HTML Properties
    get element() {return this._elem;}
    get width() {return this._elem.clientWidth;}
    get height() {return this._elem.clientHeight;}

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

export class TileMap {
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
                this._tiles[y].push( new Tile(x, y, (template.map[y][x] === 1)) );
                this._elem.append(this._tiles[y][x].element);
            }
        }
        this._blocked = new Tile(-1,-1,true);
        this._playerSpawn = template.player;
        this._player = null;

        // Load objects, food, destination and enemies
        this._frag = new DocumentFragment();

        this._enemies = [];
        this._objects = [];
        this._food = [];
        this._exit = ObjectFactory.create(
            template.destination.type, 
            template.destination.x,
            template.destination.y,
            this
        );
        this._frag.append(this._exit.element);
        this._createObjects(template.enemies, this._enemies);
        this._createObjects(template.objects, this._objects);
        this._createObjects(template.food, this._food);

        // Build the pathing graph
        this._graph = this._buildGraph();

        this._complete = false;
    }
    /*
     * Getters and Setters 
     */
    get rows() {return this._rows;}
    get cols() {return this._cols;}
    get playerSpawn() {return this._playerSpawn;}
    // HTML Properties
    get element() {return this._elem;}
    get width() {return this._elem.clientWidth;}
    get height() {return this._elem.clientHeight;}
    // Objects
    get objFragment() {return this._frag;}
    get enemies() {return this._enemies;}
    get objects() {return this._objects;}
    get food() {return this._food;}
    get player() {return this._player;}
    // Map completion
    get complete() {return this._complete;}
    set complete(val) {this._complete = val;}
    
    inBounds(x, y) {
        return (x > 0 && x < this._cols && y > 0 && y < this._rows);
    }

    getTile(x, y) {
        const iX = Math.round(x);
        const iY = Math.round(y);
        if (this.inBounds(iX, iY)) {
            return this._tiles[iY][iX];
        }
        // If the tile is out of bounds, just return blocked.
        return this._blocked;
    }

    tileSize() {
        return [
            this._elem.clientWidth / this._cols,
            this._elem.clientHeight / this._rows
        ];
    }

    tileToPixel(x, y) {
        const [tW, tH] = this.tileSize();
        const iX = Math.round(x);
        const iY = Math.round(y);
        return {
            x: Math.round(iX * tW),
            y: Math.round(iY * tH)
        };
    }

    pixelToTile(x, y) {
        const [tW, tH] = this.tileSize();
        const iX = Math.round(x);
        const iY = Math.round(y);
        return {
            x: Math.round(iX / tW),
            y: Math.round(iY / tH)
        };
    }

    /*
     * Map Objects and entities
     */
    _createObjects(prefabs, list) {
        for (const prefab of prefabs) {
            const object = ObjectFactory.create(prefab.type, prefab.x, prefab.y, this);
            if (object) {
                list.push(object);
                this._frag.append(object.element);
            }
        }
    }

    initialiseObjects() {
        for (const nme of this._enemies) {
            nme.initialise();
        }
        for (const obj of this._objects) {
            obj.initialise();
        }
        for (const food of this._food) {
            food.initialise();
        }
        this._exit.initialise();
    }

    resetPositions() {
        for (const nme of this._enemies) {
            nme.reset();
        }
        this._player.reset();
    }

    registerPlayer(player) {
        this._player = player;
    }

    update(time) {
        for (const nme of this._enemies) {
            nme.update(time);
        }
        for (const obj of this._objects) {
            obj.update(time);
        }
        for (const food of this._food) {
            food.update(time);
        }
        this._exit.update(time);
    }

    removeObject(obj) {
        let idx = this._objects.indexOf(obj);
        if (idx >= 0) {
            this.removeIndex(idx, this._objects);
            return;
        }
        idx = this._food.indexOf(obj);
        if (idx >= 0) {
            this.removeIndex(idx, this._food);
            return;
        }
        idx = this._enemies.indexOf(obj);
        if (idx >= 0) {
            this.removeIndex(idx, this._enemies);
        }
    }

    removeIndex(idx,list) {
        list.splice(idx, 1);
    }

    /*
     * Pathing
     */
    _buildGraph() {
        const graph = new Graph();

        for (let y = 0; y < this._rows; y++) {
            for (let x = 0; x < this._cols; x++) {
                if (this._tiles[y][x].passable) {
                    graph.addVertex(this._tiles[y][x].node);

                    if (y < this._rows-1) {
                        graph.addVertex(this._tiles[y+1][x].node);
                        graph.addEdge(this._tiles[y][x].node, this._tiles[y+1][x].node);
                    }
        
                    if (x < this._cols-1) {
                        graph.addVertex(this._tiles[y][x+1].node);
                        graph.addEdge(this._tiles[y][x].node, this._tiles[y][x+1].node);
                    }
                }
            }
        }
        return graph;
    }

    getPath(start, goal) {
        const path = [];

        let node = this._graph.findPath(start.node, goal.node);

        // If a path was found
        if (node) {
            // Create a node path list to return.
            while (node.parent) {
                path.unshift(node);
                node = node.parent;
            }
            path.unshift(node);
        }
        // Ensure the nodes are cleared so a new path can be built
        this._graph.reset();

        return path;
    }
}
