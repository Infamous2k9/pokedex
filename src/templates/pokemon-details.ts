import type { PokemonModel } from "../models/pokemon.model";

export function getDetailsTemplate(pokemon: PokemonModel){
    let statsHTML = ""
    let mainType = pokemon.types[0]
    for (const stat of pokemon.stats) {
        statsHTML += `
                    <ul>
                        <li>${stat.stat.name}</li>
                        <li>${stat.base_stat}</li>
                        <li>Bar</li>
                    </ul>`
    }

    return`
        <div class="pokemon__header">
            <button class="pokemon-close-btn" data-close-btn>X</button>
            <img class="type-${mainType}" src="${pokemon.img}" alt="pokemon img">
            <h3>${pokemon.name}</h3>
        </div>
        <div class="pokemon__details">
            <p>flavor text</p>
            <div class="pokemon__stats">
                ${statsHTML}
            </div>
            <div class="pokemon__evolution-chain">
              pokemon__evolution-chain
            </div>
        </div>
    `
}