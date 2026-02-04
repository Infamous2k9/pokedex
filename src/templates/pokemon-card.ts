import type { PokemonModel } from "../models/pokemon.model";
import { getTypesTemplate } from "./pokemon-type";

export function getCardTemplate (data: PokemonModel){
  let typesHTML = ""
  const mainType = data.getTypes()[0]
  
  for (const type of data.getTypes()) {
    typesHTML += getTypesTemplate(type)
  }  

  return `
    <article class="card type-${mainType}" data-pokemon-id="${data.getId()}">

      <img class="card__image" src="${data.getImg()}" alt="${data.getName()} image">
      <div class="card__header">
        <p>#${data.getId()}</p>
        <h1>${data.getName()}</h1>
      </div>
      <div class="card__types">
        ${typesHTML}
      </div>
    </article>
    `
}