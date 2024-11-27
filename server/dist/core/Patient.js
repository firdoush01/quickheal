"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Patient {
    constructor(id, name, description) {
        this.id = id;
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
exports.default = Patient;
