import type { PokemonModel } from "../models/pokemon.model";

export function getCardTemplate (data: PokemonModel){
    return `
    <article class="card">
      <div class="card__header">
        <p>#${data.getId()}</p>
        <h1>${data.getName()}</h1>
      </div>
      <img class="card__image" src="${data.getImg()}" alt="${data.getName()} image">
      <div class="card__types" data-pokemon-types></div>
    </article>
    `
}