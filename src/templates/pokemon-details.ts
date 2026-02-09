import type { PokemonModel } from "../models/pokemon.model";
import type { SpeciesModel } from "../models/species.model";

export function getDetailsTemplate(pokemon: PokemonModel, species: SpeciesModel, evoChain: string[]){
    let statsHTML = ""
    let evoChainHtml = ""
    let mainType = pokemon.types[0]
    for (const stat of pokemon.stats) {
        statsHTML += `
                    <ul class="stat">
                        <li>${stat.stat.name}</li>
                        <li>${stat.base_stat}</li>
                        <li>Bar</li>
                    </ul>`
    }
    for (const chain of evoChain) {
        evoChainHtml += chain + " "
    }
    

    return`
        <div class="pokemon__header">
            <button class="pokemon-close-btn" data-close-btn>X</button>
            <img class="type-${mainType}" src="${pokemon.img}" alt="pokemon img">
            <h3>${pokemon.name}</h3>
        </div>
        <div class="pokemon__details">
            <p>${species.flavorText}</p>
            <div class="pokemon__stats">
                ${statsHTML}
            </div>
            <div class="pokemon__evolution-chain">
              ${evoChainHtml}
            </div>
        </div>
    `
}