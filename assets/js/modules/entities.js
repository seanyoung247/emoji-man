/*jshint esversion: 6 */

import { MapObject, MapEntity, PathFinder } from './objects.js';
import { incScore } from './scores.js';
import { emojis } from '../emojis/emoji_dict.js';

export class ObjectFactory {
    static products = new Map();
    
    static register(type, obj) {
        this.products.set(type, obj);
    }
    static create(name, x, y, map) {
        const prefab = emojis[name];
        if (prefab) {
            const obj = this.products.get(prefab.category);
            if (obj) {
                return new obj(prefab, x, y, map);
            }
        }
        return null;
    }
}

// For a static pickup, you can extend MapObject. For a moving enemy extend PathFinder


/*
 * STATIC ITEMS:
 */

// Implements the desitination (exit)

class Exit extends MapObject {
    collide(obj) {
        // This function is called when another game object collides with this one. Basically
        // When they're on the same tile.

        // This game object should only react to the player:
        if (obj.category === 'player') {
            // Check if all pickups have been grabbed
            if (!this._map.objects.length) {
                // If the objects array is length 0, no more objects to pick up
                this._map.complete = true;
            }
        }
    }
}
ObjectFactory.register('destination', Exit);

// Implements points
class Points extends MapObject {
    collide(obj) {
        // This game object should only react to the player:
        if (obj.category === 'player') {
            // Add points to score.
            incScore(this._points);
            // Get out of here eaten thing
            this.die();
        }
    }
}
ObjectFactory.register('points', Points);

class Food extends MapObject {
    collide(obj) {
        if (obj.category === 'player') {
            // Add points to score.
            incScore(this._points);
            // Add health to player
            obj.setHealth(this._health_diff);
            // Get out of here eaten thing
            this.die();
        }
    }
}

/*
 * MOVABLE ENTITIES:
 */

class Chaser extends PathFinder {
    constructor(prefab, x, y, map) {
        // I completely forgot to deal with a moving entities speed in the ObjectFactory, so we'll just hard code it for now:
        super(prefab, x, y, map, 3); // Player is 6 tiles per second so monsters are half the speed.
    }
    update(time) {
        // This is just a simple chaser. They'll just attempt to move toward the player
        // Get the player's current position and try and create a path to get to them

        this.createPath(this._map.player.tile);
        // Let the base class deal with the rest of the functionality
        super.update(time);
    }
    collide(obj) {
        this.doCollision(obj);
    }
    doCollision(obj) {
        if (obj.category === 'player') {
            // Imma gonna hurt ya
            obj.setHealth(this._health_diff);
            // Trigger reset
            this._map.resetPositions();
            // Do we want the monster to die here?
        } 
    }
}
ObjectFactory.register('enemies', Chaser);



const clamp = (num, min, max) => Math.min(Math.max(num, min), max);



/*
 * Acts as the player's avatar
 */
export class Player extends MapEntity {
    constructor(health, x, y, map, speed) {
        // The fifth health def is the default I think?
        super(health[4], x, y, map, speed);
        this._elem.classList.add('game-player');

        this._healthPrefabs = health;

        this._minHealth = 0;
        this._health = health[4].health - 1;
        this._maxHealth = health.length - 1;
    }

    get category() {return 'player';}
    
    // Health
    setHealth(amt) {
        if (amt < 0 && this._health === this._minHealth) {
            // Player dies here
        } else {
            this._health = clamp(this._health + amt, this._minHealth, this._maxHealth);
            this._character = `'\\0${parseInt(this._healthPrefabs[this._health].html).toString(16)}'`;
        }
    }

    // Only movable objects can collide with the player, so delegate the response to them:
    collide(obj) {
        obj.doCollision(this);
    }
}