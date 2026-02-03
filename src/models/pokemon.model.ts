import type { Pokemon } from "../interfaces/pokemon";

export class PokemonModel implements Pokemon {
    id: number;
    name: string;
    img: string;
    types: string[];
    
    constructor(id: number, name: string, img: string, types: string[]){
        this.id = id
        this.name = name
        this.img = img
        this.types = types
    }
    getId() {
        return this.id
    }
    getName() {
        return this.name
    }
    getImg() {
        return this.img
    }
    getTypes() {
        return this.types
    }
}