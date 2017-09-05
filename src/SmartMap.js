export default class SmartMap {
    constructor() {
        this.storage = new Map();
    }

    set(coordinates, value) {
        let x = coordinates[0];
        let y = coordinates[1];
        let storage = this.storage;
        if (storage.has(x))
        {
            this.storage.set(x,storage.get(x).set(y,value));
        }
        else
        {
            let newStorage = new Map();
            newStorage.set(y,value);
            this.storage.set(x, newStorage);
        }
    }

    get(coordinates) {
        let x = coordinates[0];
        let y = coordinates[1];
        if (this.storage.has(x) && this.storage.get(x).has(y))
        {
            return this.storage.get(x).get(y);
        }

        return undefined;
    }
}
