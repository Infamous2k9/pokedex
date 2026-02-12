import type { Species } from "../interfaces/species";

export class SpeciesModel implements Species {
    private speciesData: any


    constructor(data: any){
        this.speciesData = data
    }

    get flavorText(): string{
        const flavorTextEntries = this.speciesData.flavor_text_entries
        let flavorTextEn = ""
        for (const element of flavorTextEntries) {
            if(element.language.name === "en") 
                flavorTextEn = element.flavor_text.replace(/\n/g, " ")
        }
        return flavorTextEn
    }
    get evoChainUrl(): string{
        return this.speciesData.evolution_chain.url
    }
}