import type { PokemonModel } from "../models/pokemon.model";
import type { SpeciesModel } from "../models/species.model";

export function getDetailsTemplate(pokemon: PokemonModel, species: SpeciesModel, evoChain: string[]){
    let statsHTML = ""
    let evoChainHtml = ""
    let mainType = pokemon.types[0]
    for (const stat of pokemon.stats) {
        statsHTML += `
                    <ul class="stat">
                        <li class="stat-name">${stat.stat.name}</li>
                        <li class="stat-value">${stat.base_stat}</li>
                        <li class="stat-bar">
                            <span style="--stat: ${stat.base_stat}"></span>
                        </li>
                    </ul>`
    }
    for (const chain of evoChain) {
        evoChainHtml += chain + " "
    }
    

    return`
        <div class="pokemon border-color--${mainType}">
        <div class="pokemon__header">
            <button class="pokemon-close-btn" data-close-btn>X</button>
            <div class="image-wrapper">
            <button data-prev-pokemon="${pokemon.id-1}"><</button>
            <img class="bg-shadow-${mainType}" src="${pokemon.img}" alt="pokemon img">
            <button data-next-pokemon="${pokemon.id+1}">></button>
            </div>
            <h3>${pokemon.name}</h3>
        </div>
        <div class="pokemon__details">
            <p>${species.flavorText}</p>
            <div class="pokemon__stats">
                ${statsHTML}
            </div>
            <div class="pokemon__evolution-chain d-none">
              ${evoChainHtml}
            </div>
        </div>
        </div>
    `
}