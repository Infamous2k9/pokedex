import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData } from "../api/pokemon.api"
import { PokemonModel } from "../models/pokemon.model"
import { getCardTemplate } from "../templates/pokemon-card"

export const pokedexList = {
    vars: {
        offset : 0,
        limit : 20,
        isLoading : false,
        allPokemon: [] as PokemonModel[],
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
            listHtml += getCardTemplate(element)
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

        let pokemonsfetchData = await getNextPokemonData(this.vars.offset, this.vars.limit)
        const newPokemon:PokemonModel[] = []
        
        for (const element of pokemonsfetchData.results) {
            let pokemonJson = await getPokemonData(element.url)
            newPokemon.push(new PokemonModel(pokemonJson))
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
}