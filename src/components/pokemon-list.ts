import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData } from "../api/pokemon.api"
import { PokemonModel } from "../models/pokemon.model"
import { getCardTemplate } from "../templates/pokemon-card"


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
        //PokemonCards Trigger
        const pokemonIdListRef = document.querySelectorAll<HTMLElement>('*[data-pokemon-id]')
        for (const element of pokemonIdListRef) {
            element.addEventListener("click", () =>{
                const cardId =  element.getAttribute("data-pokemon-id")
                this.loadPokemonDetails(Number(cardId))
            })
        }
        //Load More Btn
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
    const newPokemon = []

    for (const element of jsonData.results) {
        let pokemonJson = await getPokemonData(element.url)
        newPokemon.push(this.mapPokemon(pokemonJson))
    }
    
    this.vars.allPokemon.push(...newPokemon)
    this.vars.offset += this.vars.limit
    this.buildCard()
    this.addEventTrigger()
    this.vars.isLoading = false
    },

    loadPokemonDetails(id: number){
        console.log(id);
        
    },

    mapPokemon(dataJson: any){
        let pokemonData = {
        id: dataJson.id,
        name: dataJson.name,
        img: dataJson.sprites.other.dream_world.front_default,
        types: dataJson.types.map((t: any) => t.type.name),
        stats: dataJson.stats.map((n: any) => ({
            baseStat: n.base_stat,
            name: n.stat.name
        })),
        weight: dataJson.weight,
        height: dataJson.height
        }
        return pokemonData
    }

}