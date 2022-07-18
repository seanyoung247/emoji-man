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
                // END LEVEL HERE!
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
}
ObjectFactory.register('enemies', Chaser);

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
    

    collide(obj) {
        obj.doCollision(this);
    }
}