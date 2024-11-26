"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Patient {
    constructor(name, description) {
        this.id = Patient.inc++;
        this.name = name;
        this.description = description;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    setName(name) {
        this.name = name;
    }
    getDescription() {
        return this.description;
    }
    setDescription(description) {
        this.description = description;
    }
}
Patient.inc = 1; // Static counter for unique IDs
exports.default = Patient;
