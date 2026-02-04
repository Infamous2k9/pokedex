import type { PokemonModel } from "../models/pokemon.model";
import { getTypesTemplate } from "./pokemon-type";

export function getCardTemplate (data: PokemonModel){
  let typesHTML = ""
  const mainType = data.types[0]
  
  for (const type of data.types) {
    typesHTML += getTypesTemplate(type)
  }  

  return `
    <article class="card type--${mainType}" data-pokemon-id="${data.id}">

      <img class="card__image" src="${data.img}" alt="${data.name} image">
      <div class="card__header">
        <p>#${data.id}</p>
        <h1>${data.name}</h1>
      </div>
      <div class="card__types">
        ${typesHTML}
      </div>
    </article>
    `
}