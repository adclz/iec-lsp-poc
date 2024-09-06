export class GapBuffer<T> {
    private map: Map<number, T>;  // Stores offset as key and associated data as value

    constructor() {
        this.map = new Map<number, T>();
    }

    // Inserts a new entry at the specified offset and shifts subsequent offsets
    insert(offset: number, data: T, cb?: (data: T, newIndex: number) => void): void {
        // Shift all offsets greater than or equal to the insertion point
        this.shiftOffsets(offset, 1);
        this.map.set(offset, data);
    }

    // Deletes the entry at the specified offset and shifts subsequent offsets
    delete(offset: number, cb?: (data: T, newIndex: number) => void): void {
        if (this.map.has(offset)) {
            this.map.delete(offset);
            // Shift all offsets greater than the deleted offset
            this.shiftOffsets(offset + 1, -1);
        }
    }

    swap(offset: number, data: T): void {
        this.map.set(offset, data);
    }

    // Shifts all offsets starting from the given offset by the specified amount
    private shiftOffsets(startOffset: number, shiftAmount: number, cb?: (data: T, newIndex: number) => void): void {
        const newMap = new Map<number, T>();

        this.map.forEach((value, key) => {
            if (key >= startOffset) {
                newMap.set(key + shiftAmount, value);  // Shift the key by the amount
                if (cb) cb(value, key + shiftAmount);
            } else {
                newMap.set(key, value);  // Keep the key unchanged
            }
        });

        this.map = newMap;
    }

    // Gets the data associated with the specified offset
    get(offset: number): T | undefined {
        return this.map.get(offset);
    }

    // Returns all entries in the map sorted by offset
    getSortedEntries(): [number, T][] {
        return Array.from(this.map.entries()).sort(([offsetA], [offsetB]) => offsetA - offsetB);
    }

    // Returns the current state of the map as an object
    getAllEntries(): { [key: number]: T } {
        return Object.fromEntries(this.map);
    }

    keys(): IterableIterator<number> {
        return this.map.keys();
    }

    values(): IterableIterator<T> {
        return this.map.values();
    } 
}