import { MapObject } from './objects.js';
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

