"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UID {
    static generate(length) {
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * this.characters.length);
            this.id += this.characters[randomIndex];
        }
        return this.id;
    }
}
UID.characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
exports.default = UID;
