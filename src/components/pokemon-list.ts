import { getEvoChainByUrl } from "../api/evo-chain.api"
import { getNextPokemonData } from "../api/pokedex.api"
import { getPokemonData, getPokemonDataByName } from "../api/pokemon.api"
import { getPokemonSpeciesByUrl } from "../api/species.api"
import { EvolutionChainModel } from "../models/evo-chain.model"
import { PokemonModel } from "../models/pokemon.model"
import { SpeciesModel } from "../models/species.model"
import { getCardTemplate } from "../templates/pokemon-card"
import { getDetailsTemplate } from "../templates/pokemon-details"

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

        try {
            const pokemonJson = await getPokemonDataByName(name)

            const pokemonData = new PokemonModel(pokemonJson)

            // Caching
            //  this.vars.allPokemon.push(pokemonData)
            //  this.vars.allPokemon.sort((a,b) => a.id - b.id)   // <----- Big Bug
            this.vars.filteredPokemon.push(pokemonData)

        } catch (err) {
            // not found
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
            console.log("next");
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
        //this.vars.filteredPokemon = this.vars.allPokemon
        this.vars.offset += this.vars.limit
        this.buildCard()
        this.addEventTrigger()
        this.vars.isLoading = false
    },

    async loadPokemonDetails(id: number){
        let selectedPokemon: any
        let species: any
        let evoChain: any
        
        //load Pokemon
        for (const pokemon of this.vars.allPokemon) {
            if(pokemon.id == id){                
                selectedPokemon = pokemon      
            }else{
                for (const pokemon of this.vars.filteredPokemon)
                    if(pokemon.id == id) selectedPokemon = pokemon
            }
        }

        
        //load Species
        species = new SpeciesModel(await getPokemonSpeciesByUrl(selectedPokemon.speciesURL))

        //load Evo Chain
        const evoChainJson = await getEvoChainByUrl(species.evoChainUrl)

        // ⬇️ WICHTIG
        evoChain = new EvolutionChainModel(evoChainJson.chain)
        const evoNames = this.solveChain(evoChain)

        
        

        
        


        const pokemonDetailsRef = document.querySelector<HTMLDivElement>('[data-pokemon-details]')

        if(!pokemonDetailsRef) return
        pokemonDetailsRef.innerHTML = getDetailsTemplate(selectedPokemon, species, evoNames)

        const overlayRef = document.querySelector('[data-overlay]')
        const colseBtnRef = document.querySelector('[data-close-btn]')

        if(!overlayRef && !colseBtnRef) return
        colseBtnRef?.addEventListener("click", ()=> overlayRef?.classList.toggle("d-none"))
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