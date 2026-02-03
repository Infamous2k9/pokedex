import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData } from "../api/pokemon.api"
import { PokemonModel } from "../models/pokemon.model"
import { getCardTemplate } from "../templates/pokemon-card"
import { getTypesTemplate } from "../templates/pokemon-type"


export const pokedexList = {
    vars: {
        offset : 0,
        limit : 20,
        isLoading : false,
        allPokemon: [] as any[],
        
    },
    init(){
        this.addNextPokemon()
    },

    buildCard() {
        const pokemonListRef = document.querySelector<HTMLDivElement>('[data-pokemon-list]')

        if (!pokemonListRef) return

        let listHtml = ""

        const startIndex = pokemonListRef.children.length

        for (let i = startIndex; i < this.vars.allPokemon.length; i++) {
            const element = this.vars.allPokemon[i]
            const poke = new PokemonModel(element.id, element.name, element.img, element.types)
            listHtml += getCardTemplate(poke)
        }

        pokemonListRef.insertAdjacentHTML("beforeend", listHtml)
    },

    addEventTrigger(){
        const loadBtn = document.querySelector<HTMLButtonElement>('[data-load-more]')
        
        loadBtn?.addEventListener("click", ()=>{
            console.log("next");
            this.addNextPokemon()
        })
    },
    async addNextPokemon() {
    if (this.vars.isLoading) return
    this.vars.isLoading = true

    let jsonData = await getNextPokemonData(this.vars.offset, this.vars.limit)

    for (const element of jsonData.results) {
        let pokemonJson = await getPokemonData(element.url)

        let pokemonData = {
        id: pokemonJson.id,
        name: pokemonJson.name,
        img: pokemonJson.sprites.other.dream_world.front_default,
        types: pokemonJson.types.map((t: any) => t.type.name),
        stats: pokemonJson.stats.map((n: any) => ({
            baseStat: n.base_stat,
            name: n.stat.name
        })),
        weight: pokemonJson.weight,
        height: pokemonJson.height
        }

        this.vars.allPokemon.push(pokemonData)
    }

    this.vars.offset += this.vars.limit
    this.buildCard()
    this.addEventTrigger()
    this.vars.isLoading = false
    }

}