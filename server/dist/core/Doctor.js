"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Doctor {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.available = false;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getAvailability() {
        return this.available;
    }
    setAvailable(isAvailable) {
        this.available = isAvailable;
    }
}
exports.default = Doctor;
