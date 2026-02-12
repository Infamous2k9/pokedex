import { getEvoChainByUrl } from "../api/evo-chain.api"
import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData, getPokemonDataById, getPokemonDataByName } from "../api/pokemon.api"
import { getPokemonSpeciesByUrl } from "../api/species.api"
import { EvolutionChainModel } from "../models/evo-chain.model"
import { PokemonModel } from "../models/pokemon.model"
import { SpeciesModel } from "../models/species.model"
import { getCardTemplate } from "../templates/pokemon-card"
import { getDetailsTemplate } from "../templates/pokemon-details"

const loadingRef = document.querySelector("[data-loading]")

export const pokedexList = {
    vars: {
        offset: 0,
        limit: 20,
        isLoading: false,
        allPokemon: [] as PokemonModel[],
        filteredPokemon: [] as PokemonModel[],
        maxPokemon: 1025
    },
    
    init(){
        this.addSearchListener()
        this.addNextPokemon()
    },
    showLoading() {
        if(!loadingRef) return
        loadingRef.classList.remove("d-none")
    },
    hideLoading() {
        if(!loadingRef) return
        setTimeout(()=>loadingRef.classList.add("d-none"),800)
        
    },

     addSearchListener() {
        const searchInput = document.querySelector<HTMLInputElement>('[data-pokemon-search]') 
        if (!searchInput) return
        
        searchInput.addEventListener("input", async (e) => {
            if (!(e.target instanceof HTMLInputElement)) return
            const value = e.target.value.toLowerCase().trim()
            
                // lokal filter
                this.vars.filteredPokemon = this.vars.allPokemon.filter(p =>
                p.name.includes(value)
                )
    
                // not found → API-Call
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
        this.showLoading
        try {
            const pokemonJson = await getPokemonDataByName(name)
            const pokemonData = new PokemonModel(pokemonJson)
            this.vars.filteredPokemon.push(pokemonData)
        } catch (err) {
            // not found
            this.vars.filteredPokemon = []
        }
        this.hideLoading()
    },

    renderFiltered() {
        const pokemonListRef = document.querySelector<HTMLDivElement>('[data-pokemon-list]')
        if (!pokemonListRef) return

        pokemonListRef.innerHTML = ""


        if (this.vars.filteredPokemon.length === 0) {
            pokemonListRef.innerHTML = `
            <p class="no-results">
                404 Pokémon not found
            </p>
            `
            return
        }

        let html = ""
        for (const element of this.vars.filteredPokemon) {
            html += getCardTemplate(element)
        }

        pokemonListRef.innerHTML = html
        this.addCardTrigger()
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
        
        this.addCardTrigger()

        //Load More Btn
        const loadBtn = document.querySelector<HTMLButtonElement>('[data-load-more]')
        loadBtn?.addEventListener("click", ()=>{
            ("next");
            this.addNextPokemon()
        })
    },
    
    addCardTrigger(){
        //PokemonCards Trigger
        const pokemonIdListRef = document.querySelectorAll<HTMLElement>('*[data-pokemon-id]')
        const overlayRef = document.querySelector('[data-overlay]')
        
        for (const element of pokemonIdListRef) {
            element.addEventListener("click", () =>{
                const cardId =  element.getAttribute("data-pokemon-id")
                this.loadPokemonDetails(Number(cardId))
                overlayRef!.classList.toggle("d-none")
                
            })
        }

    },

    async addNextPokemon() {
        this.showLoading()
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
        this.vars.offset += this.vars.limit
        this.buildCard()
        this.addEventTrigger()
        this.vars.isLoading = false
        this.hideLoading()
    },

    async loadPokemonDetails(id: number){
        this.showLoading()
        let selectedPokemon: any
        //load Pokemon
        for (const pokemon of this.vars.allPokemon) {
            if(pokemon.id == id){                
                selectedPokemon = pokemon      
            }else{
                for (const pokemon of this.vars.filteredPokemon)
                    if(pokemon.id == id) selectedPokemon = pokemon
            }
        }
        if(!selectedPokemon){
           selectedPokemon = new PokemonModel(await getPokemonDataById(id))
        }
        const species = await this.loadSpecices(selectedPokemon)
        const evoNames = await this.loadChain(species)

        this.hideLoading()
        this.buildDetails(selectedPokemon,species,evoNames)
        this.addDetailsTrigger()
    },

    async loadSpecices(pokemon: PokemonModel){
        let species: SpeciesModel

        species = new SpeciesModel(await getPokemonSpeciesByUrl(pokemon.speciesURL))

        return species
    },
    
    async loadChain(species: SpeciesModel){
        let evoChain: EvolutionChainModel

        const evoChainJson = await getEvoChainByUrl(species.evoChainUrl)
        evoChain = new EvolutionChainModel(evoChainJson.chain)
        const evoNames = this.solveChain(evoChain)

        return evoNames
    },

    buildDetails(selectedPokemon: any, species: any, evoNames: any){
        const pokemonDetailsRef = document.querySelector<HTMLDivElement>('[data-pokemon-details]')

        if(!pokemonDetailsRef) return
        pokemonDetailsRef.innerHTML = getDetailsTemplate(selectedPokemon, species, evoNames)

        const overlayRef = document.querySelector('[data-overlay]')
        const colseBtnRef = document.querySelector('[data-close-btn]')

        if(!overlayRef && !colseBtnRef) return
        colseBtnRef?.addEventListener("click", ()=> overlayRef?.classList.toggle("d-none"))
    },

    addDetailsTrigger(){
        const prevBtn = document.querySelector<HTMLButtonElement>('[data-prev-pokemon]')
        const nextBtn = document.querySelector<HTMLButtonElement>('[data-next-pokemon]')

        //prevCardBtn
        if(!prevBtn) return

        prevBtn.addEventListener('click', 
            ()=>this.loadPrevPokemon(Number(prevBtn.getAttribute('data-prev-pokemon'))))

        //nextCardBtn
        if(!nextBtn) return
        
        nextBtn.addEventListener('click', 
            ()=>this.loadNextPokemon(Number(nextBtn.getAttribute('data-next-pokemon'))))
    },

    loadNextPokemon(id: number){
        if(id > this.vars.maxPokemon){
            this.loadPokemonDetails(1)
        }else{
            this.loadPokemonDetails(id)
        }
    },
    loadPrevPokemon(id: number){
        if(id < 1){
            this.loadPokemonDetails(this.vars.maxPokemon)
        }else{
            this.loadPokemonDetails(id)
        }
    },

    async loadFlavorText(url: string){
        
        let dataJson = await getPokemonSpeciesByUrl(url)
        
        return await dataJson.flavor_text_entries[0].flavor_text
    },

    solveChain(chain: EvolutionChainModel) {
        const result: string[] = []

        const traverse = (node: EvolutionChainModel) => {
            result.push(node.name)

            for (const next of node.evolvesTo) {
            traverse(next)
            }
        }

        traverse(chain)

        console.log("Evolution Chain:", result)
        return result
    }
}