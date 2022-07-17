import { MapObject, MapEntity } from './objects.js';
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

// For a static pickup, you can extend MapObject. For a moving enemy extend MapEntity

// Implements the desitination (exit)

class Exit extends MapObject {
    update() {
        // This is called once per frame. If your entity needs to do some sort of state update,
        // say it has a finite lifespan, do that here. You don't need to have this function if
        // your entity doesn't need to update. I've included it here for reference and it can
        // be deleted.
    }
    collide(obj) {
        // This function is called when another game object collides with this one. Basically
        // When they're on the same tile.

        // This game object should only react to the player:
        if (obj.category === 'player') {
            // Check if all pickups have been 
            console.log('ow, the player stepped on me');
        }
    }
}
ObjectFactory.register('destination', Exit);