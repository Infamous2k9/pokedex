import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData, getPokemonDataByName } from "../api/pokemon.api"
import { PokemonModel } from "../models/pokemon.model"
import { getCardTemplate } from "../templates/pokemon-card"

export const pokedexList = {
    vars: {
        offset : 0,
        limit : 20,
        isLoading : false,
        allPokemon: [] as PokemonModel[],
        filteredPokemon: [] as PokemonModel[]
    },
    
    init(){
        this.addSearchListener()
        this.addNextPokemon()
    },

     addSearchListener() {
        const searchInput = document.querySelector<HTMLInputElement>('[data-pokemon-search]')

        if (!searchInput) return

        searchInput.addEventListener("input", async (e) => {
            if (!(e.target instanceof HTMLInputElement)) return
            const value = e.target.value.toLowerCase().trim()

            // if (value === "") {
            //     this.vars.filteredPokemon = this.vars.allPokemon
            // } else {
            //     this.vars.filteredPokemon = this.vars.allPokemon.filter(p => p.name.includes(value))
            // }

            // lokal filtern
            this.vars.filteredPokemon = this.vars.allPokemon.filter(p =>
            p.name.includes(value)
            )

            // nichts gefunden → API-Call
            if (this.vars.filteredPokemon.length === 0 && value !== "") {
                await this.searchPokemonFromApi(value)
            }

            this.renderFiltered()
        })
    },

    async searchPokemonFromApi(name: string) {
        // Cache?
        const exists = this.vars.allPokemon.some(p => p.name === name)
        if (exists) return

        try {
            const pokemonJson = await getPokemonDataByName(name)

            const pokemonData = new PokemonModel(pokemonJson)

            // Caching
            this.vars.allPokemon.push(pokemonData)
            this.vars.filteredPokemon = [pokemonData]

        } catch (err) {
            // wirklich nicht gefunden
            this.vars.filteredPokemon = []
        }
    },


    renderFiltered() {
        const pokemonListRef = document.querySelector<HTMLDivElement>('[data-pokemon-list]')
        if (!pokemonListRef) return

        pokemonListRef.innerHTML = ""


        if (this.vars.filteredPokemon.length === 0) {
            pokemonListRef.innerHTML = `
            <p class="no-results">
                Kein Pokémon gefunden
            </p>
            `
            return
        }

        let html = ""
        for (const element of this.vars.filteredPokemon) {
            html += getCardTemplate(element)
        }

        pokemonListRef.innerHTML = html
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
        //fetch all pokemon as json
        let pokemonsfetchData = await getNextPokemonData(this.vars.offset, this.vars.limit)

        //convert json to pokemon model
        const newPokemon:PokemonModel[] = []
        for (const element of pokemonsfetchData.results) {
            let pokemonJson = await getPokemonData(element.url)
            newPokemon.push(new PokemonModel(pokemonJson))
        }
        
        this.vars.allPokemon.push(...newPokemon)
        this.vars.filteredPokemon = this.vars.allPokemon
        this.vars.offset += this.vars.limit
        this.buildCard()
        this.addEventTrigger()
        this.vars.isLoading = false
    },

    loadPokemonDetails(id: number){
        let selectedPokemon
        
        for (const pokemon of this.vars.allPokemon) {
            if(pokemon.id == id){                
                selectedPokemon = pokemon
            }
        }
        console.log(id);
        console.log(selectedPokemon);
    },
}