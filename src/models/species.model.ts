import type { Species } from "../interfaces/species";

export class SpeciesModel implements Species {
    private speciesData: any


    constructor(data: any){
        this.speciesData = data
    }

    get flavorText(): string{
        return this.speciesData.flavor_text_entries[0].flavor_text.replace(/\n/g, " ")
    }
    get evoChainUrl(): string{
        return this.speciesData.evolution_chain.url
    }
}