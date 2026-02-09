import type { Pokemon } from "../interfaces/pokemon";

export class PokemonModel implements Pokemon {
    private data: any
    private species: {
        name: string,
        url: string
    }
    
    constructor(data: any){
        this.data = data
        this.species = this.data.species
    }
    get id(): number{
        return this.data.id
    }
    get name():string{
        return this.data.name
    }
    get img(): string{
        return this.data.sprites.other['official-artwork'].front_default
    }
    get types(): string[]{
        return this.data.types.map((t: any) => t.type.name)
    }
    get weight():number{
        return this.data.weight
    }
    get height():number{
        return this.data.height
    }
    get speciesURL(): string{
        return this.species.url
    }
    get stats(): any{
        return this.data.stats
    }
}